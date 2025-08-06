Write-Host "Configuration des labels GitHub..." -ForegroundColor Green

# Bug labels
gh label create "bug" --color "d73a49" --description "Quelque chose ne fonctionne pas"
gh label create "critical" --color "b60205" --description "Bug critique"
gh label create "hotfix" --color "e99695" --description "Correction urgente"

# Features
gh label create "enhancement" --color "a2eeef" --description "Nouvelle fonctionnalite"
gh label create "feature" --color "84b6eb" --description "Nouvelle fonctionnalite"
gh label create "performance" --color "f9d0c4" --description "Amelioration des performances"

# Documentation
gh label create "documentation" --color "0075ca" --description "Documentation"

# Testing
gh label create "testing" --color "fbca04" --description "Tests"
gh label create "ci-cd" --color "f29513" --description "CI/CD"

# Priority
gh label create "priority-high" --color "d73a49" --description "Priorite elevee"
gh label create "priority-medium" --color "fbca04" --description "Priorite moyenne"
gh label create "priority-low" --color "28a745" --description "Priorite basse"

# Size
gh label create "size-XS" --color "b4c5cc" --description "Tres petit effort"
gh label create "size-S" --color "7f8c8d" --description "Petit effort"
gh label create "size-M" --color "5bc0de" --description "Effort moyen"
gh label create "size-L" --color "f0ad4e" --description "Gros effort"
gh label create "size-XL" --color "d9534f" --description "Tres gros effort"

# Areas
gh label create "area-frontend" --color "1f77b4" --description "Interface utilisateur"
gh label create "area-backend" --color "ff7f0e" --description "API et serveur"
gh label create "area-database" --color "2ca02c" --description "Base de donnees"
gh label create "area-auth" --color "d62728" --description "Authentification"

# Contribution
gh label create "good-first-issue" --color "28a745" --description "Bon pour nouveaux contributeurs"
gh label create "help-wanted" --color "159818" --description "Aide externe souhaitee"

Write-Host "Labels crees avec succes!" -ForegroundColor Green
