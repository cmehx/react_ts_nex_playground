'use client'

import { Lock, LogOut, Settings, Shield, Unlock, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TwoFactorSetup } from '@/components/forms'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ToastProvider } from '@/components/ui/use-toast'

function DashboardContent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/auth/signin' })
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

    if (status === 'unauthenticated') {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-blue-600" />
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{session?.user?.name}</span>
                            </div>
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Se déconnecter
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Welcome Card */}
                        <Card className="md:col-span-2 lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Bienvenue, {session?.user?.name} !</CardTitle>
                                <CardDescription>
                                    Votre compte est maintenant configuré et sécurisé. Explorez les fonctionnalités disponibles.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span>Compte actif</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <span>Email vérifié</span>
                                    </div>
                                    {session?.user?.twoFactorEnabled && (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                            <span>2FA activé</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informations du compte
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-sm">{session?.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Rôle</p>
                                    <p className="text-sm">{session?.user?.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">RGPD</p>
                                    <p className="text-sm flex items-center gap-1">
                                        {session?.user?.gdprConsent ? 'Consenti' : 'Non consenti'}
                                        {session?.user?.gdprConsent && <span className="text-green-500">✓</span>}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Sécurité
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {session?.user?.twoFactorEnabled ? (
                                            <Lock className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Unlock className="h-4 w-4 text-orange-500" />
                                        )}
                                        <span className="text-sm">
                                            Authentification 2FA
                                        </span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${session?.user?.twoFactorEnabled
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {session?.user?.twoFactorEnabled ? 'Activé' : 'Désactivé'}
                                    </span>
                                </div>

                                {!session?.user?.twoFactorEnabled && (
                                    <Button
                                        onClick={() => setShowTwoFactorSetup(true)}
                                        size="sm"
                                        className="w-full"
                                    >
                                        Activer la 2FA
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Paramètres
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Modifier le profil
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Changer le mot de passe
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Paramètres de confidentialité
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                                    Supprimer le compte
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>

            {/* 2FA Setup Modal */}
            {showTwoFactorSetup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Configuration 2FA</h2>
                            <Button
                                onClick={() => setShowTwoFactorSetup(false)}
                                variant="outline"
                                size="sm"
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="p-4">
                            <TwoFactorSetup
                                onComplete={() => {
                                    setShowTwoFactorSetup(false)
                                    window.location.reload() // Refresh to update session
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function DashboardPage() {
    return (
        <ToastProvider>
            <DashboardContent />
        </ToastProvider>
    )
}
