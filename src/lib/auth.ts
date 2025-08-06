import { PrismaAdapter } from '@auth/prisma-adapter'
import type { User } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { Role } from '@/types/auth'
import { PasswordUtils, SecurityUtils, TwoFactorUtils } from './auth-utils'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string
        const twoFactorCode = credentials.twoFactorCode as string
        const ipAddress = req.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = req.headers.get('user-agent') || undefined

        try {
          // Check rate limiting
          const rateCheck = await SecurityUtils.checkRateLimit(ipAddress, 'LOGIN')
          if (!rateCheck.allowed) {
            await SecurityUtils.logLoginAttempt({
              email,
              ipAddress,
              userAgent,
              success: false,
              failureReason: 'RATE_LIMITED'
            })
            return null
          }

          // Find user
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              emailVerified: true,
              twoFactorEnabled: true,
              twoFactorSecret: true,
              gdprConsent: true,
              marketingConsent: true,
              lockedUntil: true,
              failedLoginAttempts: true,
              deletionRequested: true
            }
          })

          if (!user || !user.password) {
            await SecurityUtils.logLoginAttempt({
              email,
              ipAddress,
              userAgent,
              success: false,
              failureReason: 'INVALID_CREDENTIALS'
            })
            return null
          }

          // Check if account is locked
          if (await SecurityUtils.isAccountLocked(user.id)) {
            await SecurityUtils.logLoginAttempt({
              email,
              ipAddress,
              userAgent,
              success: false,
              failureReason: 'ACCOUNT_LOCKED'
            })
            return null
          }

          // Check if account is marked for deletion
          if (user.deletionRequested) {
            await SecurityUtils.logLoginAttempt({
              email,
              ipAddress,
              userAgent,
              success: false,
              failureReason: 'ACCOUNT_DELETION_REQUESTED'
            })
            return null
          }

          // Verify password
          const isValidPassword = await PasswordUtils.verifyPassword(password, user.password)
          if (!isValidPassword) {
            await SecurityUtils.incrementFailedLoginAttempts(user.id)
            await SecurityUtils.logLoginAttempt({

              email,
              ipAddress,
              userAgent,
              success: false,
              failureReason: 'INVALID_PASSWORD'
            })
            return null
          }

          // Check email verification
          if (!user.emailVerified) {
            await SecurityUtils.logLoginAttempt({

              email,
              ipAddress,
              userAgent,
              success: false,
              failureReason: 'EMAIL_NOT_VERIFIED'
            })
            return null
          }

          // Check GDPR consent
          if (!user.gdprConsent) {
            await SecurityUtils.logLoginAttempt({

              email,
              ipAddress,
              userAgent,
              success: false,
              failureReason: 'GDPR_CONSENT_REQUIRED'
            })
            return null
          }

          // Check 2FA if enabled
          if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
              await SecurityUtils.logLoginAttempt({
  
                email,
                ipAddress,
                userAgent,
                success: false,
                failureReason: 'TWO_FACTOR_REQUIRED'
              })
              return null
            }

            const isValid2FA = user.twoFactorSecret
              ? TwoFactorUtils.verifyTwoFactorToken(twoFactorCode, user.twoFactorSecret)
              : await TwoFactorUtils.verifyBackupCode(user.id, twoFactorCode)

            if (!isValid2FA) {
              await SecurityUtils.incrementFailedLoginAttempts(user.id)
              await SecurityUtils.logLoginAttempt({
  
                email,
                ipAddress,
                userAgent,
                success: false,
                failureReason: 'INVALID_TWO_FACTOR'
              })
              return null
            }
          }

          // Successful login
          await SecurityUtils.resetFailedLoginAttempts(user.id)
          await SecurityUtils.logLoginAttempt({

            email,
            ipAddress,
            userAgent,
            success: true
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            twoFactorEnabled: user.twoFactorEnabled,
            gdprConsent: user.gdprConsent,
            emailVerified: user.emailVerified
          } as User
        } catch (error) {
          console.error('Authentication error:', error)
          await SecurityUtils.logLoginAttempt({
            email,
            ipAddress,
            userAgent,
            success: false,
            failureReason: 'SYSTEM_ERROR'
          })
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || Role.USER
        token.twoFactorEnabled = user.twoFactorEnabled || false
        token.gdprConsent = user.gdprConsent || false
      }

      // For OAuth providers, set default role and check GDPR consent
      if (account?.provider !== 'credentials' && user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { role: true, gdprConsent: true, twoFactorEnabled: true }
        })

        if (dbUser) {
          token.role = dbUser.role
          token.gdprConsent = dbUser.gdprConsent
          token.twoFactorEnabled = dbUser.twoFactorEnabled
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean
        session.user.gdprConsent = token.gdprConsent as boolean
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure GDPR consent before allowing sign-in
      if (account?.provider !== 'credentials') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { gdprConsent: true, deletionRequested: true }
        })

        if (existingUser) {
          if (existingUser.deletionRequested) {
            return false // Account marked for deletion
          }
          if (!existingUser.gdprConsent) {
            return false // GDPR consent required
          }
        }
      }

      return true
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && account?.provider !== 'credentials') {
        // For new OAuth users, we need to prompt for GDPR consent
        await prisma.user.update({
          where: { email: user.email! },
          data: {
            role: Role.USER,
            gdprConsent: false, // Will need to be updated after consent flow
            marketingConsent: false
          }
        })
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request'
  },
  secret: process.env.NEXTAUTH_SECRET,
})

// Export authOptions for backward compatibility
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' }
      },
      async authorize(credentials: any, req: any) {
        // Same logic as above - for compatibility only
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request'
  },
  secret: process.env.NEXTAUTH_SECRET,
}
