# Environments Configuration

## 🌍 Environnements disponibles

### 🏠 Local Development

- **URL**: http://localhost:3000
- **Database**: PostgreSQL local ou cloud
- **Purpose**: Développement quotidien
- **Branch**: Toute branche de feature
- **Hot Reload**: Activé
- **Debug**: Activé

### 🧪 Staging/Preview

- **URL**: https://staging-blog-[pr-number].vercel.app
- **Database**: PostgreSQL staging
- **Purpose**: Tests d'intégration, review des PR
- **Branch**: `develop` + preview des PR
- **Deploy**: Automatique sur push develop
- **Data**: Données de test, reset périodique

### 🚀 Production

- **URL**: https://react-ts-nex-playground.vercel.app
- **Database**: PostgreSQL production
- **Purpose**: Application live pour utilisateurs
- **Branch**: `main` uniquement
- **Deploy**: Automatique après merge sur main
- **Data**: Données réelles, backups quotidiennes

## 🔧 Configuration par environnement

### Local (.env.local)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blog_dev"

# NextAuth
NEXTAUTH_SECRET="local-development-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Debug (optionnel)
DEBUG="true"
NEXT_PUBLIC_DEBUG_MODE="true"
```

### Staging (.env.staging)

```env
# Database (Vercel PostgreSQL)
DATABASE_URL="${DATABASE_URL_STAGING}"

# NextAuth
NEXTAUTH_SECRET="${NEXTAUTH_SECRET_STAGING}"
NEXTAUTH_URL="https://staging-blog.vercel.app"

# App
NODE_ENV="staging"
APP_URL="https://staging-blog.vercel.app"

# Features flags
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
NEXT_PUBLIC_ENABLE_SENTRY="true"
```

### Production (.env.production)

```env
# Database (production)
DATABASE_URL="${DATABASE_URL_PRODUCTION}"

# NextAuth
NEXTAUTH_SECRET="${NEXTAUTH_SECRET_PRODUCTION}"
NEXTAUTH_URL="https://react-ts-nex-playground.vercel.app"

# App
NODE_ENV="production"
APP_URL="https://react-ts-nex-playground.vercel.app"

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_SENTRY="true"
NEXT_PUBLIC_SENTRY_DSN="${SENTRY_DSN}"
```

## 📋 Setup des environnements

### 1. Vercel Staging Setup

```bash
# 1. Connecter le repo à Vercel
# 2. Configurer les branches
# Main branch: main → Production
# Preview branches: develop, feature/* → Staging

# 3. Variables d'environnement Vercel
vercel env add DATABASE_URL_STAGING
vercel env add NEXTAUTH_SECRET_STAGING
```

### 2. Database per Environment

```bash
# Local: PostgreSQL local
createdb blog_dev

# Staging: Vercel PostgreSQL
# Créé automatiquement via Vercel dashboard

# Production: Vercel PostgreSQL ou Railway
# Base séparée pour isolation des données
```

### 3. CI/CD Environment Variables

```yaml
# GitHub Secrets pour CI
secrets:
  DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
  NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET_TEST }}

  # Staging deploy
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🔄 Deployment Workflow

### Automatic Deployments

#### Feature/PR Preview

```mermaid
graph LR
    A[Push to feature/*] --> B[Vercel Preview Deploy]
    B --> C[Unique URL per PR]
    C --> D[Manual testing]
    D --> E[Code review]
```

#### Staging

```mermaid
graph LR
    A[Merge to develop] --> B[CI/CD Tests]
    B --> C[Deploy to Staging]
    C --> D[Integration Tests]
    D --> E[QA Validation]
```

#### Production

```mermaid
graph LR
    A[Merge to main] --> B[Full CI/CD Suite]
    B --> C[Deploy to Production]
    C --> D[Health Checks]
    D --> E[Live Monitoring]
```

### Manual Deployments (Emergency)

```bash
# Vercel CLI
vercel --prod                 # Deploy to production
vercel --env staging         # Deploy to staging

# Railway CLI
railway deploy               # Deploy to Railway
```

## 🔍 Environment Testing

### Database Migrations Testing

```bash
# Test migrations sur staging
npm run db:migrate:deploy

# Vérification post-migration
npm run db:studio
```

### Feature Flags Testing

```typescript
// utils/featureFlags.ts
export const featureFlags = {
  enableNewUI: process.env.NODE_ENV === 'staging',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
}

// Usage in components
import { featureFlags } from '@/utils/featureFlags'

function MyComponent() {
  if (featureFlags.enableNewUI) {
    return <NewUIComponent />
  }
  return <LegacyComponent />
}
```

### Environment Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Database check
    await prisma.$queryRaw`SELECT 1`

    // Environment check
    const env = {
      nodeEnv: process.env.NODE_ENV,
      database: !!process.env.DATABASE_URL,
      auth: !!process.env.NEXTAUTH_SECRET,
    }

    return Response.json({
      status: 'healthy',
      environment: env,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
```

## 📊 Monitoring par environnement

### Local Development

- **Logs**: Console browser + terminal
- **Performance**: React DevTools
- **Database**: Prisma Studio

### Staging

- **Uptime**: Vercel Analytics
- **Errors**: Sentry (staging environment)
- **Logs**: Vercel Function Logs

### Production

- **Uptime**: Vercel Analytics + external monitoring
- **Errors**: Sentry (production environment)
- **Performance**: Web Vitals + Lighthouse CI
- **Database**: PostgreSQL monitoring

## 🔒 Security per Environment

### Local

- **HTTPS**: Non requis
- **Secrets**: Fichier .env.local (jamais commit)
- **Auth**: Développement uniquement

### Staging

- **HTTPS**: Obligatoire (Vercel auto)
- **Secrets**: Vercel Environment Variables
- **Auth**: Test accounts uniquement
- **CORS**: Restreint aux domaines staging

### Production

- **HTTPS**: Obligatoire avec HSTS
- **Secrets**: Vercel Environment Variables (encrypted)
- **Auth**: Production accounts
- **CORS**: Domaines production uniquement
- **Rate Limiting**: Activé
- **Security Headers**: Complets

Cette configuration garantit des **environnements isolés et sécurisés** pour tous les contributeurs ! 🚀
