// User entity type
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

// User create/update request type
export interface UserRequest {
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  phone?: string
}
