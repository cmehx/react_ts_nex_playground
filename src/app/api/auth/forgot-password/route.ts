import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SecurityUtils, TokenUtils } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address')
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = forgotPasswordSchema.parse(body)

        const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = request.headers.get('user-agent') || undefined

        // Check rate limiting
        const rateCheck = await SecurityUtils.checkRateLimit(ipAddress, 'PASSWORD_RESET')
        if (!rateCheck.allowed) {
            return NextResponse.json({
                success: false,
                error: {
                    type: 'RATE_LIMITED',
                    message: `Too many password reset attempts. Try again in ${Math.ceil((rateCheck.resetTime!.getTime() - Date.now()) / 60000)} minutes.`
                }
            }, { status: 429 })
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                deletionRequested: true
            }
        })

        // Always return success to prevent email enumeration
        const successResponse = {
            success: true,
            data: {
                message: 'If an account with this email exists, a password reset link has been sent.'
            }
        }

        if (!user || user.deletionRequested) {
            return NextResponse.json(successResponse)
        }

        // Create password reset token
        const resetToken = await TokenUtils.createPasswordResetToken(user.id)

        // TODO: Send password reset email
        // await EmailService.sendPasswordResetEmail(user.email, user.name, resetToken)

        // Log the password reset request
        await SecurityUtils.logLoginAttempt({

            email: user.email,
            ipAddress,
            userAgent,
            success: true,
            failureReason: undefined
        })

        return NextResponse.json(successResponse)

    } catch (error) {
        console.error('Password reset request error:', error)

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
                message: 'An unexpected error occurred while processing password reset request'
            }
        }, { status: 500 })
    }
}
