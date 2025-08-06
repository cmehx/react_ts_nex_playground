import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`

    // Environment check
    const env = {
      nodeEnv: process.env.NODE_ENV,
      database: !!process.env.DATABASE_URL,
      auth: !!process.env.NEXTAUTH_SECRET,
    }

    return NextResponse.json({
      status: 'healthy',
      environment: env,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
