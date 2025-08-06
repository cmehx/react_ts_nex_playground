# 🤝 Guide de Contribution

Bienvenue ! Ce guide vous explique comment contribuer efficacement au projet, même si vous n'êtes pas familier avec cette stack technique.

## 🎯 Pour commencer

### Si vous êtes nouveau sur le projet

1. **Lisez d'abord** le [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) pour comprendre l'architecture
2. **Explorez** les [PATTERNS.md](./PATTERNS.md) pour les conventions de code
3. **Configurez** votre environnement de développement
4. **Commencez** par des tâches simples marquées `good-first-issue`

### Niveaux de contribution

- 🟢 **Débutant** : Corrections de bugs, améliorations UI, documentation
- 🟡 **Intermédiaire** : Nouvelles fonctionnalités, refactoring, tests
- 🔴 **Avancé** : Architecture, performance, sécurité

## 🛠️ Configuration de l'environnement

### 1. Fork et Clone

```bash
# 1. Fork le projet sur GitHub
# 2. Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/blog.git
cd blog

# 3. Ajouter le remote upstream
git remote add upstream https://github.com/REPO-ORIGINAL/blog.git
```

### 2. Installation

```bash
# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env

# Configurer la base de données (voir section DB ci-dessous)
npm run db:generate
npm run db:migrate
npm run db:seed

# Lancer en mode développement
npm run dev
```

### 3. Configuration de la base de données

#### Option A : PostgreSQL local

```bash
# Installer PostgreSQL
# Windows : Télécharger depuis postgresql.org
# Mac : brew install postgresql
# Linux : sudo apt install postgresql

# Créer une base de données
createdb blog_dev

# Dans .env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_dev"
```

#### Option B : Base de données cloud (plus simple)

```bash
# Utiliser Railway, Supabase, ou PlanetScale
# Copier l'URL de connexion dans .env
DATABASE_URL="postgresql://..."
```

### 4. Configuration de l'éditeur (VS Code recommandé)

Extensions recommandées (installées automatiquement via `.vscode/extensions.json`) :

- **ESLint** : Linting en temps réel
- **Prettier** : Formatage automatique
- **TypeScript Hero** : Aide pour les imports
- **Tailwind CSS IntelliSense** : Autocomplétion CSS
- **Prisma** : Support pour les schémas DB

## 🏃‍♂️ Workflow de développement

### 1. Avant de commencer

```bash
# Synchroniser avec le projet principal
git checkout main
git pull upstream main
git push origin main

# Créer une branche pour votre feature
git checkout -b feature/nom-descriptif
# ou
git checkout -b fix/description-du-bug
```

### 2. Pendant le développement

```bash
# Lancer le serveur de dev (avec hot reload)
npm run dev

# Dans un autre terminal, lancer les tests en mode watch
npm run test:watch

# Vérifier que la CI passera (simulation locale)
npm run lint
npm run type-check
npm run format:check
npm run test:ci
```

### 3. Avant de commit

```bash
# Formatter le code
npm run format

# Vérifier que tout passe (comme en CI)
npm run lint
npm run type-check
npm run test

# Commit (Husky + lint-staged vérifient automatiquement)
git add .
git commit -m "feat: ajouter fonction de recherche"
```

### 4. Validation automatique CI/CD

Après chaque push, la **GitHub Actions CI** vérifie automatiquement :

- ✅ **Linting** : ESLint avec zéro warning
- ✅ **Formatting** : Prettier check
- ✅ **Security** : npm audit high/critical
- ✅ **Types** : TypeScript strict validation
- ✅ **Tests** : Jest avec coverage sur Node.js 18 & 20
- ✅ **Build** : Next.js production build

**❌ La PR sera bloquée** si l'une de ces étapes échoue.

## 📝 Conventions de commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Format
<type>[optional scope]: <description>

# Types principaux
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatage (pas de changement de code)
refactor: # Refactoring sans changement de fonctionnalité
test:     # Ajout ou modification de tests
chore:    # Maintenance (dépendances, config, etc.)

# Exemples
feat(auth): ajouter connexion Google
fix(posts): corriger pagination infinie
docs: mettre à jour guide d'installation
refactor(components): extraire logique commune
test(utils): ajouter tests pour formatDate
chore: mettre à jour dépendances
```

## 🧩 Comment ajouter...

### Une nouvelle page

```bash
# 1. Créer le dossier dans app/
mkdir src/app/ma-nouvelle-page

# 2. Créer page.tsx
cat > src/app/ma-nouvelle-page/page.tsx << 'EOF'
export default function MaNouvellePagePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Ma Nouvelle Page</h1>
      <p>Contenu de la page...</p>
    </div>
  )
}
EOF

# 3. Optionnel : Ajouter un layout spécifique
cat > src/app/ma-nouvelle-page/layout.tsx << 'EOF'
export default function MaNouvellePageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="special-layout">
      {children}
    </div>
  )
}
EOF
```

### Un nouveau composant UI

```bash
# 1. Créer le composant
cat > src/components/ui/mon-composant.tsx << 'EOF'
import { forwardRef } from 'react'
import { cn } from '@/utils'

interface MonComposantProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const MonComposant = forwardRef<HTMLDivElement, MonComposantProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles',
          {
            'variant-primary': variant === 'primary',
            'variant-secondary': variant === 'secondary',
            'size-sm': size === 'sm',
            'size-md': size === 'md',
            'size-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

MonComposant.displayName = 'MonComposant'

export default MonComposant
EOF

# 2. L'exporter dans le barrel export
echo "export { default as MonComposant } from './mon-composant'" >> src/components/ui/index.ts

# 3. Créer un test
cat > src/components/ui/__tests__/mon-composant.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react'
import MonComposant from '../mon-composant'

describe('MonComposant', () => {
  it('renders correctly', () => {
    render(<MonComposant>Test content</MonComposant>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies correct variant class', () => {
    render(<MonComposant variant="secondary">Test</MonComposant>)
    const element = screen.getByText('Test')
    expect(element).toHaveClass('variant-secondary')
  })
})
EOF
```

### Une nouvelle API route

```bash
# 1. Créer le dossier
mkdir -p src/app/api/mon-endpoint

# 2. Créer route.ts
cat > src/app/api/mon-endpoint/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schéma de validation
const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function GET(request: NextRequest) {
  try {
    // Logique de récupération
    const data = await fetchData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    // Logique de création
    const result = await createData(validatedData)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
EOF
```

### Un nouveau hook personnalisé

```bash
# 1. Créer le hook
cat > src/hooks/use-mon-hook.ts << 'EOF'
import { useState, useCallback } from 'react'

interface UseMonHookReturn {
  value: string
  setValue: (value: string) => void
  reset: () => void
  isModified: boolean
}

export function useMonHook(initialValue = ''): UseMonHookReturn {
  const [value, setValue] = useState(initialValue)
  const [isModified, setIsModified] = useState(false)

  const handleSetValue = useCallback((newValue: string) => {
    setValue(newValue)
    setIsModified(newValue !== initialValue)
  }, [initialValue])

  const reset = useCallback(() => {
    setValue(initialValue)
    setIsModified(false)
  }, [initialValue])

  return {
    value,
    setValue: handleSetValue,
    reset,
    isModified,
  }
}
EOF

# 2. L'exporter
echo "export { useMonHook } from './use-mon-hook'" >> src/hooks/index.ts

# 3. Créer un test
cat > src/hooks/__tests__/use-mon-hook.test.ts << 'EOF'
import { renderHook, act } from '@testing-library/react'
import { useMonHook } from '../use-mon-hook'

describe('useMonHook', () => {
  it('initializes with correct value', () => {
    const { result } = renderHook(() => useMonHook('initial'))
    expect(result.current.value).toBe('initial')
    expect(result.current.isModified).toBe(false)
  })

  it('updates value correctly', () => {
    const { result } = renderHook(() => useMonHook('initial'))

    act(() => {
      result.current.setValue('new value')
    })

    expect(result.current.value).toBe('new value')
    expect(result.current.isModified).toBe(true)
  })
})
EOF
```

## 🧪 Tests

### Stratégie de tests

- **Unit tests** : Fonctions utilitaires, hooks
- **Component tests** : Composants UI
- **Integration tests** : Formulaires, workflows
- **E2E tests** : Parcours utilisateur critiques

### Lancer les tests

```bash
# Tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec coverage
npm run test:ci

# Tests d'un fichier spécifique
npm test -- button.test.tsx
```

### Écrire de bons tests

```typescript
// ✅ Bon test : teste le comportement, pas l'implémentation
it('displays error message when form is invalid', async () => {
  render(<LoginForm />)

  const submitButton = screen.getByRole('button', { name: /login/i })
  await user.click(submitButton)

  expect(screen.getByText(/email is required/i)).toBeInTheDocument()
})

// ❌ Mauvais test : teste l'implémentation
it('calls useState when component mounts', () => {
  const useStateSpy = jest.spyOn(React, 'useState')
  render(<LoginForm />)
  expect(useStateSpy).toHaveBeenCalled()
})
```

## 🐛 Debugging

### Outils disponibles

```bash
# React Query Devtools
# Accessible en dev sur localhost:3000

# Prisma Studio (pour la DB)
npm run db:studio

# Next.js Debug
DEBUG=* npm run dev

# TypeScript Check
npm run type-check
```

### Logs utiles

```typescript
// Dans les composants
console.log('Debug state:', { user, posts, isLoading })

// Dans les API routes
console.log('API Debug:', { method: request.method, body })

// Avec l'extension React DevTools
// Inspecter les props et state directement
```

## 📋 Checklist avant Pull Request

### ✅ Code

- [ ] Le code suit les conventions du projet
- [ ] Pas de `console.log` ou `debugger` oubliés
- [ ] Types TypeScript corrects
- [ ] Imports organisés et optimisés

### ✅ Tests

- [ ] Tests ajoutés pour les nouvelles fonctionnalités
- [ ] Tous les tests passent (`npm run test`)
- [ ] Coverage maintenu ou amélioré

### ✅ Qualité

- [ ] Linting passe (`npm run lint`)
- [ ] Formatage correct (`npm run format`)
- [ ] Type checking OK (`npm run type-check`)
- [ ] Build réussit (`npm run build`)

### ✅ Documentation

- [ ] README mis à jour si nécessaire
- [ ] Commentaires JSDoc pour fonctions complexes
- [ ] Types documentés

### ✅ Performance

- [ ] Pas de re-renders inutiles
- [ ] Images optimisées
- [ ] Imports lazy si approprié

## 🚀 Soumettre sa Pull Request

### 1. Préparation

```bash
# Mettre à jour avec main
git checkout main
git pull upstream main
git checkout ma-branche
git rebase main

# Push vers votre fork
git push origin ma-branche
```

### 2. Créer la PR

- **Titre** : Descriptif et concis
- **Description** : Expliquer le pourquoi et le comment
- **Screenshots** : Pour les changements UI
- **Tests** : Mentionner la stratégie de test
- **Breaking changes** : Bien les documenter

### 3. Template de PR

```markdown
## Description

Brève description de ce qui a été changé et pourquoi.

## Type de changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests

- [ ] Tests ajoutés/mis à jour
- [ ] Tous les tests passent
- [ ] Tests manuels effectués

## Screenshots (si applicable)

![Avant](url) ![Après](url)

## Checklist

- [ ] Code review personnel effectué
- [ ] Auto-assigné des reviewers
- [ ] Labels appropriés ajoutés
```

## 🎉 Après votre première contribution

1. **Vous êtes ajouté** à la liste des contributeurs
2. **Rejoignez** notre Discord/Slack pour discussions
3. **Choisissez** des tâches plus complexes
4. **Partagez** vos idées d'amélioration

## 📚 Ressources d'apprentissage

### Si vous êtes nouveau avec...

**Next.js :**

- [Documentation officielle](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

**TypeScript :**

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript avec React](https://react-typescript-cheatsheet.netlify.app/)

**Tailwind CSS :**

- [Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/) (composants payants)

**Prisma :**

- [Getting Started](https://www.prisma.io/docs/getting-started)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

**React Query :**

- [Documentation](https://tanstack.com/query/latest)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)

## 💬 Obtenir de l'aide

- **Issues GitHub** : Pour bugs et feature requests
- **Discussions GitHub** : Pour questions générales
- **Discord/Slack** : Pour aide en temps réel
- **Code review** : N'hésitez pas à demander des explications

Merci pour votre contribution ! 🙏
