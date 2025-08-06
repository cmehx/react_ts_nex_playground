import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Eye, EyeOff, Shield, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const registerSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50, 'Le nom doit contenir moins de 50 caractères'),
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(12, 'Le mot de passe doit contenir au moins 12 caractères'),
    confirmPassword: z.string(),
    gdprConsent: z.boolean().refine(val => val === true, 'Le consentement RGPD est requis'),
    marketingConsent: z.boolean().default(false)
}).refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
})

type RegisterFormData = z.infer<typeof registerSchema>

interface PasswordRequirement {
    test: (password: string) => boolean
    label: string
}

const passwordRequirements: PasswordRequirement[] = [
    { test: (p) => p.length >= 12, label: 'Au moins 12 caractères' },
    { test: (p) => /[A-Z]/.test(p), label: 'Au moins une majuscule' },
    { test: (p) => /[a-z]/.test(p), label: 'Au moins une minuscule' },
    { test: (p) => /\d/.test(p), label: 'Au moins un chiffre' },
    { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: 'Au moins un caractère spécial' },
]

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => Promise<void>
    isLoading?: boolean
    error?: string | null
}

export function RegisterForm({ onSubmit, isLoading = false, error }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema) as any,
        mode: 'onChange',
        defaultValues: {
            marketingConsent: false
        }
    })

    const watchedPassword = watch('password', '')

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Créer un compte
                </CardTitle>
                <CardDescription>
                    Rejoignez notre communauté avec un compte sécurisé
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Votre nom complet"
                            {...register('name')}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                            {...register('email')}
                            className={errors.email ? 'border-red-500' : ''}
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
                                placeholder="Créez un mot de passe fort"
                                {...register('password')}
                                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2.5 h-5 w-5 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}

                        {/* Password strength indicator */}
                        {watchedPassword && (
                            <div className="space-y-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm font-medium text-gray-700">Exigences du mot de passe :</p>
                                <div className="space-y-1">
                                    {passwordRequirements.map((req, index) => {
                                        const isValid = req.test(watchedPassword)
                                        return (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                {isValid ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                <span className={isValid ? 'text-green-700' : 'text-red-700'}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirmez votre mot de passe"
                                {...register('confirmPassword')}
                                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 top-2.5 h-5 w-5 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* GDPR Consent */}
                    <div className="space-y-4 p-4 border rounded-md bg-blue-50">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="gdprConsent"
                                {...register('gdprConsent')}
                                className={errors.gdprConsent ? 'border-red-500' : ''}
                            />
                            <Label htmlFor="gdprConsent" className="text-sm leading-5">
                                J'accepte la{' '}
                                <a href="/privacy" className="text-blue-600 hover:underline">
                                    politique de confidentialité
                                </a>{' '}
                                et les{' '}
                                <a href="/terms" className="text-blue-600 hover:underline">
                                    conditions d'utilisation
                                </a>
                                . Je consens au traitement de mes données personnelles conformément au RGPD.
                            </Label>
                        </div>
                        {errors.gdprConsent && (
                            <p className="text-sm text-red-500">{errors.gdprConsent.message}</p>
                        )}

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="marketingConsent"
                                {...register('marketingConsent')}
                            />
                            <Label htmlFor="marketingConsent" className="text-sm leading-5">
                                J'accepte de recevoir des communications marketing et des newsletters (optionnel).
                            </Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !isValid}
                    >
                        {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
