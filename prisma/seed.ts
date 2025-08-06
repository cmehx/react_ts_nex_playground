import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'development' },
      update: {},
      create: {
        name: 'Development',
        slug: 'development',
        description: 'Programming and software development articles',
        color: '#10B981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design and frontend development',
        color: '#F59E0B',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology trends and news',
        color: '#3B82F6',
      },
    }),
  ])

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        color: '#000000',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        color: '#61DAFB',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
        color: '#3178C6',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: {
        name: 'Prisma',
        slug: 'prisma',
        color: '#2D3748',
      },
    }),
  ])

  // Create admin user
  const hashedPassword = await hash('admin123456', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      name: 'Blog Admin',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'Administrator of the Modern Blog platform.',
    },
  })

  // Create regular user
  const userPassword = await hash('user123456', 12)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@blog.com' },
    update: {},
    create: {
      email: 'user@blog.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
      bio: 'Passionate developer and tech enthusiast.',
    },
  })

  // Create sample posts
  const posts = [
    {
      title: 'Getting Started with Next.js 14 and TypeScript',
      slug: 'getting-started-nextjs-14-typescript',
      content: `# Getting Started with Next.js 14 and TypeScript

Next.js 14 introduces many exciting features that make building React applications even more powerful and developer-friendly. In this comprehensive guide, we'll walk through setting up a new Next.js project with TypeScript and explore the latest features.

## Why Next.js 14?

Next.js 14 brings several improvements:
- Enhanced App Router with better performance
- Improved TypeScript support
- Better developer experience with Turbopack
- New caching strategies
- Server Actions stability

## Setting Up Your Project

First, let's create a new Next.js project with TypeScript:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
\`\`\`

This command creates a new project with:
- TypeScript configuration
- Tailwind CSS for styling
- ESLint for code quality
- App Router (the new routing system)
- Source directory structure

## Project Structure

Your project will have the following structure:

\`\`\`
my-app/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
├── public/
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## TypeScript Configuration

Next.js 14 comes with excellent TypeScript support out of the box. The generated \`tsconfig.json\` includes optimal settings for Next.js development.

## Conclusion

Next.js 14 with TypeScript provides a robust foundation for building modern web applications. The combination of static generation, server-side rendering, and excellent developer experience makes it an excellent choice for your next project.`,
      excerpt: 'Learn how to build modern web applications with the latest Next.js features and TypeScript integration.',
      published: true,
      featured: true,
      authorId: adminUser.id,
      categoryIds: [categories[0].id],
      tagIds: [tags[0].id, tags[2].id],
    },
    {
      title: 'Building Scalable React Applications',
      slug: 'building-scalable-react-applications',
      content: `# Building Scalable React Applications

As your React application grows, maintaining code quality and performance becomes increasingly challenging. This guide covers best practices for building scalable React applications that can grow with your team and user base.

## Component Architecture

### 1. Component Composition

Instead of building large, monolithic components, break them down into smaller, reusable pieces:

\`\`\`tsx
// ❌ Large, monolithic component
function UserProfile({ user, posts, followers }) {
  return (
    <div>
      {/* Hundreds of lines of JSX */}
    </div>
  )
}

// ✅ Composed of smaller components
function UserProfile({ user }) {
  return (
    <div>
      <UserHeader user={user} />
      <UserPosts userId={user.id} />
      <UserFollowers userId={user.id} />
    </div>
  )
}
\`\`\`

### 2. Custom Hooks

Extract complex logic into custom hooks:

\`\`\`tsx
// Custom hook for API calls
function useUser(userId: string) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  return { user, loading, error }
}
\`\`\`

## State Management

For large applications, consider using:
- **React Query/TanStack Query** for server state
- **Zustand** or **Redux Toolkit** for client state
- **Context API** for shared UI state

## Performance Optimization

1. **Code Splitting**: Use dynamic imports
2. **Memoization**: React.memo, useMemo, useCallback
3. **Lazy Loading**: Lazy load components and images
4. **Bundle Analysis**: Analyze and optimize your bundle

## Conclusion

Building scalable React applications requires careful planning and adherence to best practices. Focus on component composition, proper state management, and performance optimization to create applications that can grow with your needs.`,
      excerpt: 'Best practices for structuring and scaling React applications for production environments.',
      published: true,
      featured: false,
      authorId: regularUser.id,
      categoryIds: [categories[0].id],
      tagIds: [tags[1].id],
    },
    {
      title: 'Database Design Patterns with Prisma',
      slug: 'database-design-patterns-prisma',
      content: `# Database Design Patterns with Prisma

Prisma is a modern database toolkit that makes database access easy with an auto-generated and type-safe query builder. In this article, we'll explore common database design patterns and how to implement them effectively with Prisma.

## Introduction to Prisma

Prisma provides:
- Type-safe database client
- Declarative data modeling
- Database migrations
- Powerful query engine
- Real-time subscriptions

## Common Design Patterns

### 1. One-to-Many Relationships

\`\`\`prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  title    String
  content  String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
\`\`\`

### 2. Many-to-Many Relationships

\`\`\`prisma
model Post {
  id         String     @id @default(cuid())
  title      String
  categories PostCategory[]
}

model Category {
  id    String @id @default(cuid())
  name  String
  posts PostCategory[]
}

model PostCategory {
  id         String   @id @default(cuid())
  postId     String
  categoryId String
  post       Post     @relation(fields: [postId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])

  @@unique([postId, categoryId])
}
\`\`\`

### 3. Self-Referencing Relationships

\`\`\`prisma
model Comment {
  id       String    @id @default(cuid())
  content  String
  parentId String?
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies  Comment[] @relation("CommentReplies")
}
\`\`\`

## Advanced Patterns

### Soft Deletes

\`\`\`prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  deletedAt DateTime?
}
\`\`\`

### Audit Trail

\`\`\`prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  version   Int      @default(1)
}
\`\`\`

## Best Practices

1. **Use appropriate indexes** for query performance
2. **Implement proper constraints** for data integrity
3. **Design for scalability** from the beginning
4. **Use migrations** for schema changes
5. **Implement proper error handling**

## Conclusion

Prisma makes it easy to implement complex database patterns while maintaining type safety and performance. By following these patterns and best practices, you can build robust and scalable database schemas for your applications.`,
      excerpt: 'Explore advanced database design patterns and how to implement them using Prisma ORM.',
      published: true,
      featured: true,
      authorId: adminUser.id,
      categoryIds: [categories[0].id],
      tagIds: [tags[3].id, tags[2].id],
    },
  ]

  for (const postData of posts) {
    const { categoryIds, tagIds, ...post } = postData
    
    // Calculate reading time
    const wordsPerMinute = 200
    const wordCount = post.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        readingTime,
        publishedAt: new Date(),
        categories: {
          create: categoryIds.map(categoryId => ({
            categoryId,
          })),
        },
        tags: {
          create: tagIds.map(tagId => ({
            tagId,
          })),
        },
      },
    })
  }

  console.log('✅ Database seeding completed!')
  console.log('\n📧 Test accounts:')
  console.log('Admin: admin@blog.com / admin123456')
  console.log('User: user@blog.com / user123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
