'use client'

import { LoginForm } from '@/components/forms'
import { ToastProvider } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Chargement...</p>
                </div>
            </div>
        )
    }

    if (status === 'authenticated') {
        return null // Will redirect
    }

    return (
        <ToastProvider>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Bienvenue !
                        </h1>
                        <p className="text-gray-600">
                            Connectez-vous à votre compte pour continuer
                        </p>
                    </div>

                    <LoginForm
                        onSuccess={() => router.push('/dashboard')}
                        redirectTo="/dashboard"
                    />

                    <div className="text-center text-sm text-gray-600">
                        <p>
                            En vous connectant, vous acceptez nos{' '}
                            <a href="/terms" className="text-blue-600 hover:underline">
                                conditions d'utilisation
                            </a>{' '}
                            et notre{' '}
                            <a href="/privacy" className="text-blue-600 hover:underline">
                                politique de confidentialité
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </ToastProvider>
    )
}
