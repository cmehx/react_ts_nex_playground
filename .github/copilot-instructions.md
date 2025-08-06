# Copilot Instructions for Modern Blog Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern, professional blog application built with Next.js 14+ and TypeScript.

## Tech Stack
- **Frontend**: Next.js 14+ with TypeScript, App Router, SSR/SSG
- **UI Library**: Chakra UI with light/dark theme support
- **Authentication**: NextAuth.js with email/password
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest + React Testing Library
- **Styling**: Chakra UI + Emotion
- **Code Quality**: ESLint, Prettier, Husky
- **Containerization**: Docker

## Architecture Patterns
- Use App Router file-based routing
- Implement proper TypeScript interfaces for all data structures
- Follow component-based architecture with reusable UI components
- Use React Query for server state management
- Implement proper error boundaries and loading states
- Use Zod schemas for form validation and API request/response validation

## Coding Standards
- Use TypeScript strict mode
- Follow React best practices (hooks, functional components)
- Implement proper error handling with try/catch blocks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused on single responsibility
- Use proper file organization with barrel exports

## Database Patterns
- Use Prisma schema for database models
- Implement proper relations between User and Post models
- Use database transactions for complex operations
- Implement proper indexes for performance
- Use Prisma migrations for schema changes

## API Design
- Follow RESTful API conventions
- Use proper HTTP status codes
- Implement request/response validation with Zod
- Add proper error handling middleware
- Use NextAuth.js for protected routes
- Implement rate limiting for production

## Security Best Practices
- Validate all inputs on both client and server
- Use environment variables for sensitive data
- Implement CSRF protection
- Sanitize user inputs
- Use secure password hashing with bcryptjs

## Performance Optimization
- Use Next.js Image component for optimized images
- Implement proper caching strategies
- Use React.memo for expensive components
- Implement lazy loading for non-critical components
- Use proper bundle splitting
