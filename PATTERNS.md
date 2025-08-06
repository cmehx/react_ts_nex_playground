# 🧩 Patterns et Bonnes Pratiques

Ce guide explique les patterns et conventions utilisés dans le projet pour maintenir un code cohérent et maintenable.

## 🏗️ Patterns d'Architecture

### 1. Barrel Exports Pattern
**Problème** : Imports longs et difficiles à maintenir
**Solution** : Centraliser les exports dans des fichiers `index.ts`

```typescript
// ❌ Sans barrel exports
import Button from '../../../components/ui/button'
import Card from '../../../components/ui/card'
import Modal from '../../../components/ui/modal'

// ✅ Avec barrel exports
import { Button, Card, Modal } from '@/components'
```

**Implementation :**
```typescript
// src/components/ui/index.ts
export { default as Button } from './button'
export { default as Card } from './card'
export { default as Modal } from './modal'

// src/components/index.ts
export * from './ui'
export { default as Header } from './layout/Header'
export { default as Footer } from './layout/Footer'
```

### 2. Compound Components Pattern
**Problème** : Composants monolithiques difficiles à personnaliser
**Solution** : Composants modulaires avec API flexible

```typescript
// ✅ Compound Components
<Card>
  <Card.Header>
    <Card.Title>Titre de l'article</Card.Title>
    <Card.Subtitle>Publié le 6 août 2025</Card.Subtitle>
  </Card.Header>
  <Card.Content>
    Contenu de l'article...
  </Card.Content>
  <Card.Footer>
    <Button>Lire plus</Button>
  </Card.Footer>
</Card>
```

**Implementation :**
```typescript
// card.tsx
const Card = ({ children, className, ...props }) => (
  <div className={cn("card-base", className)} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("card-header", className)} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className, ...props }) => (
  <div className={cn("card-content", className)} {...props}>
    {children}
  </div>
)

// Composition
Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
```

### 3. Variants Pattern avec CVA
**Problème** : CSS conditionnel complexe et répétitif
**Solution** : Système de variants type-safe

```typescript
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Classes de base
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export default function Button({ 
  variant, 
  size, 
  className, 
  isLoading,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading}
      {...props}
    />
  )
}
```

## 🎯 Patterns de Composants

### 1. Controlled vs Uncontrolled Components
**Règle** : Préférer les composants controllés pour la cohérence

```typescript
// ✅ Composant controllé
interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function Input({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-base"
    />
  )
}

// Usage
function MyForm() {
  const [email, setEmail] = useState('')
  
  return (
    <Input 
      value={email}
      onChange={setEmail}
      placeholder="Email"
    />
  )
}
```

### 2. Render Props Pattern
**Utilisé pour** : Logique réutilisable avec UI flexible

```typescript
interface DataFetcherProps<T> {
  url: string
  children: (state: {
    data: T | null
    loading: boolean
    error: string | null
  }) => React.ReactNode
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, isLoading, error } = useQuery({
    queryKey: [url],
    queryFn: () => fetch(url).then(res => res.json())
  })

  return children({
    data,
    loading: isLoading,
    error: error?.message || null
  })
}

// Usage
<DataFetcher<Post[]> url="/api/posts">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />
    if (error) return <ErrorMessage message={error} />
    return <PostsList posts={data || []} />
  }}
</DataFetcher>
```

### 3. Custom Hooks Pattern
**Objectif** : Extraire la logique métier des composants

```typescript
// usePost.ts
function usePost(postId: string) {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetch(`/api/posts/${postId}`).then(res => res.json()),
    enabled: !!postId
  })

  const updatePost = useMutation({
    mutationFn: (data: Partial<Post>) => 
      fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId])
    }
  })

  return {
    post,
    isLoading,
    error,
    updatePost: updatePost.mutate,
    isUpdating: updatePost.isPending
  }
}

// Usage dans un composant
function PostEditor({ postId }: { postId: string }) {
  const { post, isLoading, updatePost, isUpdating } = usePost(postId)
  
  if (isLoading) return <Skeleton />
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      updatePost({ title: 'Nouveau titre' })
    }}>
      {/* Formulaire */}
    </form>
  )
}
```

## 📁 Patterns d'Organisation

### 1. Feature-Based Structure (pour grandes apps)
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── posts/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── dashboard/
└── shared/
    ├── components/
    ├── utils/
    └── types/
```

### 2. Domain-Driven Structure
```typescript
// posts/
├── domain/
│   ├── entities/     # Post, Comment
│   ├── repositories/ # PostRepository
│   └── services/     # PostService
├── infrastructure/
│   ├── api/         # API calls
│   └── storage/     # Local storage
└── presentation/
    ├── components/  # UI components
    └── hooks/       # React hooks
```

## 🔄 Patterns de Gestion d'État

### 1. Server State vs Client State
**Règle** : Séparer clairement l'état serveur de l'état client

```typescript
// ✅ État serveur avec React Query
function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// ✅ État client avec useState/useReducer
function useUIState() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('all')
  
  return {
    isModalOpen,
    setIsModalOpen,
    selectedTab,
    setSelectedTab
  }
}
```

### 2. Context Pattern pour l'état global
```typescript
// ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## 🧪 Patterns de Tests

### 1. Test Utilities Pattern
```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(
  ui: React.ReactElement,
  { session = null, ...renderOptions }: CustomRenderOptions = {}
) {
  const queryClient = createTestQueryClient()
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    )
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Réexporter tout de testing-library
export * from '@testing-library/react'
```

### 2. Mock Patterns
```typescript
// __mocks__/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/posts', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', title: 'Test Post', content: 'Content' }
    ]))
  }),
  
  rest.post('/api/posts', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: '2' }))
  })
]

// setup-tests.ts
import { setupServer } from 'msw/node'
import { handlers } from './__mocks__/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## 🔒 Patterns de Sécurité

### 1. Input Validation Pattern
```typescript
import { z } from 'zod'

// Schémas de validation centralisés
export const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string().cuid()).optional()
})

export type CreatePostData = z.infer<typeof postSchema>

// Utilisation dans les API routes
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = postSchema.parse(body)
    
    // Traitement sécurisé
    const post = await createPost(validatedData)
    return NextResponse.json(post)
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
```

### 2. Authentication Guard Pattern
```typescript
// auth-guard.tsx
export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <LoadingSpinner />
  }
  
  if (!session) {
    return <LoginForm />
  }
  
  return <>{children}</>
}

// Usage
function ProtectedPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
```

## 📈 Patterns de Performance

### 1. Code Splitting Pattern
```typescript
// Lazy loading pour les pages
const Dashboard = lazy(() => import('./Dashboard'))
const PostEditor = lazy(() => import('./PostEditor'))

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/write" element={<PostEditor />} />
      </Routes>
    </Suspense>
  )
}
```

### 2. Memoization Pattern
```typescript
// Mémorisation des composants coûteux
const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data, 
  onUpdate 
}: {
  data: LargeDataSet
  onUpdate: (id: string) => void
}) {
  // Traitement coûteux
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item))
  }, [data])
  
  // Callback stable
  const handleUpdate = useCallback((id: string) => {
    onUpdate(id)
  }, [onUpdate])
  
  return <div>{/* Rendu */}</div>
})
```

Ces patterns garantissent un code maintenable, performant et sécurisé. Ils sont la base d'une architecture solide pour faire évoluer l'application ! 🚀
