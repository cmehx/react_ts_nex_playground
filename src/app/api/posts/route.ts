import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  coverImage: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
})

// GET /api/posts - Get all posts (with pagination and filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const categoryId = searchParams.get('categoryId')
    const authorId = searchParams.get('authorId')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (published !== undefined) where.published = published
    if (featured) where.featured = true
    if (authorId) where.authorId = authorId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (categoryId) {
      where.categories = {
        some: { categoryId },
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      published,
      featured,
      coverImage,
      categoryIds = [],
      tagIds = [],
    } = createPostSchema.parse(body)

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      )
    }

    // Calculate reading time (approximate)
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        featured,
        coverImage,
        readingTime,
        publishedAt: published ? new Date() : null,
        authorId: session.user.id,
        categories: {
          create: categoryIds.map((categoryId: string) => ({
            categoryId,
          })),
        },
        tags: {
          create: tagIds.map((tagId: string) => ({
            tagId,
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
