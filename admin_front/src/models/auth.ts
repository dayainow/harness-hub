// ===== Request Types =====

export interface LoginInRequest {
  loginId: string
  password: string
}


export interface TokenResponse {
  access_token: string
}


export interface Self {
  id: number,
  loginId: string
  name: string
  email: string
  createdAt:string
}
// ===== Storage Service =====

export class StorageService {

  static setTokens(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('access_token', token)
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('access_token')
  }
}
