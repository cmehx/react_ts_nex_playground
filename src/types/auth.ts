import { type DefaultSession } from 'next-auth'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
      twoFactorEnabled: boolean
      gdprConsent: boolean
      emailVerified: Date | null
    } & DefaultSession['user']
  }

  interface User {
    role: Role
    twoFactorEnabled: boolean
    gdprConsent: boolean
    emailVerified: Date | null
  }
}

// JWT types will be handled in the auth configuration file
// declare module 'next-auth/jwt' {
//   interface JWT {
//     role: Role
//     twoFactorEnabled: boolean
//     gdprConsent: boolean
//   }
// }

// Enhanced authentication types
export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: Role
  emailVerified: Date | null
  twoFactorEnabled: boolean
  gdprConsent: boolean
  marketingConsent: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  twoFactorCode?: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  gdprConsent: boolean
  marketingConsent?: boolean
}

export interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  password: string
  confirmPassword: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  lastPasswordChange: Date | null
  failedLoginAttempts: number
  lockedUntil: Date | null
  lastLoginAt: Date | null
  lastLoginIp: string | null
}

export interface GDPRData {
  gdprConsent: boolean
  gdprConsentDate: Date | null
  marketingConsent: boolean
  dataRetentionDate: Date | null
  deletionRequested: boolean
  deletionRequestDate: Date | null
}

export interface DataExport {
  user: AuthUser
  posts: any[]
  comments: any[]
  loginHistory: any[]
  consentHistory: any[]
  exportDate: Date
}

export interface ConsentUpdate {
  consentType: 'GDPR' | 'MARKETING' | 'COOKIES' | 'ANALYTICS'
  granted: boolean
  ipAddress?: string
  userAgent?: string
}

// Password requirements for robust security
export interface PasswordRequirements {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSymbols: boolean
  commonPasswordCheck: boolean
}

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  commonPasswordCheck: true
}

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number
  maxAttempts: number
  blockDuration: number
}

export const RATE_LIMITS = {
  LOGIN: { windowMs: 15 * 60 * 1000, maxAttempts: 5, blockDuration: 30 * 60 * 1000 },
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, maxAttempts: 3, blockDuration: 60 * 60 * 1000 },
  REGISTRATION: { windowMs: 60 * 60 * 1000, maxAttempts: 5, blockDuration: 24 * 60 * 60 * 1000 }
} as const

// Error types for authentication
export interface AuthError {
  type: 'INVALID_CREDENTIALS' | 'EMAIL_NOT_VERIFIED' | 'ACCOUNT_LOCKED' | 'TWO_FACTOR_REQUIRED' | 'RATE_LIMITED' | 'GDPR_CONSENT_REQUIRED'
  message: string
  details?: any
}

// API Response types
export interface AuthResponse<T = any> {
  success: boolean
  data?: T
  error?: AuthError
}

export interface LoginAttemptData {
  userId?: string
  email: string
  ipAddress: string
  userAgent?: string
  success: boolean
  failureReason?: string
}

export interface EmailVerificationData {
  email: string
  token: string
  expiresAt: Date
}

export interface PasswordResetTokenData {
  userId: string
  token: string
  expiresAt: Date
}
