import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PasswordUtils, SecurityUtils, TokenUtils } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, password } = resetPasswordSchema.parse(body)

        const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = request.headers.get('user-agent')

        // Verify token
        const tokenVerification = await TokenUtils.verifyPasswordResetToken(token)

        if (!tokenVerification.valid || !tokenVerification.email) {
            return NextResponse.json({
                success: false,
                error: {
                    type: 'INVALID_TOKEN',
                    message: 'Invalid or expired password reset token'
                }
            }, { status: 400 })
        }

        // Validate password strength
        const passwordValidation = PasswordUtils.validatePassword(password)
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

        // Hash new password
        const hashedPassword = await PasswordUtils.hashPassword(password)

        // Update user password and reset security fields
        const user = await prisma.user.update({
            where: { email: tokenVerification.email },
            data: {
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

        // Delete the password reset token
        await TokenUtils.deletePasswordResetToken(token)

        // Log successful password reset
        await SecurityUtils.logLoginAttempt({

            email: user.email,
            ipAddress,
            userAgent: userAgent || undefined,
            success: true,
            failureReason: undefined
        })

        return NextResponse.json({
            success: true,
            data: {
                message: 'Password reset successfully. You can now log in with your new password.'
            }
        })

    } catch (error) {
        console.error('Password reset error:', error)

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
                message: 'An unexpected error occurred during password reset'
            }
        }, { status: 500 })
    }
}
