# Documentation du Système d'Authentification Robuste

## Vue d'ensemble

Ce système d'authentification fournit une sécurité de niveau entreprise avec conformité RGPD complète, authentification à deux facteurs (2FA), et protection contre les attaques courantes.

## Fonctionnalités de Sécurité

### 🔐 Authentification Robuste
- **Mots de passe sécurisés** : Exigences strictes (12+ caractères, majuscules, minuscules, chiffres, caractères spéciaux)
- **Hashage sécurisé** : bcrypt avec 12 rounds de salt
- **Protection contre les attaques** : Rate limiting, protection CSRF, validation stricte des entrées

### 🛡️ Authentification à Deux Facteurs (2FA)
- **TOTP (Time-based OTP)** : Compatible avec Google Authenticator, Authy, etc.
- **Codes de récupération** : 10 codes uniques pour accès d'urgence
- **Configuration guidée** : Interface utilisateur intuitive avec QR code et saisie manuelle

### 🔒 Protection des Comptes
- **Verrouillage automatique** : Après 5 tentatives de connexion échouées
- **Rate limiting** : Protection contre les attaques par force brute
- **Audit trail** : Journalisation complète des tentatives de connexion

### 📊 Conformité RGPD
- **Consentement explicite** : Requis pour l'inscription et le traitement des données
- **Droit à l'oubli** : Fonctionnalité de suppression de compte
- **Export des données** : Les utilisateurs peuvent télécharger leurs données
- **Journalisation des consentements** : Traçabilité complète

## Architecture Technique

### Structure des Fichiers

```
src/
├── lib/
│   ├── auth.ts              # Configuration NextAuth.js v5
│   ├── auth-utils.ts        # Utilitaires de sécurité
│   └── prisma.ts           # Client Prisma
├── types/
│   └── auth.ts             # Types TypeScript pour l'authentification
├── app/
│   ├── api/auth/           # Routes API d'authentification
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── 2fa/
│   ├── auth/               # Pages d'authentification
│   │   ├── signin/
│   │   └── signup/
│   └── dashboard/          # Dashboard protégé
├── components/
│   ├── forms/              # Composants de formulaires
│   └── ui/                 # Composants UI de base
└── middleware.ts           # Protection des routes
```

### Modèles de Base de Données

#### Modèle User (Étendu)
```prisma
model User {
  // Champs de base
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  role          Role      @default(USER)
  
  // Sécurité & 2FA
  twoFactorSecret     String?
  twoFactorEnabled    Boolean   @default(false)
  backupCodes         String[]
  lastPasswordChange  DateTime?
  failedLoginAttempts Int       @default(0)
  lockedUntil         DateTime?
  
  // Conformité RGPD
  gdprConsent         Boolean   @default(false)
  gdprConsentDate     DateTime?
  marketingConsent    Boolean   @default(false)
  dataRetentionDate   DateTime?
  deletionRequested   Boolean   @default(false)
  deletionRequestDate DateTime?
  
  // Audit trail
  lastLoginAt         DateTime?
  lastLoginIp         String?
  emailVerified       DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}
```

#### Modèles de Sécurité
- **LoginAttempt** : Journalisation des tentatives de connexion
- **PasswordResetToken** : Tokens de réinitialisation de mot de passe
- **EmailVerificationToken** : Tokens de vérification d'email

#### Modèles RGPD
- **DataExportRequest** : Demandes d'export de données
- **DataDeletionRequest** : Demandes de suppression de données
- **ConsentLog** : Historique des consentements

## Utilitaires de Sécurité

### PasswordUtils
- `hashPassword()` : Hashage sécurisé avec bcrypt
- `verifyPassword()` : Vérification des mots de passe
- `validatePassword()` : Validation selon les exigences de sécurité
- `generateSecurePassword()` : Génération de mots de passe sécurisés

### TwoFactorUtils
- `generateTwoFactorSecret()` : Génération de secret TOTP et QR code
- `verifyTwoFactorToken()` : Vérification des codes 2FA
- `generateBackupCodes()` : Génération de codes de récupération
- `verifyBackupCode()` : Vérification et invalidation des codes de récupération

### SecurityUtils
- `logLoginAttempt()` : Journalisation des tentatives de connexion
- `checkRateLimit()` : Vérification des limites de taux
- `lockAccount()` / `unlockAccount()` : Gestion du verrouillage des comptes
- `incrementFailedLoginAttempts()` : Comptage des échecs de connexion

### GDPRUtils
- `logConsent()` : Enregistrement des consentements
- `requestDataExport()` : Initiation d'export de données
- `requestDataDeletion()` : Initiation de suppression de données
- `exportUserData()` : Export des données utilisateur

## Configuration NextAuth.js

### Providers
- **Credentials** : Authentification par email/mot de passe avec 2FA
- **Google OAuth** : Authentification sociale (peut être étendu)

### Callbacks
- **jwt()** : Enrichissement du token JWT avec rôle, 2FA, RGPD
- **session()** : Transfert des données du token vers la session
- **signIn()** : Validation RGPD et vérification de l'état du compte

### Pages Personnalisées
- `/auth/signin` : Page de connexion avec support 2FA
- `/auth/signup` : Page d'inscription avec consentement RGPD
- `/auth/error` : Gestion des erreurs d'authentification

## Protection des Routes

### Middleware
Le middleware protège automatiquement les routes selon trois catégories :

1. **Routes publiques** : Accessibles à tous (`/`, `/blog`, etc.)
2. **Routes d'authentification** : Redirection si déjà connecté
3. **Routes protégées** : Authentification requise (`/dashboard`, `/profile`)

### Vérifications
- Authentification utilisateur
- Vérification du rôle (ADMIN pour `/admin`)
- Consentement RGPD
- État du compte (non supprimé, non verrouillé)

## Composants UI

### Formulaires
- **RegisterForm** : Inscription avec validation en temps réel et indicateur de force du mot de passe
- **LoginForm** : Connexion avec support 2FA conditionnel
- **TwoFactorSetup** : Configuration 2FA guidée avec QR code

### Validation
- Validation côté client avec `react-hook-form` et `zod`
- Validation côté serveur avec les mêmes schémas
- Messages d'erreur contextuelle et aide utilisateur

## API Routes

### Authentication
- `POST /api/auth/register` : Inscription avec validation et RGPD
- `POST /api/auth/verify-email` : Vérification d'email
- `POST /api/auth/forgot-password` : Demande de réinitialisation
- `POST /api/auth/reset-password` : Réinitialisation de mot de passe

### Two-Factor Authentication
- `POST /api/auth/2fa/setup` : Initiation de la configuration 2FA
- `POST /api/auth/2fa/verify` : Vérification et activation 2FA
- `POST /api/auth/2fa/disable` : Désactivation 2FA

### GDPR Compliance
- `POST /api/gdpr/export` : Demande d'export de données
- `POST /api/gdpr/delete` : Demande de suppression
- `POST /api/gdpr/consent` : Mise à jour des consentements

## Sécurité & Bonnes Pratiques

### Gestion des Erreurs
- Messages d'erreur non révélateurs pour éviter l'énumération
- Journalisation détaillée côté serveur
- Gestion gracieuse des cas d'erreur

### Rate Limiting
- **Connexion** : 5 tentatives par 15 minutes
- **Réinitialisation mot de passe** : 3 tentatives par heure
- **Inscription** : 5 tentatives par heure

### Validation des Données
- Validation stricte avec Zod côté client et serveur
- Sanitisation des entrées utilisateur
- Protection contre l'injection SQL via Prisma

### Chiffrement & Stockage
- Mots de passe hashés avec bcrypt (12 rounds)
- Secrets 2FA chiffrés en base
- Tokens sécurisés avec expiration

## Variables d'Environnement

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (optionnel)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (pour les notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## Déploiement & Production

### Checklist de Sécurité
- [ ] Variables d'environnement sécurisées
- [ ] HTTPS activé
- [ ] Rate limiting configuré
- [ ] Monitoring des logs d'authentification
- [ ] Backup de la base de données
- [ ] Tests de sécurité effectués

### Performance
- Indexation appropriée des tables de sécurité
- Cache des vérifications de rate limiting
- Optimisation des requêtes de session

### Monitoring
- Surveillance des tentatives de connexion suspectes
- Alertes sur les échecs d'authentification massifs
- Métriques de performance des API d'authentification

## Tests

### Tests Unitaires
- Validation des utilitaires de sécurité
- Tests des fonctions de hashage et vérification
- Validation des schémas Zod

### Tests d'Intégration
- Flux complet d'inscription/connexion
- Configuration et utilisation 2FA
- Processus de réinitialisation de mot de passe

### Tests de Sécurité
- Tests de force brute
- Validation des protections CSRF
- Tests d'énumération d'utilisateurs

## Support & Maintenance

### Mise à Jour des Dépendances
- Surveillance des vulnérabilités de sécurité
- Mise à jour régulière des packages
- Tests de régression après mise à jour

### Sauvegarde & Récupération
- Sauvegarde automatique des données utilisateur
- Procédures de récupération d'urgence
- Tests réguliers de restauration

Ce système d'authentification fournit une base solide pour toute application nécessitant une sécurité robuste et une conformité RGPD complète.
