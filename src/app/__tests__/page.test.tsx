import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import Home from '../page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}))

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <SessionProvider session={null}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}

describe('Home Page', () => {
  it('renders the homepage', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    // Check if the main heading is rendered
    expect(screen.getByText('Bienvenue sur')).toBeInTheDocument()
    expect(screen.getByText('Modern Blog')).toBeInTheDocument()

    // Check if the featured articles section is rendered
    expect(screen.getByText('Articles en vedette')).toBeInTheDocument()
  })

  it('shows sign in buttons when not authenticated', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(screen.getByText('Se connecter')).toBeInTheDocument()
    expect(screen.getByText('Créer un compte')).toBeInTheDocument()
  })
})
