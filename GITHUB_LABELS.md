# Configuration des labels GitHub recommandés

## 🎯 Labels par type

### 🐛 Bug & Issues

- `bug` - #d73a49 - Quelque chose ne fonctionne pas
- `critical` - #b60205 - Bug critique affectant la production
- `hotfix` - #e99695 - Correction urgente nécessaire
- `regression` - #d93f0b - Régression introduite récemment

### ✨ Features & Enhancements

- `enhancement` - #a2eeef - Nouvelle fonctionnalité ou amélioration
- `feature` - #84b6eb - Nouvelle fonctionnalité
- `improvement` - #c5def5 - Amélioration d'une fonctionnalité existante
- `performance` - #f9d0c4 - Amélioration des performances

### 📚 Documentation

- `documentation` - #0075ca - Amélioration ou corrections de documentation
- `readme` - #007bff - Mise à jour du README
- `wiki` - #0052cc - Mise à jour du wiki/guides

### 🧪 Testing & Quality

- `testing` - #fbca04 - Ajout ou amélioration des tests
- `ci/cd` - #f29513 - Configuration CI/CD et automatisation
- `refactoring` - #e6e6e6 - Refactoring du code sans changement de fonctionnalité
- `technical-debt` - #cccccc - Réduction de la dette technique

### 🏷️ Priority

- `priority: high` - #d73a49 - Priorité élevée
- `priority: medium` - #fbca04 - Priorité moyenne
- `priority: low` - #28a745 - Priorité basse

### 📏 Size/Effort

- `size: XS` - #b4c5cc - Très petit effort (< 1h)
- `size: S` - #7f8c8d - Petit effort (1-4h)
- `size: M` - #5bc0de - Effort moyen (1-2 jours)
- `size: L` - #f0ad4e - Gros effort (3-5 jours)
- `size: XL` - #d9534f - Très gros effort (> 1 semaine)

### 🎭 Status

- `status: needs-review` - #fbca04 - En attente de review
- `status: in-progress` - #0052cc - En cours de développement
- `status: blocked` - #d73a49 - Bloqué par dépendance externe
- `status: on-hold` - #cccccc - En pause temporaire

### 👥 Team/Area

- `area: frontend` - #1f77b4 - Interface utilisateur
- `area: backend` - #ff7f0e - API et serveur
- `area: database` - #2ca02c - Base de données et migrations
- `area: auth` - #d62728 - Authentification et autorisation
- `area: ui/ux` - #9467bd - Design et expérience utilisateur
- `area: devops` - #8c564b - Infrastructure et déploiement

### 🚀 Release

- `breaking-change` - #d73a49 - Changement cassant la compatibilité
- `major` - #d9534f - Version majeure
- `minor` - #f0ad4e - Version mineure
- `patch` - #5cb85c - Correction de bug

### 👨‍💻 Contribution

- `good-first-issue` - #28a745 - Bon pour les nouveaux contributeurs
- `help-wanted` - #159818 - Aide externe souhaitée
- `mentor-available` - #0e8a16 - Un mentor est disponible
- `hacktoberfest` - #ff8c00 - Participe à Hacktoberfest

## 🛠️ Configuration des labels

### Option 1: Installation automatique (si GitHub CLI est installé)

#### Installation GitHub CLI

```powershell
# PowerShell (Windows)
winget install GitHub.cli

# Ou chocolatey
choco install gh

# Vérification
gh --version
gh auth login
```

#### Script de configuration automatique

```powershell
# Exécuter le script
powershell -ExecutionPolicy Bypass -File scripts\setup-labels-simple.ps1
```

### Option 2: Configuration manuelle (GitHub Web UI)

Si vous préférez configurer manuellement via l'interface GitHub :

1. **Aller sur votre repository** : https://github.com/cmehx/react_ts_nex_playground
2. **Cliquer sur "Issues"** > **"Labels"**
3. **Supprimer les labels par défaut** (enhancement, bug, etc.)
4. **Créer les nouveaux labels** avec les couleurs et descriptions suivantes :

#### Labels essentiels à créer manuellement :

**🐛 Bug & Issues**

- `bug` - Couleur: `#d73a49` - Description: "Quelque chose ne fonctionne pas"
- `critical` - Couleur: `#b60205` - Description: "Bug critique"
- `hotfix` - Couleur: `#e99695` - Description: "Correction urgente"

**✨ Features**

- `enhancement` - Couleur: `#a2eeef` - Description: "Nouvelle fonctionnalité"
- `feature` - Couleur: `#84b6eb` - Description: "Nouvelle fonctionnalité"
- `performance` - Couleur: `#f9d0c4` - Description: "Amélioration des performances"

**📚 Documentation**

- `documentation` - Couleur: `#0075ca` - Description: "Documentation"

**🧪 Testing**

- `testing` - Couleur: `#fbca04` - Description: "Tests"
- `ci-cd` - Couleur: `#f29513` - Description: "CI/CD"

**🏷️ Priority**

- `priority-high` - Couleur: `#d73a49` - Description: "Priorité élevée"
- `priority-medium` - Couleur: `#fbca04` - Description: "Priorité moyenne"
- `priority-low` - Couleur: `#28a745` - Description: "Priorité basse"

**📏 Size**

- `size-XS` - Couleur: `#b4c5cc` - Description: "Très petit effort"
- `size-S` - Couleur: `#7f8c8d` - Description: "Petit effort"
- `size-M` - Couleur: `#5bc0de` - Description: "Effort moyen"
- `size-L` - Couleur: `#f0ad4e` - Description: "Gros effort"
- `size-XL` - Couleur: `#d9534f` - Description: "Très gros effort"

**👥 Areas**

- `area-frontend` - Couleur: `#1f77b4` - Description: "Interface utilisateur"
- `area-backend` - Couleur: `#ff7f0e` - Description: "API et serveur"
- `area-database` - Couleur: `#2ca02c` - Description: "Base de données"
- `area-auth` - Couleur: `#d62728` - Description: "Authentification"

**🤝 Contribution**

- `good-first-issue` - Couleur: `#28a745` - Description: "Bon pour nouveaux contributeurs"
- `help-wanted` - Couleur: `#159818` - Description: "Aide externe souhaitée"

### Option 3: Via API REST (curl)

```bash
# Template de création via API
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/cmehx/react_ts_nex_playground/labels \
  -d '{
    "name": "bug",
    "color": "d73a49",
    "description": "Quelque chose ne fonctionne pas"
  }'
```

### Configuration complète (script)

#### Version PowerShell (Windows)

```powershell
# setup-labels.ps1

Write-Host "Configuration des labels GitHub..." -ForegroundColor Green

# Bug labels
gh label create "bug" --color "d73a49" --description "Quelque chose ne fonctionne pas"
gh label create "critical" --color "b60205" --description "Bug critique affectant la production"
gh label create "hotfix" --color "e99695" --description "Correction urgente necessaire"
gh label create "regression" --color "d93f0b" --description "Regression introduite recemment"

# Enhancement labels
gh label create "enhancement" --color "a2eeef" --description "Nouvelle fonctionnalite ou amelioration"
gh label create "feature" --color "84b6eb" --description "Nouvelle fonctionnalite"
gh label create "improvement" --color "c5def5" --description "Amelioration d'une fonctionnalite existante"
gh label create "performance" --color "f9d0c4" --description "Amelioration des performances"

# Documentation
gh label create "documentation" --color "0075ca" --description "Amelioration ou corrections de documentation"
gh label create "readme" --color "007bff" --description "Mise a jour du README"

# Testing & Quality
gh label create "testing" --color "fbca04" --description "Ajout ou amelioration des tests"
gh label create "ci/cd" --color "f29513" --description "Configuration CI/CD et automatisation"
gh label create "refactoring" --color "e6e6e6" --description "Refactoring du code sans changement de fonctionnalite"

# Priority
gh label create "priority: high" --color "d73a49" --description "Priorite elevee"
gh label create "priority: medium" --color "fbca04" --description "Priorite moyenne"
gh label create "priority: low" --color "28a745" --description "Priorite basse"

# Size/Effort
gh label create "size: XS" --color "b4c5cc" --description "Tres petit effort (moins de 1h)"
gh label create "size: S" --color "7f8c8d" --description "Petit effort (1-4h)"
gh label create "size: M" --color "5bc0de" --description "Effort moyen (1-2 jours)"
gh label create "size: L" --color "f0ad4e" --description "Gros effort (3-5 jours)"
gh label create "size: XL" --color "d9534f" --description "Tres gros effort (plus d'1 semaine)"

# Status
gh label create "status: needs-review" --color "fbca04" --description "En attente de review"
gh label create "status: in-progress" --color "0052cc" --description "En cours de developpement"
gh label create "status: blocked" --color "d73a49" --description "Bloque par dependance externe"

# Team/Area
gh label create "area: frontend" --color "1f77b4" --description "Interface utilisateur"
gh label create "area: backend" --color "ff7f0e" --description "API et serveur"
gh label create "area: database" --color "2ca02c" --description "Base de donnees et migrations"
gh label create "area: auth" --color "d62728" --description "Authentification et autorisation"
gh label create "area: ui/ux" --color "9467bd" --description "Design et experience utilisateur"

# Release
gh label create "breaking-change" --color "d73a49" --description "Changement cassant la compatibilite"
gh label create "major" --color "d9534f" --description "Version majeure"
gh label create "minor" --color "f0ad4e" --description "Version mineure"
gh label create "patch" --color "5cb85c" --description "Correction de bug"

# Contribution
gh label create "good-first-issue" --color "28a745" --description "Bon pour les nouveaux contributeurs"
gh label create "help-wanted" --color "159818" --description "Aide externe souhaitee"
gh label create "mentor-available" --color "0e8a16" --description "Un mentor est disponible"

Write-Host "Labels GitHub configures avec succes!" -ForegroundColor Green
```

#### Version Bash (Linux/Mac)

```bash
#!/bin/bash
# setup-labels.sh

echo "Configuration des labels GitHub..."

# Bug labels
gh label create "bug" --color "d73a49" --description "Quelque chose ne fonctionne pas"
gh label create "critical" --color "b60205" --description "Bug critique affectant la production"
gh label create "hotfix" --color "e99695" --description "Correction urgente necessaire"

# Enhancement labels
gh label create "enhancement" --color "a2eeef" --description "Nouvelle fonctionnalite ou amelioration"
gh label create "feature" --color "84b6eb" --description "Nouvelle fonctionnalite"
gh label create "performance" --color "f9d0c4" --description "Amelioration des performances"

# Documentation
gh label create "documentation" --color "0075ca" --description "Amelioration ou corrections de documentation"

# Testing & Quality
gh label create "testing" --color "fbca04" --description "Ajout ou amelioration des tests"
gh label create "ci/cd" --color "f29513" --description "Configuration CI/CD"

# Priority
gh label create "priority: high" --color "d73a49" --description "Priorite elevee"
gh label create "priority: medium" --color "fbca04" --description "Priorite moyenne"
gh label create "priority: low" --color "28a745" --description "Priorite basse"

# Size
gh label create "size: XS" --color "b4c5cc" --description "Tres petit effort (moins de 1h)"
gh label create "size: S" --color "7f8c8d" --description "Petit effort (1-4h)"
gh label create "size: M" --color "5bc0de" --description "Effort moyen (1-2 jours)"
gh label create "size: L" --color "f0ad4e" --description "Gros effort (3-5 jours)"
gh label create "size: XL" --color "d9534f" --description "Tres gros effort (plus d'1 semaine)"

# Team/Area
gh label create "area: frontend" --color "1f77b4" --description "Interface utilisateur"
gh label create "area: backend" --color "ff7f0e" --description "API et serveur"
gh label create "area: database" --color "2ca02c" --description "Base de donnees"
gh label create "area: auth" --color "d62728" --description "Authentification"

# Contribution
gh label create "good-first-issue" --color "28a745" --description "Bon pour les nouveaux contributeurs"
gh label create "help-wanted" --color "159818" --description "Aide externe souhaitee"

echo "Labels GitHub configures avec succes!"
```

## 📋 Usage des labels

### Workflow recommandé

#### 1. Création d'issue

```markdown
<!-- Exemple d'assignation automatique -->

Labels suggérés: bug, area: frontend, priority: high, size: M
```

#### 2. Review de PR

```markdown
<!-- Labels pour PR -->

- enhancement + area: backend + size: L
- documentation + good-first-issue
- testing + ci/cd + size: S
```

#### 3. Planning sprint

```markdown
<!-- Filtrage par labels -->

- Sprint actuel: priority: high + size: S,M
- Backlog: priority: medium + good-first-issue
- Tech debt: technical-debt + size: XS,S
```

### Templates avec labels auto

#### Bug Report (avec labels auto)

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: 🐛 Bug Report
description: Report a bug
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: []
```

#### Feature Request (avec labels auto)

```yaml
# .github/ISSUE_TEMPLATE/feature_request.yml
name: ✨ Feature Request
description: Suggest a new feature
title: '[FEATURE] '
labels: ['enhancement', 'needs-review']
assignees: []
```

Cette organisation avec labels garantit une **gestion efficace des issues et PR** ! 🏷️
