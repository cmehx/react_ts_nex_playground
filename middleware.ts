import { auth } from '@/lib/auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/admin'
]

// Routes d'authentification
const authRoutes = [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password'
]

// Routes publiques
const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/blog',
    '/privacy',
    '/terms'
]

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Obtenir la session
    const session = await auth()

    // Rediriger les utilisateurs authentifiés loin des pages d'auth
    if (session && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Vérifier les routes protégées
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!session) {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }
    }

    // Vérifier les rôles pour les routes admin
    if (pathname.startsWith('/admin')) {
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    // Vérifier le consentement RGPD pour les utilisateurs connectés
    if (session && !session.user?.gdprConsent && !pathname.startsWith('/auth/') && !pathname.startsWith('/gdpr/')) {
        return NextResponse.redirect(new URL('/gdpr/consent', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
