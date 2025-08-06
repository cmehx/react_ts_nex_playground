import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
    twoFactorCode: z.string().optional(),
    rememberMe: z.boolean().default(false)
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
    onSuccess?: () => void
    redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema) as any,
        mode: 'onChange',
        defaultValues: {
            rememberMe: false
        }
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                twoFactorCode: data.twoFactorCode,
                redirect: false
            })

            if (result?.error) {
                switch (result.error) {
                    case 'TWO_FACTOR_REQUIRED':
                        setRequiresTwoFactor(true)
                        setError('Veuillez entrer votre code d\'authentification à deux facteurs')
                        break
                    case 'INVALID_CREDENTIALS':
                        setError('Email ou mot de passe incorrect')
                        break
                    case 'EMAIL_NOT_VERIFIED':
                        setError('Veuillez vérifier votre adresse email avant de vous connecter')
                        break
                    case 'ACCOUNT_LOCKED':
                        setError('Votre compte a été temporairement verrouillé en raison de tentatives de connexion multiples')
                        break
                    case 'RATE_LIMITED':
                        setError('Trop de tentatives de connexion. Veuillez réessayer plus tard')
                        break
                    case 'GDPR_CONSENT_REQUIRED':
                        setError('Vous devez accepter les conditions RGPD pour vous connecter')
                        break
                    default:
                        setError('Une erreur est survenue lors de la connexion')
                }
            } else if (result?.ok) {
                if (onSuccess) {
                    onSuccess()
                } else {
                    window.location.href = redirectTo
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('Une erreur inattendue est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Connexion
                </CardTitle>
                <CardDescription>
                    Accédez à votre compte sécurisé
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                            {...register('email')}
                            className={errors.email ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Votre mot de passe"
                                {...register('password')}
                                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2.5 h-5 w-5 text-gray-500 hover:text-gray-700"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {requiresTwoFactor && (
                        <div className="space-y-2">
                            <Label htmlFor="twoFactorCode">Code d'authentification</Label>
                            <Input
                                id="twoFactorCode"
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                {...register('twoFactorCode')}
                                className={errors.twoFactorCode ? 'border-red-500' : ''}
                                disabled={isLoading}
                            />
                            <p className="text-sm text-gray-600">
                                Entrez le code à 6 chiffres depuis votre application d'authentification
                            </p>
                            {errors.twoFactorCode && (
                                <p className="text-sm text-red-500">{errors.twoFactorCode.message}</p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                {...register('rememberMe')}
                                disabled={isLoading}
                            />
                            <Label htmlFor="rememberMe" className="text-sm">
                                Se souvenir de moi
                            </Label>
                        </div>
                        <a
                            href="/auth/forgot-password"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Mot de passe oublié ?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !isValid}
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <a href="/auth/register" className="text-blue-600 hover:underline">
                                Créer un compte
                            </a>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
