// Types pour les entités principales
export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  published: boolean
  featuredImage?: string
  authorId: string
  author: User
  categories: Category[]
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  posts: Post[]
}

export interface Tag {
  id: string
  name: string
  slug: string
  posts: Post[]
}

// Types pour les formulaires
export interface CreatePostData {
  title: string
  content: string
  excerpt: string
  published: boolean
  categoryIds: string[]
  tags: string[]
  featuredImage?: string
}

export interface UpdateUserData {
  name?: string
  bio?: string
  avatar?: string
}

// Types pour les API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types pour les filtres et recherche
export interface PostFilters {
  category?: string
  tag?: string
  author?: string
  published?: boolean
  search?: string
}

export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  sort?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title'
  order?: 'asc' | 'desc'
}
