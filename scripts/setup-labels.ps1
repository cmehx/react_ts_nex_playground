# Configuration des labels GitHub pour Windows PowerShell
# setup-labels.ps1

Write-Host "🚀 Configuration des labels GitHub..." -ForegroundColor Green

# Vérifier si GitHub CLI est installé
try {
    gh --version | Out-Null
    Write-Host "✅ GitHub CLI détecté" -ForegroundColor Green
}
catch {
    Write-Host "❌ GitHub CLI n'est pas installé. Installez-le avec: winget install GitHub.cli" -ForegroundColor Red
    exit 1
}

# Vérifier l'authentification GitHub
try {
    gh auth status | Out-Null
    Write-Host "✅ Authentifié sur GitHub" -ForegroundColor Green
}
catch {
    Write-Host "❌ Non authentifié. Exécutez: gh auth login" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Création des labels..." -ForegroundColor Yellow

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
gh label create "wiki" --color "0052cc" --description "Mise a jour du wiki/guides"

# Testing & Quality
gh label create "testing" --color "fbca04" --description "Ajout ou amelioration des tests"
gh label create "ci-cd" --color "f29513" --description "Configuration CI/CD et automatisation"
gh label create "refactoring" --color "e6e6e6" --description "Refactoring du code sans changement de fonctionnalite"
gh label create "technical-debt" --color "cccccc" --description "Reduction de la dette technique"

# Priority
gh label create "priority-high" --color "d73a49" --description "Priorite elevee"
gh label create "priority-medium" --color "fbca04" --description "Priorite moyenne"
gh label create "priority-low" --color "28a745" --description "Priorite basse"

# Size/Effort
gh label create "size-XS" --color "b4c5cc" --description "Tres petit effort moins de 1h"
gh label create "size-S" --color "7f8c8d" --description "Petit effort 1-4h"
gh label create "size-M" --color "5bc0de" --description "Effort moyen 1-2 jours"
gh label create "size-L" --color "f0ad4e" --description "Gros effort 3-5 jours"
gh label create "size-XL" --color "d9534f" --description "Tres gros effort plus d'1 semaine"

# Status
gh label create "status-needs-review" --color "fbca04" --description "En attente de review"
gh label create "status-in-progress" --color "0052cc" --description "En cours de developpement"
gh label create "status-blocked" --color "d73a49" --description "Bloque par dependance externe"
gh label create "status-on-hold" --color "cccccc" --description "En pause temporaire"

# Team/Area
gh label create "area-frontend" --color "1f77b4" --description "Interface utilisateur"
gh label create "area-backend" --color "ff7f0e" --description "API et serveur"
gh label create "area-database" --color "2ca02c" --description "Base de donnees et migrations"
gh label create "area-auth" --color "d62728" --description "Authentification et autorisation"
gh label create "area-ui-ux" --color "9467bd" --description "Design et experience utilisateur"
gh label create "area-devops" --color "8c564b" --description "Infrastructure et deploiement"

# Release
gh label create "breaking-change" --color "d73a49" --description "Changement cassant la compatibilite"
gh label create "major" --color "d9534f" --description "Version majeure"
gh label create "minor" --color "f0ad4e" --description "Version mineure"
gh label create "patch" --color "5cb85c" --description "Correction de bug"

# Contribution
gh label create "good-first-issue" --color "28a745" --description "Bon pour les nouveaux contributeurs"
gh label create "help-wanted" --color "159818" --description "Aide externe souhaitee"
gh label create "mentor-available" --color "0e8a16" --description "Un mentor est disponible"
gh label create "hacktoberfest" --color "ff8c00" --description "Participe a Hacktoberfest"

Write-Host "Labels GitHub configurés avec succès!" -ForegroundColor Green
Write-Host "Vous pouvez maintenant voir les labels dans votre repository GitHub" -ForegroundColor Cyan
Write-Host "URL: https://github.com/cmehx/react_ts_nex_playground/labels" -ForegroundColor Cyan
