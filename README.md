# Modern Blog Platform

A modern, professional blog platform built with Next.js 14+, TypeScript, Chakra UI, and Prisma. Features include user authentication, content management, admin dashboard, and responsive design with dark/light theme support.

## 🚀 Features

- **Modern Stack**: Next.js 14+ with App Router, TypeScript, and Server Components
- **Beautiful UI**: Chakra UI with built-in dark/light theme support
- **Authentication**: NextAuth.js with email/password authentication
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Content Management**: Rich text editor, categories, tags, and comments
- **Admin Dashboard**: User and content management interface
- **Performance**: SSG/SSR, image optimization, and caching strategies
- **Testing**: Jest and React Testing Library setup
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks
- **CI/CD**: GitHub Actions workflow for automated testing and deployment
- **Containerization**: Docker support for development and production

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (local installation or cloud service)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment example file and configure your variables:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

### 4. Database Setup

#### Option A: Using Prisma's Local Database (Recommended for Development)

```bash
# Start Prisma's local PostgreSQL server
npx prisma dev

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

#### Option B: Using Your Own PostgreSQL Database

1. Create a PostgreSQL database named `blog_db`
2. Update the `DATABASE_URL` in your `.env` file
3. Run migrations and seed:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📧 Test Accounts

After seeding the database, you can use these test accounts:

- **Admin**: admin@blog.com / admin123456
- **User**: user@blog.com / user123456

## 🐳 Docker Setup

### Development with Docker

```bash
# Start all services (app, database, redis)
npm run docker:dev
```

### Production with Docker

```bash
# Build and start production services
npm run docker:prod
```

## 🗄️ Database Management

### Common Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Create and run a new migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Reset database (development only)
npm run db:reset

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

## 📁 Project Structure

```
blog/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── copilot-instructions.md
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── posts/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── posts/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── theme.ts
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── auth.ts
│   │   └── prisma.ts
│   ├── types/
│   └── utils/
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── jest.config.ts
├── jest.setup.js
├── next.config.ts
├── package.json
├── .prettierrc
├── README.md
└── tsconfig.json
```

## 🚀 Development Workflow

### Code Quality

The project includes several tools to maintain code quality:

- **ESLint**: Linting for JavaScript/TypeScript
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript**: Type checking

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format

# Type checking
npm run type-check
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Required |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

### Customization

- **Theme**: Modify `src/app/theme.ts` for UI customization
- **Database Schema**: Update `prisma/schema.prisma` for data model changes
- **Authentication**: Configure providers in `src/lib/auth.ts`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out

### Posts Endpoints

- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create a new post
- `GET /api/posts/[id]` - Get a specific post
- `PUT /api/posts/[id]` - Update a post
- `DELETE /api/posts/[id]` - Delete a post

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check your `DATABASE_URL` in `.env`
   - Run `npm run db:generate` after schema changes

2. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

3. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

## 🚀 Future Enhancements

- [ ] Email notifications
- [ ] Social media authentication
- [ ] Advanced search functionality
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Comment moderation
- [ ] File upload functionality
- [ ] SEO optimizations
- [ ] RSS feed
- [ ] Newsletter integration

---

**Happy coding!** 🎉

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
