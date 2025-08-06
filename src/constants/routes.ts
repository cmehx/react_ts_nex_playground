export const API_ROUTES = {
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    SIGNOUT: '/api/auth/signout',
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
  },
} as const

export const APP_ROUTES = {
  HOME: '/',
  POSTS: '/posts',
  POST_DETAIL: (slug: string) => `/posts/${slug}`,
  CATEGORIES: '/categories',
  CATEGORY: (slug: string) => `/categories/${slug}`,
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  WRITE: '/write',
  EDIT_POST: (id: string) => `/write/${id}`,
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  POST_TITLE_MAX_LENGTH: 200,
  POST_EXCERPT_MAX_LENGTH: 300,
} as const
