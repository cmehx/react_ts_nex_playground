import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'
import speakeasy from 'speakeasy'
import { DEFAULT_PASSWORD_REQUIREMENTS, type PasswordRequirements } from '@/types/auth'
import { prisma } from './prisma'

/**
 * Password utilities for robust security
 */
export class PasswordUtils {
    /**
     * Hash a password using bcrypt with salt rounds
     */
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12
        return bcrypt.hash(password, saltRounds)
    }

    /**
     * Verify a password against its hash
     */
    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    /**
     * Validate password against security requirements
     */
    static validatePassword(password: string, requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS): {
        isValid: boolean
        errors: string[]
    } {
        const errors: string[] = []

        if (password.length < requirements.minLength) {
            errors.push(`Password must be at least ${requirements.minLength} characters long`)
        }

        if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter')
        }

        if (requirements.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter')
        }

        if (requirements.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number')
        }

        if (requirements.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character')
        }

        // Check against common passwords (basic implementation)
        if (requirements.commonPasswordCheck && this.isCommonPassword(password)) {
            errors.push('Password is too common, please choose a more unique password')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Basic check for common passwords
     */
    private static isCommonPassword(password: string): boolean {
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890'
        ]
        return commonPasswords.includes(password.toLowerCase())
    }

    /**
     * Generate a secure random password
     */
    static generateSecurePassword(length: number = 16): string {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
        let password = ''

        // Ensure at least one character from each required category
        password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz') // lowercase
        password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ') // uppercase
        password += this.getRandomChar('0123456789') // numbers
        password += this.getRandomChar('!@#$%^&*') // symbols

        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += this.getRandomChar(charset)
        }

        // Shuffle the password
        return password.split('').sort(() => 0.5 - Math.random()).join('')
    }

    private static getRandomChar(charset: string): string {
        return charset.charAt(Math.floor(Math.random() * charset.length))
    }
}

/**
 * Two-Factor Authentication utilities
 */
export class TwoFactorUtils {
    /**
     * Generate a new 2FA secret and QR code
     */
    static async generateTwoFactorSecret(userEmail: string): Promise<{
        secret: string
        qrCode: string
        backupCodes: string[]
    }> {
        const secret = speakeasy.generateSecret({
            name: `Blog App (${userEmail})`,
            issuer: 'Modern Blog',
            length: 32
        })

        const qrCode = await QRCode.toDataURL(secret.otpauth_url!)
        const backupCodes = this.generateBackupCodes()

        return {
            secret: secret.base32!,
            qrCode,
            backupCodes
        }
    }

    /**
     * Verify a 2FA token
     */
    static verifyTwoFactorToken(token: string, secret: string): boolean {
        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 2 // Allow 2 time steps (60 seconds) of drift
        })
    }

    /**
     * Generate backup codes for 2FA
     */
    static generateBackupCodes(count: number = 10): string[] {
        const codes: string[] = []
        for (let i = 0; i < count; i++) {
            codes.push(randomBytes(4).toString('hex').toUpperCase())
        }
        return codes
    }

    /**
     * Verify a backup code
     */
    static async verifyBackupCode(userId: string, code: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { backupCodes: true }
        })

        if (!user || !user.backupCodes.includes(code)) {
            return false
        }

        // Remove the used backup code
        await prisma.user.update({
            where: { id: userId },
            data: {
                backupCodes: user.backupCodes.filter((c: string) => c !== code)
            }
        })

        return true
    }
}

/**
 * Token utilities for email verification and password reset
 */
export class TokenUtils {
    /**
     * Generate a secure random token
     */
    static generateSecureToken(length: number = 32): string {
        return randomBytes(length).toString('hex')
    }

    /**
     * Create an email verification token
     */
    static async createEmailVerificationToken(email: string): Promise<string> {
        const token = this.generateSecureToken()
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        await prisma.emailVerificationToken.create({
            data: {
                email,
                token,
                expires: expiresAt
            }
        })

        return token
    }

    /**
     * Verify an email verification token
     */
    static async verifyEmailToken(token: string): Promise<{ valid: boolean; email?: string }> {
        const tokenRecord = await prisma.emailVerificationToken.findUnique({
            where: { token }
        })

        if (!tokenRecord || tokenRecord.expires < new Date()) {
            return { valid: false }
        }

        // Delete the token after successful verification
        await prisma.emailVerificationToken.delete({
            where: { token }
        })

        return { valid: true, email: tokenRecord.email }
    }

    /**
     * Create a password reset token
     */
    static async createPasswordResetToken(email: string): Promise<string> {
        const token = this.generateSecureToken()
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        // Delete any existing tokens for this email
        await prisma.passwordResetToken.deleteMany({
            where: { email }
        })

        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires: expiresAt
            }
        })

        return token
    }

    /**
     * Verify a password reset token
     */
    static async verifyPasswordResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
        const tokenRecord = await prisma.passwordResetToken.findUnique({
            where: { token }
        })

        if (!tokenRecord || tokenRecord.expires < new Date()) {
            return { valid: false }
        }

        return { valid: true, email: tokenRecord.email }
    }

    /**
     * Delete a password reset token
     */
    static async deletePasswordResetToken(token: string): Promise<void> {
        await prisma.passwordResetToken.delete({
            where: { token }
        }).catch(() => {
            // Token might already be deleted, ignore error
        })
    }
}

/**
 * Security utilities for rate limiting and account protection
 */
export class SecurityUtils {
    /**
     * Log a login attempt
     */
    static async logLoginAttempt(data: {
        email: string
        ipAddress: string
        userAgent?: string
        success: boolean
        failureReason?: string
    }): Promise<void> {
        await prisma.loginAttempt.create({
            data: {
                email: data.email,
                ip: data.ipAddress,
                userAgent: data.userAgent,
                success: data.success
            }
        })
    }

    /**
     * Check if an IP is rate limited
     */
    static async checkRateLimit(ipAddress: string, type: 'LOGIN' | 'PASSWORD_RESET' | 'REGISTRATION'): Promise<{
        allowed: boolean
        remainingAttempts: number
        resetTime?: Date
    }> {
        const limits = {
            LOGIN: { windowMs: 15 * 60 * 1000, maxAttempts: 5 },
            PASSWORD_RESET: { windowMs: 60 * 60 * 1000, maxAttempts: 3 },
            REGISTRATION: { windowMs: 60 * 60 * 1000, maxAttempts: 5 }
        }

        const limit = limits[type]
        const windowStart = new Date(Date.now() - limit.windowMs)

        const attempts = await prisma.loginAttempt.count({
            where: {
                ip: ipAddress,
                createdAt: { gte: windowStart },
                success: false
            }
        })

        const remainingAttempts = Math.max(0, limit.maxAttempts - attempts)
        const allowed = remainingAttempts > 0

        return {
            allowed,
            remainingAttempts,
            resetTime: allowed ? undefined : new Date(Date.now() + limit.windowMs)
        }
    }

    /**
     * Check if a user account is locked
     */
    static async isAccountLocked(userId: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { lockedUntil: true }
        })

        return user?.lockedUntil ? user.lockedUntil > new Date() : false
    }

    /**
     * Lock a user account after failed attempts
     */
    static async lockAccount(userId: string, durationMs: number = 30 * 60 * 1000): Promise<void> {
        const lockedUntil = new Date(Date.now() + durationMs)

        await prisma.user.update({
            where: { id: userId },
            data: { lockedUntil }
        })
    }

    /**
     * Unlock a user account
     */
    static async unlockAccount(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: {
                lockedUntil: null,
                failedLoginAttempts: 0
            }
        })
    }

    /**
     * Increment failed login attempts
     */
    static async incrementFailedLoginAttempts(userId: string): Promise<number> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                failedLoginAttempts: { increment: 1 }
            },
            select: { failedLoginAttempts: true }
        })

        // Lock account after 5 failed attempts
        if (user.failedLoginAttempts >= 5) {
            await this.lockAccount(userId)
        }

        return user.failedLoginAttempts
    }

    /**
     * Reset failed login attempts on successful login
     */
    static async resetFailedLoginAttempts(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date()
            }
        })
    }
}

/**
 * GDPR compliance utilities
 */
export class GDPRUtils {
    /**
     * Log user consent
     */
    static async logConsent(data: {
        userId: string
        consentType: 'GDPR' | 'MARKETING' | 'COOKIES' | 'ANALYTICS'
        granted: boolean
        ipAddress?: string
        userAgent?: string
    }): Promise<void> {
        await prisma.consentLog.create({
            data: {
                userId: data.userId,
                consentType: data.consentType,
                granted: data.granted,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent
            }
        })
    }

    /**
     * Request data export for a user
     */
    static async requestDataExport(userId: string): Promise<string> {
        const request = await prisma.dataExportRequest.create({
            data: {
                userId,
                status: 'PENDING'
            }
        })

        return request.id
    }

    /**
     * Request account deletion for a user
     */
    static async requestDataDeletion(userId: string, reason?: string): Promise<string> {
        const request = await prisma.dataDeletionRequest.create({
            data: {
                userId,
                reason,
                status: 'PENDING'
            }
        })

        // Mark user for deletion
        await prisma.user.update({
            where: { id: userId },
            data: {
                deletionRequested: true,
                deletionRequestDate: new Date()
            }
        })

        return request.id
    }

    /**
     * Export user data in JSON format
     */
    static async exportUserData(userId: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: true,
                consentLogs: true
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        // Remove sensitive data
        const { password, twoFactorSecret, backupCodes, ...userData } = user

        return {
            userData,
            exportDate: new Date(),
            exportVersion: '1.0'
        }
    }
}
