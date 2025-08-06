'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ToastProvider, useToast } from '@/components/ui/use-toast'
import { RegisterForm } from '@/components/forms'

function SignUpContent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    const handleRegister = async (data: any) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    title: 'Compte créé avec succès !',
                    description: 'Veuillez vérifier votre email pour activer votre compte.'
                })
                router.push('/auth/verify-email')
            } else {
                setError(result.error?.message || 'Une erreur est survenue lors de la création du compte')
            }
        } catch (error) {
            console.error('Registration error:', error)
            setError('Une erreur inattendue est survenue')
        } finally {
            setIsLoading(false)
        }
    }

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Créer un compte
                    </h1>
                    <p className="text-gray-600">
                        Rejoignez notre communauté et découvrez toutes nos fonctionnalités
                    </p>
                </div>

                <RegisterForm
                    onSubmit={handleRegister}
                    isLoading={isLoading}
                    error={error}
                />

                <div className="text-center text-sm text-gray-600">
                    <p>
                        Déjà un compte ?{' '}
                        <a href="/auth/signin" className="text-blue-600 hover:underline">
                            Se connecter
                        </a>
                    </p>
                </div>

                <div className="text-center text-xs text-gray-500 bg-gray-100 p-4 rounded-lg">
                    <p className="font-medium mb-2">🔒 Vos données sont protégées</p>
                    <p>
                        Nous respectons le RGPD et utilisons un chiffrement de niveau bancaire pour protéger vos informations.
                        Votre mot de passe est haché de manière sécurisée et jamais stocké en clair.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function SignUpPage() {
    return (
        <ToastProvider>
            <SignUpContent />
        </ToastProvider>
    )
}
