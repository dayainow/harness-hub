/**
 * API 경로 상수
 * 환경별 API 경로 변경이 필요한 경우 이 파일에서 관리
 */

// Base Prefixes
export const API_PREFIX = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  MARKET: '/market',
  PROMPTS: '/prompts',
  POSTS: '/posts',
  USER: '/users',
  CATEGORY: '/categories',
} as const

// Auth API
export const AUTH_API = {
  LOGIN: `${API_PREFIX.AUTH}/sign-in`,
  SELF: `/self`,
} as const

// Products API
export const TOOLS_API = {
  PREFIX: API_PREFIX.PRODUCTS,
  ID: (id: string) => `${API_PREFIX.PRODUCTS}/${id}`,
} as const

// Market API
export const LABS_API = {
  PREFIX: API_PREFIX.MARKET,
  ID: (id: string) => `${API_PREFIX.MARKET}/${id}`,
} as const

// Prompts API
export const PROMPTS_API = {
  PREFIX: API_PREFIX.PROMPTS,
  ID: (id: string) => `${API_PREFIX.PROMPTS}/${id}`,
} as const

// Posts API
export const POSTS_API = {
  PREFIX: API_PREFIX.POSTS,
  ID: (id: string) => `${API_PREFIX.POSTS}/${id}`,
} as const

// User API
export const USER_API = {
  PREFIX: API_PREFIX.USER,
  ID: (id: string) => `${API_PREFIX.USER}/${id}`,
} as const

// Category API
export const CATEGORY_API = {
  PREFIX: API_PREFIX.CATEGORY,
  ID: (id: string) => `${API_PREFIX.CATEGORY}/${id}`,
} as const

