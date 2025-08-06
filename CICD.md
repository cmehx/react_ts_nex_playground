# CI/CD Pipeline Documentation

## 🔄 Overview

Ce projet utilise GitHub Actions pour une pipeline CI/CD complète qui garantit la qualité du code et automatise les déploiements.

## 📋 Pipeline Workflow

### Déclencheurs

- **Push** sur les branches `main` et `develop`
- **Pull Requests** vers `main`

### Matrice de tests

```yaml
strategy:
  matrix:
    node-version: [18, 20]
```

### Étapes de validation

#### 1. **Setup & Installation**

```yaml
- Checkout du code source
- Setup Node.js (18 & 20) avec cache npm
- Installation des dépendances (npm ci)
- Cache Next.js builds pour performance
```

#### 2. **Database Setup**

```yaml
- PostgreSQL 15 en service Docker
- Génération du client Prisma
- Application des migrations
- Base de données isolée par job
```

#### 3. **Quality Checks**

```yaml
- ESLint validation avec --max-warnings=0
- Prettier formatting check
- npm audit pour sécurité (niveau high+)
- TypeScript type checking strict
```

#### 4. **Testing**

```yaml
- Jest avec coverage complète
- Tests unitaires + intégration
- Upload automatique vers Codecov
- Parallélisation par version Node.js
```

#### 5. **Build & Deploy**

```yaml
- Build Next.js production
- Validation des assets statiques
- Déploiement automatique (main uniquement)
```

## 🛡️ Protections de qualité

### Pre-commit hooks locaux

```bash
# Husky + lint-staged (automatique)
npx lint-staged  # Lint uniquement les fichiers modifiés
```

### Branch protection rules

- **Status checks requis** : Tous les jobs CI doivent passer
- **Reviews requises** : Au moins 1 review approuvée
- **Branch up-to-date** : Doit être synchronisée avec main
- **No force push** : Interdit les push forcés

## ⚡ Optimisations de performance

### Caching stratégique

```yaml
# Dependencies cache
key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}

# Next.js build cache
key: ${{ runner.os }}-nextjs-${{ hashFiles('**/*.{js,jsx,ts,tsx}') }}
```

### Parallélisation

- **Multi-Node testing** : Node.js 18 & 20 simultanément
- **Job splitting** : Linting, tests, build en parallèle
- **Conditional deployment** : Seulement si tous les tests passent

## 🔧 Configuration locale

### Reproduire la CI localement

```bash
# 1. Utiliser la même version Node.js
nvm use 20

# 2. Installation identique à la CI
rm -rf node_modules package-lock.json
npm ci

# 3. Variables d'environnement test
cp .env.example .env.test

# 4. Lancer comme en CI
export NODE_ENV=test
npm run test:ci
npm run lint
npm run type-check
npm run build
```

### Scripts CI disponibles

```bash
npm run test:ci         # Tests avec coverage, no-watch
npm run lint            # ESLint avec reporting
npm run format:check    # Prettier validation
npm run type-check      # TypeScript strict check
npm run build           # Next.js production build
```

## 📊 Monitoring & Métriques

### Coverage automatique

- **Seuil minimal** : 80% coverage requis
- **Upload Codecov** : Après chaque push/PR
- **Trends tracking** : Suivi de l'évolution

### Performance tracking

- **Bundle analysis** : Taille des bundles trackée
- **Build time** : Optimisations automatiques
- **Cache hit rate** : Monitoring des caches

### Notifications

- **Email** : Échecs de pipeline
- **GitHub** : Status badges dans les PR
- **Slack** : Intégration possible (webhook)

## 🚀 Déploiement

### Environnements automatiques

#### **Staging** (develop branch)

```yaml
- URL: https://staging-blog.vercel.app
- Database: PostgreSQL staging
- Déploiement: Automatique sur push develop
```

#### **Production** (main branch)

```yaml
- URL: https://blog.vercel.app
- Database: PostgreSQL production
- Déploiement: Automatique après validation complète
```

### Variables d'environnement CI

```yaml
# Secrets GitHub requis
DATABASE_URL: ${{ secrets.DATABASE_URL }}
NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}

# Variables publiques
NODE_ENV: production
NEXT_TELEMETRY_DISABLED: 1
```

## 🔍 Debugging CI/CD

### Logs détaillés

```bash
# GitHub Actions logs
- Actions tab → Workflow → Job → Step
- Download logs pour analyse locale
- Matrix logs séparés par version Node.js
```

### Échecs courants et solutions

#### **Tests failing en CI uniquement**

```bash
# Cause: Différences d'environnement
# Solution: Vérifier NODE_ENV et variables
export NODE_ENV=test
npm run test:ci
```

#### **Build errors en production**

```bash
# Cause: Variables d'environnement manquantes
# Solution: Vérifier GitHub Secrets
Settings → Secrets and variables → Actions
```

#### **Type errors en CI uniquement**

```bash
# Cause: Cache TypeScript corrompu
# Solution:
npm run type-check
rm -rf .next
npx tsc --incremental false
```

#### **Linting failures**

```bash
# Cause: Configurations différentes local vs CI
# Solution: Utiliser les mêmes commandes
npm run lint            # Même commande qu'en CI
npm run format:check    # Vérifier formatting
```

## 📈 Évolutions futures

### Améliorations planifiées

- **Lighthouse CI** : Tests de performance automatiques
- **Visual regression** : Tests visuels avec Chromatic
- **Load testing** : Tests de charge automatiques
- **Multi-environment** : Staging automatique

### Intégrations possibles

- **Dependabot** : Mises à jour automatiques des dépendances
- **Renovate** : Alternative à Dependabot plus configurable
- **Snyk** : Scanning sécurité avancé
- **SonarCloud** : Analyse qualité code approfondie

## 🛠️ Maintenance

### Mise à jour des workflows

```bash
# 1. Modifier .github/workflows/ci.yml
# 2. Tester localement si possible
# 3. Push vers branche de test
# 4. Valider que la CI passe
# 5. Merge vers main
```

### Monitoring des performances

- **Weekly review** : Temps d'exécution des jobs
- **Monthly analysis** : Optimisations possibles
- **Cache efficiency** : Taux de hit des caches

La pipeline CI/CD est maintenant robuste, rapide et prête pour la production ! 🚀
