# CI/CD Workflows

## 🚫 Status: Temporairement désactivé

La CI/CD a été temporairement désactivée pour économiser le quota GitHub Actions pendant le développement initial.

## 📁 Fichiers

- `ci.yml.disabled` - Pipeline CI/CD principal (désactivé)

## 🔄 Pour réactiver la CI/CD

1. **Renommer le fichier :**
   ```bash
   mv .github/workflows/ci.yml.disabled .github/workflows/ci.yml
   ```

2. **Ou via PowerShell :**
   ```powershell
   mv .github/workflows/ci.yml.disabled .github/workflows/ci.yml
   ```

3. **Commit et push :**
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "feat: Re-enable CI/CD pipeline"
   git push
   ```

## ⚙️ Configuration requise avant réactivation

Assure-toi d'avoir configuré ces secrets dans GitHub :

- `DATABASE_URL` - URL de la base de données de test
- `NEXTAUTH_SECRET` - Secret pour NextAuth.js
- `GOOGLE_CLIENT_ID` - ID client Google OAuth (optionnel)
- `GOOGLE_CLIENT_SECRET` - Secret client Google OAuth (optionnel)

## 📊 Quota GitHub Actions

- Actions gratuites : 2000 minutes/mois
- Actions privées : Selon ton plan
- Vérifier : [GitHub Settings > Billing](https://github.com/settings/billing)
