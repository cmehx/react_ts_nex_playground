# 📝 Modern Blog - Guide du Développeur

Un blog moderne et professionnel conçu avec Next.js 15, TypeScript, et Tailwind CSS. Cette documentation vous guide à travers l'architecture, l'organisation du code, et les bonnes pratiques pour contribuer efficacement au projet.

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** 18.0.0 ou plus récent
- **npm** ou **yarn**
- **PostgreSQL** (pour la base de données)

### Installation

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd blog

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Remplir les variables d'environnement dans .env

# 4. Préparer la base de données
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Architecture du Projet

### Vue d'ensemble

Ce projet utilise une architecture moderne basée sur **Next.js App Router** avec une séparation claire des responsabilités. Chaque dossier a un rôle spécifique pour maintenir un code organisé et scalable.

```
blog/
├── 📁 public/                  # Assets statiques (images, icônes)
├── 📁 prisma/                  # Configuration base de données
├── 📁 src/                     # Code source principal
│   ├── 📁 app/                 # Routes et pages (App Router)
│   ├── 📁 components/          # Composants réutilisables
│   ├── 📁 hooks/               # Hooks personnalisés
│   ├── 📁 lib/                 # Configurations et clients
│   ├── 📁 utils/               # Fonctions utilitaires
│   ├── 📁 constants/           # Constantes de l'application
│   ├── 📁 stores/              # État global (futur)
│   └── 📁 types/               # Types TypeScript
├── 📄 package.json             # Dépendances et scripts
├── 📄 tailwind.config.js       # Configuration Tailwind CSS
├── 📄 tsconfig.json            # Configuration TypeScript
└── 📄 next.config.ts           # Configuration Next.js
```

## 📂 Structure détaillée des dossiers

### `/src/app/` - Routes et Pages

Utilise le **App Router** de Next.js (version 13+) pour un routage basé sur les fichiers.

```
app/
├── layout.tsx                  # Layout principal (Header, Footer)
├── page.tsx                    # Page d'accueil
├── providers.tsx               # Providers React (Auth, Query)
├── globals.css                 # Styles globaux
├── 📁 api/                     # API Routes
│   ├── auth/[...nextauth]/     # Authentification NextAuth
│   └── posts/                  # API des articles
├── 📁 dashboard/               # Pages privées (connecté)
├── 📁 posts/                   # Pages publiques des articles
└── 📁 (auth)/                  # Groupe de routes pour l'auth
    ├── signin/
    └── signup/
```

**💡 Bonnes pratiques :**

- `layout.tsx` : Définit la structure commune (navigation, footer)
- `page.tsx` : Contenu principal de chaque route
- `loading.tsx` : État de chargement automatique
- `error.tsx` : Gestion d'erreurs personnalisée

### `/src/components/` - Composants réutilisables

Organisation hiérarchique du plus générique au plus spécifique.

```
components/
├── index.ts                    # Barrel export principal
├── 📁 ui/                      # Design System (atomique)
│   ├── index.ts                # Exports des composants UI
│   ├── button.tsx              # Bouton réutilisable avec variants
│   ├── card.tsx                # Cartes avec différents styles
│   ├── modal.tsx               # Modales configurables
│   └── input.tsx               # Champs de formulaire
├── 📁 forms/                   # Composants de formulaires
│   ├── LoginForm.tsx           # Formulaire de connexion
│   ├── PostForm.tsx            # Formulaire d'article
│   └── SearchForm.tsx          # Barre de recherche
└── 📁 layout/                  # Composants de mise en page
    ├── Header.tsx              # Navigation principale
    ├── Footer.tsx              # Pied de page
    └── Sidebar.tsx             # Barre latérale
```

**💡 Convention d'import :**

```typescript
// ✅ Propre grâce aux barrel exports
import { Button, Card, Modal } from '@/components'

// ❌ Éviter les imports directs
import Button from '@/components/ui/button'
```

### `/src/hooks/` - Hooks personnalisés

Logique réutilisable encapsulée dans des hooks React.

```typescript
// Exemple d'utilisation
import { useNavigation, useLocalStorage } from '@/hooks'

function MyComponent() {
  const { navigate } = useNavigation()
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => navigate('/dashboard')}>
      Dashboard
    </button>
  )
}
```

### `/src/lib/` - Configurations et clients

Configurations des services externes et clients.

```
lib/
├── auth.ts                     # Configuration NextAuth
├── prisma.ts                   # Client Prisma (DB)
├── validations.ts              # Schémas Zod pour validation
└── queryClient.ts              # Configuration React Query
```

**💡 Utilisation :**

```typescript
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'
```

### `/src/utils/` - Fonctions utilitaires

Fonctions pures sans dépendances React.

```typescript
import { formatDate, generateSlug, cn } from '@/utils'

// Exemples d'usage
const formattedDate = formatDate(new Date()) // "6 août 2025"
const slug = generateSlug('Mon Super Article') // "mon-super-article"
const className = cn('btn', { 'btn-primary': isPrimary }) // Classes conditionnelles
```

### `/src/constants/` - Constantes

Configuration centralisée de l'application.

```typescript
import { API_ROUTES, APP_ROUTES } from '@/constants/routes'

// Usage type-safe
fetch(API_ROUTES.POSTS.LIST)
router.push(APP_ROUTES.POST_DETAIL('mon-article'))
```

### `/src/types/` - Types TypeScript

Types réutilisables dans toute l'application.

```typescript
import type { User, Post, ApiResponse } from '@/types'

// Fonctions avec types stricts
async function createPost(data: CreatePostData): Promise<ApiResponse<Post>> {
  // Implementation
}
```

## 🎨 Système de Design

### Composants UI de base

Chaque composant UI suit le pattern **compound components** avec des variants :

```typescript
// Button avec variants multiples
<Button variant="primary" size="lg" isLoading={loading}>
  Publier l'article
</Button>

// Card avec différents styles
<Card variant="elevated" padding="lg">
  <Card.Header>Titre</Card.Header>
  <Card.Content>Contenu</Card.Content>
</Card>
```

### Tailwind CSS et Classes utilitaires

Utilisation de l'utilitaire `cn()` pour combiner les classes :

```typescript
import { cn } from '@/utils'

function MyComponent({ className, variant }) {
  return (
    <div className={cn(
      "base-styles",
      {
        "variant-primary": variant === "primary",
        "variant-secondary": variant === "secondary"
      },
      className
    )}>
      Contenu
    </div>
  )
}
```

## 🗄️ Gestion des données

### Base de données (Prisma)

```typescript
// Définition du modèle dans prisma/schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

// Utilisation dans l'application
import { prisma } from '@/lib/prisma'

const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true }
})
```

### État côté client (React Query)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

function PostsList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json())
  })

  if (isLoading) return <div>Chargement...</div>
  return <div>{/* Affichage des posts */}</div>
}
```

## 🧪 Tests et Qualité

### Scripts disponibles

```bash
# Tests
npm run test              # Lance les tests
npm run test:watch        # Tests en mode watch
npm run test:ci           # Tests pour CI/CD

# Qualité du code
npm run lint              # Vérification ESLint
npm run lint:fix          # Correction automatique
npm run format            # Formatage Prettier
npm run type-check        # Vérification TypeScript

# Base de données
npm run db:generate       # Génère le client Prisma
npm run db:migrate        # Applique les migrations
npm run db:seed           # Remplit la DB avec des données test
npm run db:studio         # Interface graphique de la DB
```

### Structure des tests

```
src/
├── app/
│   └── __tests__/
│       └── page.test.tsx
├── components/
│   └── ui/
│       └── __tests__/
│           └── button.test.tsx
```

## 🔧 Workflow de développement

### 1. Créer une nouvelle fonctionnalité

```bash
# 1. Créer une branche
git checkout -b feature/nom-de-la-feature

# 2. Développer avec Hot Reload
npm run dev

# 3. Tester
npm run test
npm run lint

# 4. Commit (Husky vérifie automatiquement)
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
```

### 2. Ajouter un nouveau composant UI

```typescript
// 1. Créer le composant dans /src/components/ui/
// 2. L'exporter dans /src/components/ui/index.ts
export { default as MonComposant } from './mon-composant'

// 3. L'utiliser n'importe où
import { MonComposant } from '@/components'
```

### 3. Ajouter une nouvelle page

```typescript
// 1. Créer /src/app/ma-page/page.tsx
export default function MaPage() {
  return <div>Ma nouvelle page</div>
}

// 2. Optionnel : Ajouter layout.tsx, loading.tsx, error.tsx
```

## 🌐 Déploiement et CI/CD

### Pipeline CI/CD automatisé

Le projet utilise **GitHub Actions** pour un pipeline CI/CD complet qui s'exécute automatiquement :

#### **🔄 Déclencheurs**

- **Push** sur les branches `main` et `develop`
- **Pull Requests** vers `main`

#### **🧪 Étapes de validation (automatiques)**

```yaml
✅ Tests multi-versions (Node.js 18 & 20)
✅ Linting (ESLint avec auto-fix)
✅ Formatage (Prettier check)
✅ Audit sécurité (npm audit)
✅ Type checking (TypeScript)
✅ Tests avec coverage (Jest)
✅ Build application (Next.js)
✅ Upload coverage (Codecov)
```

#### **🚀 Déploiement automatique**

- **Production** : Déclenchée uniquement sur push vers `main`
- **Prêt pour** : Vercel, Railway, AWS, etc.

### Configuration locale vs CI

#### **Scripts de développement**

```bash
# Développement local avec hot reload
npm run dev

# Tests en mode interactif
npm run test:watch

# Vérifications manuelles
npm run lint
npm run type-check
npm run format:check
```

#### **Scripts CI/CD (automatiques)**

```bash
# Installation optimisée avec cache
npm ci

# Tests pour intégration continue
npm run test:ci

# Build de production
npm run build
```

### Optimisations de performance CI

#### **Cache intelligent**

- **Dependencies** : `node_modules` mis en cache par clé de `package-lock.json`
- **Next.js builds** : Cache `.next/cache` pour builds plus rapides
- **Restoration** : Cache restauré même si version exacte non trouvée

#### **Tests parallèles**

```yaml
strategy:
  matrix:
    node-version: [18, 20]
```

Les tests s'exécutent simultanément sur Node.js 18 et 20 pour garantir la compatibilité.

#### **Base de données test**

- **PostgreSQL 15** automatiquement provisionnée
- **Migrations** appliquées à chaque run
- **Données isolées** pour chaque test

### Protection des branches

#### **Règles automatiques**

- ❌ **Bloque les PR** si tests échouent
- ❌ **Bloque les PR** si linting échoue
- ❌ **Bloque les PR** si types TypeScript incorrects
- ❌ **Bloque les PR** si vulnérabilités de sécurité high/critical
- ❌ **Bloque les PR** si build de production échoue

#### **Hook pre-commit local**

```bash
# Avant chaque commit local, exécution automatique :
npx lint-staged  # Lint + format uniquement les fichiers modifiés
```

### Variables d'environnement

```bash
# .env (local)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# .env.production (production)
DATABASE_URL="postgresql://prod..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://monsite.com"
```

### Monitoring et debugging CI

#### **Logs détaillés**

- **GitHub Actions** : Interface web pour voir tous les logs en temps réel
- **Coverage reports** : Uploadés automatiquement vers Codecov
- **Performance** : Temps d'exécution trackés pour optimiser

#### **Notifications**

- **Email** : Notification automatique si pipeline échoue
- **Slack/Discord** : Intégration possible pour notifier l'équipe
- **Status badges** : Affichage du statut dans le README

### Déploiement vers différentes plateformes

#### **Vercel (recommandé pour Next.js)**

```bash
# 1. Connecter le repository GitHub à Vercel
# 2. Configurer les variables d'environnement
# 3. Déploiement automatique sur chaque push main

# Variables Vercel requises :
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://votre-app.vercel.app
```

#### **Railway**

```bash
# 1. Connecter le repository
# 2. Railway détecte automatiquement Next.js
# 3. PostgreSQL intégré disponible

# Commandes Railway
railway login
railway link
railway deploy
```

#### **Docker (production)**

```bash
# Build et déploiement avec Docker
npm run docker:prod

# Ou manuellement
docker build -t blog-app .
docker run -p 3000:3000 blog-app
```

## 🔧 Troubleshooting

### Problèmes courants CI/CD

#### **Tests qui échouent en CI mais passent localement**

```bash
# Problème : Différence d'environnement
# Solution : Reproduire l'environnement CI
export NODE_ENV=test
npm run test:ci

# Vérifier les variables d'environnement
echo $DATABASE_URL
```

#### **Build Next.js qui échoue**

```bash
# Problème courant : Variables d'environnement manquantes
# Solution : Vérifier les secrets GitHub
Settings → Secrets and variables → Actions

# Variables requises :
DATABASE_URL
NEXTAUTH_SECRET
```

#### **Hook pre-commit trop lent**

```bash
# Problème : lint-staged traite trop de fichiers
# Solution : Optimiser la configuration dans package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

#### **Erreurs TypeScript uniquement en CI**

```bash
# Problème : Versions différentes ou cache
# Solution : Forcer la régénération
npm run type-check
npx tsc --noEmit --incremental false
```

### Performance et optimisation

#### **Réduire le temps de CI**

```yaml
# Utiliser des caches agressifs
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}

# Tests parallèles par catégorie
npm run test:unit & npm run test:integration
```

#### **Optimisation des builds**

```bash
# Variables pour optimiser Next.js
NEXT_TELEMETRY_DISABLED=1
ANALYZE=false

# Build avec optimisations
npm run build
```

### Debugging local vs CI

#### **Reproduire l'environnement CI localement**

```bash
# 1. Utiliser les mêmes versions Node.js
nvm use 20

# 2. Installer avec npm ci (pas npm install)
rm -rf node_modules package-lock.json
npm ci

# 3. Utiliser les mêmes variables d'environnement
cp .env.test .env.local

# 4. Lancer les tests comme en CI
npm run test:ci
```

## 📊 Monitoring et métriques

### Coverage automatique

```bash
# Après chaque push, coverage uploadé vers Codecov
# Badge disponible pour le README :
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

### Performance tracking

- **Bundle analyzer** : Analyse automatique de la taille des bundles
- **Lighthouse CI** : Scores de performance automatiques
- **Load testing** : Tests de charge pour les API endpoints

Votre pipeline CI/CD est maintenant **enterprise-grade** et prêt pour la production ! 🚀
NEXTAUTH_URL="https://monblog.com"

````

### Scripts de déploiement
```bash
# Build de production
npm run build

# Démarrage production
npm run start

# Docker (développement)
npm run docker:dev

# Docker (production)
npm run docker:prod
````

## 📚 Ressources et conventions

### Conventions de nommage

- **Fichiers** : `kebab-case` (exemple: `user-profile.tsx`)
- **Composants** : `PascalCase` (exemple: `UserProfile`)
- **Variables/fonctions** : `camelCase` (exemple: `getUserProfile`)
- **Constants** : `UPPER_SNAKE_CASE` (exemple: `API_BASE_URL`)

### Imports et exports

```typescript
// ✅ Imports organisés
import React from 'react' // Externe
import { NextPage } from 'next' // Framework
import { Button } from '@/components' // Interne
import { formatDate } from '@/utils' // Utilitaires
import type { User } from '@/types' // Types

// ✅ Exports nommés pour les utilitaires
export const formatDate = () => {}
export const generateSlug = () => {}

// ✅ Export default pour les composants
export default function MyComponent() {}
```

### Git et commits

```bash
# Convention Conventional Commits
feat: ajouter authentification Google
fix: corriger bug de pagination
docs: mettre à jour README
refactor: reorganiser composants UI
test: ajouter tests pour Button
```

## 🆘 Dépannage courant

### Erreurs fréquentes

1. **Import non trouvé** : Vérifier les barrel exports dans `index.ts`
2. **Erreur Prisma** : Lancer `npm run db:generate`
3. **Erreur TypeScript** : Vérifier les types dans `/src/types/`
4. **Erreur de build** : Nettoyer `.next/` puis `npm run build`

### Commandes utiles

```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install

# Reset de la DB
npm run db:reset

# Vérifier tous les types
npm run type-check
```

## 🤝 Contribuer

1. **Fork** le projet
2. **Créer** une branche feature
3. **Suivre** les conventions ci-dessus
4. **Tester** thoroughly
5. **Soumettre** une Pull Request

---

Cette documentation est vivante et évolue avec le projet. N'hésitez pas à la mettre à jour lors de vos contributions ! 🚀
