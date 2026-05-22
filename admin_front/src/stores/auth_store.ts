import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiService } from "@/lib/api"
import {AUTH_API} from "@/constants/api-paths"
import {
  LoginInRequest,
  TokenResponse,
  StorageService, Self
} from "@/models/auth"

// ===== Auth State Interface =====
interface AuthState {
  admin: Self | null
  tokens: TokenResponse | null
  loading: boolean
  error: string | null

  // Actions
  logIn: (user: LoginInRequest) => Promise<{ success: boolean; tokens?: TokenResponse }>
  logOut: () => Promise<{ success: boolean }>
  getSelf: () => Promise<{ data: Self }>
  setAdmin: (admin: Self) => void
  clearError: () => void
}

// ===== Zustand Store =====
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      admin: null,
      tokens: null,
      loading: false,
      error: null,

      // Login
      logIn: async (user: LoginInRequest) => {
        set({ loading: true, error: null })
        try {
          // Mock authentication for testing without backend
          const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

          if (useMockAuth) {
            // Mock credentials
            const MOCK_CREDENTIALS = {
              loginId: 'admin',
              password: 'admin123'
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Validate mock credentials
            if (user.loginId === MOCK_CREDENTIALS.loginId && user.password === MOCK_CREDENTIALS.password) {
              const mockTokens = {
                access_token: 'ola_admin_secret_2026',
              }

              const mockAdmin: Self = {
                id: 1,
                loginId: 'admin',
                name: 'Admin User',
                email: 'admin@example.com',
                createdAt: new Date().toISOString(),
              }

              // Save mock tokens
              StorageService.setTokens(mockTokens.access_token)
              get().setAdmin(mockAdmin)
              set({ loading: false })

              return { success: true, tokens: mockTokens }
            } else {
              set({ loading: false, error: 'Invalid credentials' })
              return { success: false }
            }
          }

          const data = {
            ...user,
          }

          const response = await apiService.post<{
            data: any;
            accessToken: string}>(AUTH_API.LOGIN, data)
          if (response.status === 200) {
            const tokens = {
              access_token: response.data.data.accessToken,
            }
            // Save tokens
            StorageService.setTokens(tokens.access_token)

            // Call getSelf to fetch admin information
            try {
              const selfResult = await get().getSelf()
              get().setAdmin(selfResult.data)
              set({ loading: false })
              return { success: true, tokens }
            } catch (error) {
              console.error('getSelf failed:', error)
              set({ loading: false })
              return { success: false }
            }
          }

          set({ loading: false, error: 'Login failed' })

          return { success: false }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Login API error'
          set({ loading: false, error: errorMsg })

          return { success: false }
        }
      },

      // Logout
      logOut: async () => {
        try {
          StorageService.clearTokens()
          set({
            admin: null,
            tokens: null,
            error: null
          })
          return { success: true }
        } catch (error) {
          console.error('signOut error:', error)
          return { success: false }
        }
      },

      // Fetch current admin profile
      getSelf: async () => {
        set({ loading: true, error: null })
        const apiCall = () => apiService.get<{ data: Self }>(
          AUTH_API.SELF
        )

        const result = await apiService.callWithErrorHandling<{data:Self}>(
          apiCall, 'Failed to fetch profile.'
        );

        set({ loading: false });

        if (result.success && result.response) {
          const adminData = result.response.data.data;
          return { data: adminData };
        }
        else {
          const displayMessage = result.finalMessage || 'Failed to fetch profile';
          set({ error: displayMessage });
          throw new Error(displayMessage);
        }
      },


      // Set admin information
      setAdmin: (admin) => set({ admin }),

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        admin: state.admin,
        tokens: state.tokens,
      }),
    }
  )
)
