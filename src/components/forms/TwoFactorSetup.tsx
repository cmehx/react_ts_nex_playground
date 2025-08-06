import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CheckCircle2, Copy, Key, Shield } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

const verifyCodeSchema = z.object({
    code: z.string().min(6, 'Le code doit contenir 6 chiffres').max(6, 'Le code doit contenir 6 chiffres')
})

type VerifyCodeData = z.infer<typeof verifyCodeSchema>

interface TwoFactorSetupProps {
    onComplete?: () => void
}

interface TwoFactorData {
    secret: string
    qrCode: string
    backupCodes: string[]
}

export function TwoFactorSetup({ onComplete }: TwoFactorSetupProps) {
    const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup')
    const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<VerifyCodeData>({
        resolver: zodResolver(verifyCodeSchema)
    })

    const initiateTwoFactorSetup = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/2fa/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })

            const result = await response.json()

            if (result.success) {
                setTwoFactorData(result.data)
                setStep('verify')
            } else {
                setError(result.error?.message || 'Erreur lors de la configuration 2FA')
            }
        } catch (error) {
            console.error('2FA setup error:', error)
            setError('Une erreur inattendue est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    const verifyTwoFactorCode = async (data: VerifyCodeData) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: data.code })
            })

            const result = await response.json()

            if (result.success) {
                setStep('complete')
                toast({
                    title: 'Authentification à deux facteurs activée',
                    description: 'Votre compte est maintenant protégé par l\'authentification à deux facteurs.',
                })
                if (onComplete) onComplete()
            } else {
                setError(result.error?.message || 'Code de vérification invalide')
            }
        } catch (error) {
            console.error('2FA verification error:', error)
            setError('Une erreur inattendue est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: 'Copié !',
            description: 'Le texte a été copié dans le presse-papiers.',
        })
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Configuration de l'authentification à deux facteurs
                </CardTitle>
                <CardDescription>
                    Renforcez la sécurité de votre compte avec l'authentification à deux facteurs
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === 'setup' && (
                    <div className="space-y-4">
                        <Alert>
                            <Shield className="h-4 w-4" />
                            <AlertDescription>
                                L'authentification à deux facteurs (2FA) ajoute une couche de sécurité supplémentaire à votre compte.
                                Vous aurez besoin d'une application d'authentification comme Google Authenticator ou Authy.
                            </AlertDescription>
                        </Alert>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <h4 className="font-medium">Étapes à suivre :</h4>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                <li>Téléchargez une application d'authentification (Google Authenticator, Authy, etc.)</li>
                                <li>Cliquez sur "Commencer la configuration" ci-dessous</li>
                                <li>Scannez le QR code ou saisissez manuellement la clé secrète</li>
                                <li>Entrez le code à 6 chiffres généré par l'application</li>
                                <li>Sauvegardez vos codes de récupération</li>
                            </ol>
                        </div>

                        <Button onClick={initiateTwoFactorSetup} disabled={isLoading} className="w-full">
                            {isLoading ? 'Configuration...' : 'Commencer la configuration'}
                        </Button>
                    </div>
                )}

                {step === 'verify' && twoFactorData && (
                    <div className="space-y-4">
                        <Tabs defaultValue="qr" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="qr">QR Code</TabsTrigger>
                                <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
                            </TabsList>

                            <TabsContent value="qr" className="space-y-4">
                                <div className="text-center">
                                    <img
                                        src={twoFactorData.qrCode}
                                        alt="QR Code pour 2FA"
                                        className="mx-auto border rounded-lg"
                                    />
                                    <p className="text-sm text-gray-600 mt-2">
                                        Scannez ce QR code avec votre application d'authentification
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="manual" className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Clé secrète</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={twoFactorData.secret}
                                            readOnly
                                            className="font-mono text-sm"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(twoFactorData.secret)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Entrez cette clé manuellement dans votre application d'authentification
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(verifyTwoFactorCode)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Code de vérification</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    {...register('code')}
                                    className={errors.code ? 'border-red-500' : ''}
                                    disabled={isLoading}
                                />
                                <p className="text-sm text-gray-600">
                                    Entrez le code à 6 chiffres affiché dans votre application d'authentification
                                </p>
                                {errors.code && (
                                    <p className="text-sm text-red-500">{errors.code.message}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'Vérification...' : 'Vérifier et activer'}
                            </Button>
                        </form>
                    </div>
                )}

                {step === 'complete' && twoFactorData && (
                    <div className="space-y-4">
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                L'authentification à deux facteurs a été activée avec succès !
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <h4 className="font-medium">Codes de récupération</h4>
                            <Alert>
                                <Key className="h-4 w-4" />
                                <AlertDescription>
                                    Sauvegardez ces codes de récupération dans un endroit sûr.
                                    Ils vous permettront d'accéder à votre compte si vous perdez votre appareil.
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-2 gap-2">
                                {twoFactorData.backupCodes.map((code, index) => (
                                    <div key={index} className="p-2 bg-gray-100 rounded font-mono text-sm text-center">
                                        {code}
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => copyToClipboard(twoFactorData.backupCodes.join('\n'))}
                                variant="outline"
                                className="w-full"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copier tous les codes
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
