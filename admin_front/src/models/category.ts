// Category entity type
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Category create/update request type
export interface CategoryRequest {
  name: string
  slug: string
  description?: string
  parentId?: number
  order: number
  isActive: boolean
}
