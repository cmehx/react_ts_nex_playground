import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { TwoFactorUtils } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export async function POST(_request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                error: {
                    type: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                twoFactorEnabled: true
            }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                error: {
                    type: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            }, { status: 404 })
        }

        if (user.twoFactorEnabled) {
            return NextResponse.json({
                success: false,
                error: {
                    type: 'TWO_FACTOR_ALREADY_ENABLED',
                    message: 'Two-factor authentication is already enabled'
                }
            }, { status: 400 })
        }

        // Generate 2FA secret and QR code
        const twoFactorData = await TwoFactorUtils.generateTwoFactorSecret(user.email)

        // Store the secret temporarily (will be confirmed in verify endpoint)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                twoFactorSecret: twoFactorData.secret,
                backupCodes: twoFactorData.backupCodes
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                secret: twoFactorData.secret,
                qrCode: twoFactorData.qrCode,
                backupCodes: twoFactorData.backupCodes
            }
        })

    } catch (error) {
        console.error('2FA setup error:', error)
        return NextResponse.json({
            success: false,
            error: {
                type: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred during 2FA setup'
            }
        }, { status: 500 })
    }
}
