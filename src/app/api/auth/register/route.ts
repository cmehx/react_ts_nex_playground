import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { GDPRUtils, PasswordUtils, SecurityUtils, TokenUtils } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { Role } from '@/types/auth'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  confirmPassword: z.string(),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent is required'),
  marketingConsent: z.boolean().optional().default(false)
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || undefined

    // Check rate limiting
    const rateCheck = await SecurityUtils.checkRateLimit(ipAddress, 'REGISTRATION')
    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: {
          type: 'RATE_LIMITED',
          message: `Too many registration attempts. Try again in ${Math.ceil((rateCheck.resetTime!.getTime() - Date.now()) / 60000)} minutes.`
        }
      }, { status: 429 })
    }

    // Validate password strength
    const passwordValidation = PasswordUtils.validatePassword(validatedData.password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: {
          type: 'INVALID_PASSWORD',
          message: 'Password does not meet security requirements',
          details: passwordValidation.errors
        }
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true, deletionRequested: true }
    })

    if (existingUser) {
      if (existingUser.deletionRequested) {
        return NextResponse.json({
          success: false,
          error: {
            type: 'ACCOUNT_DELETION_REQUESTED',
            message: 'An account with this email is scheduled for deletion. Please contact support.'
          }
        }, { status: 409 })
      }

      return NextResponse.json({
        success: false,
        error: {
          type: 'EMAIL_EXISTS',
          message: 'An account with this email already exists'
        }
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: Role.USER,
        gdprConsent: validatedData.gdprConsent,
        gdprConsentDate: new Date(),
        marketingConsent: validatedData.marketingConsent,
        emailVerified: null, // Will be set when email is verified
        twoFactorEnabled: false,
        failedLoginAttempts: 0,
        deletionRequested: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gdprConsent: true,
        marketingConsent: true
      }
    })

    // Log GDPR consent
    await GDPRUtils.logConsent({
      userId: user.id,
      consentType: 'GDPR',
      granted: validatedData.gdprConsent,
      ipAddress,
      userAgent
    })

    if (validatedData.marketingConsent) {
      await GDPRUtils.logConsent({
        userId: user.id,
        consentType: 'MARKETING',
        granted: true,
        ipAddress,
        userAgent
      })
    }

    // Create email verification token
    const verificationToken = await TokenUtils.createEmailVerificationToken(user.email)

    // TODO: Send verification email
    // await EmailService.sendVerificationEmail(user.email, user.name, verificationToken)

    // Log successful registration
    await SecurityUtils.logLoginAttempt({

      email: user.email,
      ipAddress,
      userAgent,
      success: true,
      failureReason: undefined
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        message: 'Account created successfully. Please check your email to verify your account.'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.issues
        }
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred during registration'
      }
    }, { status: 500 })
  }
}
