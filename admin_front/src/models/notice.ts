// Notice entity type
export interface Notice {
  id: number
  title: string
  content: string
  author: string
  isPublished: boolean
  isPinned: boolean
  attachments?: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
}

// Notice create/update request type
export interface NoticeRequest {
  title: string
  content: string
  author: string
  isPublished: boolean
  isPinned: boolean
  attachments?: string[]
}
