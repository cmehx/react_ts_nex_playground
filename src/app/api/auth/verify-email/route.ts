import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TokenUtils } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required')
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token } = verifyEmailSchema.parse(body)

        const verification = await TokenUtils.verifyEmailToken(token)

        if (!verification.valid || !verification.email) {
            return NextResponse.json({
                success: false,
                error: {
                    type: 'INVALID_TOKEN',
                    message: 'Invalid or expired verification token'
                }
            }, { status: 400 })
        }

        // Update user's email verification status
        const user = await prisma.user.update({
            where: { email: verification.email },
            data: { emailVerified: new Date() },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                message: 'Email verified successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified
                }
            }
        })

    } catch (error) {
        console.error('Email verification error:', error)

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
                message: 'An unexpected error occurred during email verification'
            }
        }, { status: 500 })
    }
}
