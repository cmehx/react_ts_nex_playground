# Git Workflow & Branch Strategy

## 🌳 Stratégie de branches

Ce projet utilise un **Git Flow simplifié** optimisé pour une collaboration efficace.

### Branches principales

#### `main` (Production)

- **Protection complète** activée
- **Déploiement automatique** en production
- **Merge uniquement** via Pull Request approuvée
- **CI/CD obligatoire** : tous les tests doivent passer

#### `develop` (Intégration)

- **Branche de développement** principal
- **Tests automatiques** sur chaque push
- **Deploy automatique** vers environnement de staging
- **Base pour** toutes les nouvelles features

### Branches de travail

#### `feature/[nom-descriptif]` (Fonctionnalités)

```bash
# Création depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Développement...
git add .
git commit -m "feat: add user login functionality"

# Push et création PR
git push origin feature/user-authentication
```

#### `fix/[nom-descriptif]` (Corrections)

```bash
# Pour bugs non-critiques
git checkout develop
git checkout -b fix/button-alignment

# Pour hotfixes critiques (depuis main)
git checkout main
git checkout -b hotfix/security-patch
```

#### `chore/[nom-descriptif]` (Maintenance)

```bash
# Documentation, configuration, dépendances
git checkout develop
git checkout -b chore/update-dependencies
```

## 🔄 Workflow de contribution

### 1. Setup initial (une seule fois)

```bash
# Fork le projet sur GitHub
# Clone votre fork
git clone https://github.com/VOTRE-USERNAME/react_ts_nex_playground.git
cd react_ts_nex_playground

# Ajouter le remote upstream
git remote add upstream https://github.com/cmehx/react_ts_nex_playground.git
git remote -v
```

### 2. Commencer une nouvelle feature

```bash
# Synchroniser avec upstream
git checkout develop
git pull upstream develop
git push origin develop

# Créer votre branche
git checkout -b feature/ma-nouvelle-feature

# Setup environnement
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

### 3. Développement quotidien

```bash
# Développer avec hot reload
npm run dev

# Tests en mode watch
npm run test:watch

# Commits fréquents avec messages clairs
git add .
git commit -m "feat: add user registration form"
```

### 4. Avant de pousser

```bash
# Synchroniser avec develop (éviter les conflits)
git checkout develop
git pull upstream develop
git checkout feature/ma-nouvelle-feature
git rebase develop

# Vérifier la qualité (comme la CI)
npm run lint
npm run type-check
npm run test:ci
npm run build

# Push vers votre fork
git push origin feature/ma-nouvelle-feature
```

### 5. Créer une Pull Request

1. **GitHub Web** : Créer PR depuis votre fork vers `cmehx:develop`
2. **Template** : Remplir le template automatique
3. **Reviewers** : Assigner des reviewers si vous en connaissez
4. **Labels** : Ajouter les labels appropriés

### 6. Après review et merge

```bash
# Nettoyer votre environnement local
git checkout develop
git pull upstream develop
git branch -d feature/ma-nouvelle-feature
git push origin --delete feature/ma-nouvelle-feature
```

## 🛡️ Règles de protection

### Branch `main`

- ✅ **Require pull request reviews** (1 reviewer minimum)
- ✅ **Require status checks** (CI/CD doit passer)
- ✅ **Require branches up to date** (rebase obligatoire)
- ✅ **Restrict pushes** (admins uniquement)
- ❌ **Allow force pushes** (interdit)
- ❌ **Allow deletions** (interdit)

### Branch `develop`

- ✅ **Require status checks** (CI/CD doit passer)
- ✅ **Require branches up to date**
- ⚠️ **Reviews optionnelles** (mais recommandées)

## 📋 Conventions de commit

### Format standard

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

### Types autorisés

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation uniquement
- **style**: Formatage (pas de changement de logique)
- **refactor**: Refactoring sans changement de fonctionnalité
- **test**: Ajout ou modification de tests
- **chore**: Maintenance (deps, config, etc.)
- **perf**: Amélioration de performance
- **ci**: Changements CI/CD

### Exemples

```bash
feat(auth): add Google OAuth integration
fix(ui): correct button alignment on mobile
docs: update API documentation
test(utils): add tests for formatDate function
chore(deps): update Next.js to version 15
```

## 🏷️ Système de tags et releases

### Tags de version

```bash
# Releases majeures
v1.0.0, v2.0.0

# Releases mineures (nouvelles features)
v1.1.0, v1.2.0

# Patches (bug fixes)
v1.1.1, v1.1.2
```

### Création automatique de releases

```bash
# Via GitHub CLI (si configuré)
gh release create v1.1.0 --title "Version 1.1.0" --notes "..."

# Ou via l'interface GitHub
# Releases → Create a new release
```

## 🔧 Scripts utiles pour Git

### Synchronisation rapide

```bash
# Alias Git recommandés (.gitconfig)
[alias]
  sync = "!f() { git checkout develop && git pull upstream develop && git push origin develop; }; f"
  new-feature = "!f() { git sync && git checkout -b feature/$1; }; f"
  cleanup = "!f() { git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d; }; f"

# Utilisation
git sync                           # Synchroniser develop
git new-feature user-profile       # Créer feature/user-profile
git cleanup                        # Nettoyer les branches mergées
```

### Vérifications pre-push

```bash
# Script personnel (ajout dans .bashrc/.zshrc)
function git-check() {
  echo "🔍 Vérifications avant push..."
  npm run lint && npm run type-check && npm run test:ci
  if [ $? -eq 0 ]; then
    echo "✅ Tout est bon, vous pouvez push !"
  else
    echo "❌ Des erreurs existent, veuillez corriger avant de push"
  fi
}
```

## 📚 Ressources supplémentaires

- **Git Flow**: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
- **Conventional Commits**: https://www.conventionalcommits.org/
- **GitHub Flow**: https://docs.github.com/en/get-started/quickstart/github-flow

Ce workflow garantit une **collaboration fluide et professionnelle** ! 🚀
