# Branch Protection & Repository Configuration

## 🛡️ Configuration de protection des branches

### Protection branch `main` (Production)

#### Settings recommandés GitHub:

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "CI / test (18.x)",
      "CI / test (20.x)",
      "CI / lint",
      "CI / type-check",
      "Vercel – react-ts-nex-playground"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
```

#### Configuration via GitHub CLI:

```bash
# Protection main branch
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI / test (18.x)","CI / test (20.x)","CI / lint","CI / type-check"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

### Protection branch `develop` (Staging)

#### Settings recommandés:

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["CI / test (18.x)", "CI / lint", "CI / type-check"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": false
}
```

## 👥 CODEOWNERS Configuration

```bash
# .github/CODEOWNERS

# Global owners (fallback)
* @your-username

# Frontend components
/src/components/ @frontend-team @your-username
/src/app/ @frontend-team @your-username

# Backend/API
/src/app/api/ @backend-team @your-username
/prisma/ @backend-team @your-username

# Infrastructure & CI/CD
/.github/ @devops-team @your-username
/docker* @devops-team @your-username
/.env* @devops-team @your-username

# Documentation
*.md @docs-team @your-username
/docs/ @docs-team @your-username

# Configuration files
package.json @your-username
package-lock.json @your-username
tsconfig.json @your-username
next.config.ts @your-username
tailwind.config.js @your-username

# Security sensitive
/src/lib/auth.ts @security-team @your-username
/src/app/api/auth/ @security-team @your-username
```

## ⚙️ Repository Settings

### General Settings

```yaml
Repository Settings:
  - Allow merge commits: ✅
  - Allow squash merging: ✅ (recommandé)
  - Allow rebase merging: ❌
  - Always suggest updating pull request branches: ✅
  - Allow auto-merge: ✅
  - Automatically delete head branches: ✅
```

### Security Settings

```yaml
Security & Analysis:
  - Dependency graph: ✅
  - Dependabot alerts: ✅
  - Dependabot security updates: ✅
  - Code scanning alerts: ✅
  - Secret scanning alerts: ✅
  - Private vulnerability reporting: ✅
```

### Webhooks & Integrations

```yaml
Recommended Integrations:
  - Vercel: ✅ (auto-deploy)
  - CodeQL: ✅ (security scanning)
  - Dependabot: ✅ (dependency updates)
  - GitHub Actions: ✅ (CI/CD)
```

## 🏷️ Auto-assignement et templates

### PR Auto-assignment

```yaml
# .github/PULL_REQUEST_TEMPLATE/default.md
---
assignees: your-username
reviewers: frontend-team, backend-team
labels: needs-review
---
```

### Issue Auto-assignment par type

```yaml
# .github/ISSUE_TEMPLATE/config.yml
blank_issues_enabled: false
contact_links:
  - name: 💬 Discussion générale
    url: https://github.com/your-username/blog/discussions
    about: Pour des questions générales ou discussions
  - name: 🔒 Signaler une vulnérabilité
    url: https://github.com/your-username/blog/security/advisories/new
    about: Signaler des problèmes de sécurité de manière confidentielle
```

## 🔄 Automated Workflows

### Auto-merge pour Dependabot

```yaml
# .github/workflows/dependabot-auto-merge.yml
name: Dependabot auto-merge
on: pull_request

permissions:
  contents: write
  pull-requests: write

jobs:
  dependabot:
    runs-on: ubuntu-latest
    if: ${{ github.actor == 'dependabot[bot]' }}
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1
        with:
          github-token: '${{ secrets.GITHUB_TOKEN }}'

      - name: Auto-merge for patch updates
        if: ${{ steps.metadata.outputs.update-type == 'version-update:semver-patch' }}
        run: gh pr merge --auto --merge "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

### Label Sync

```yaml
# .github/workflows/label-sync.yml
name: Label Sync
on:
  push:
    branches: [main]
    paths: ['.github/labels.yml']

jobs:
  label-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: micnncim/action-label-syncer@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          manifest: .github/labels.yml
```

## 📊 Métriques et monitoring

### GitHub Insights

```yaml
Métriques à surveiller:
  - Pulse: Activité générale du repo
  - Contributors: Contributions par développeur
  - Community: Standards de la communauté
  - Traffic: Vues et clones du repository
  - Dependency graph: Sécurité des dépendances
```

### Actions recommandées

```yaml
Weekly Reviews:
  - ✅ Review des PR ouvertes > 7 jours
  - ✅ Issues sans label "triage"
  - ✅ Dependabot alerts critiques
  - ✅ Failed CI/CD workflows
  - ✅ Code scanning alerts
```

## 🚀 Quick Setup Script

### Configuration complète

```bash
#!/bin/bash
# setup-repo.sh - Configuration complète du repository

echo "🚀 Configuration du repository GitHub..."

# 1. Labels
echo "📝 Configuration des labels..."
./scripts/setup-labels.sh

# 2. Branch protection
echo "🛡️ Protection des branches..."
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI / test (18.x)","CI / test (20.x)","CI / lint"]}' \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field allow_force_pushes=false

# 3. Repository settings
echo "⚙️ Configuration du repository..."
gh api repos/:owner/:repo \
  --method PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=true \
  --field allow_rebase_merge=false \
  --field delete_branch_on_merge=true

# 4. Enable security features
echo "🔒 Activation des fonctionnalités de sécurité..."
gh api repos/:owner/:repo/vulnerability-alerts \
  --method PUT

echo "✅ Configuration terminée!"
echo "📋 Prochaines étapes manuelles:"
echo "   1. Configurer Vercel integration"
echo "   2. Ajouter les membres de l'équipe"
echo "   3. Configurer les environnements Vercel"
echo "   4. Tester le workflow complet"
```

Cette configuration assure une **collaboration professionnelle et sécurisée** ! 🛡️
