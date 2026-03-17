import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string
  email: string
  name: string
  roles: string[]
  permissions: string[]
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  isTokenExpired: () => boolean
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      isTokenExpired: () => {
        const { accessToken } = get()
        if (!accessToken) return true
        try {
          const { exp } = jwtDecode<{ exp: number }>(accessToken)
          // Consider expired 30 seconds before actual expiry
          return Date.now() >= (exp - 30) * 1000
        } catch {
          return true
        }
      },

      hasRole: (role) => get().user?.roles.includes(role) ?? false,
      hasPermission: (permission) => get().user?.permissions.includes(permission) ?? false,
    }),
    { name: 'auth-storage' }
  )
)
