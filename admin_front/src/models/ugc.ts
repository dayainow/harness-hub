export interface Author {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Prompt {
  id: string;
  title: string;
  toolName: string;
  category: string;
  content: string;
  authorId: string;
  author?: Author;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  authorId: string;
  author?: Author;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  content?: string;
  difficulty?: string;
  emoji?: string;
  thumbnailUrl?: string;
  metric: string;
  authorId: string;
  author?: Author;
  likes: number;
  category: string;
  stack: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUgcParams {
  category?: string;
  userEmail?: string;
  page?: string | number;
  limit?: string | number;
}
