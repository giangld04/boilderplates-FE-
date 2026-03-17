import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface AuthUser {
  id: string
  email: string
  name: string
  roles: string[]
  permissions: string[]
}

interface JwtPayload {
  exp: number
  sub: string
  roles?: string[]
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null

  // Actions
  setUser: (user: AuthUser) => void
  setTokens: (access: string, refresh: string) => void
  login: (user: AuthUser, access: string, refresh: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateProfile: (partial: Partial<AuthUser>) => void

  // Computed
  isTokenExpired: () => boolean
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
      updateProfile: (partial) =>
        set((state) => ({ user: state.user ? { ...state.user, ...partial } : null })),

      isTokenExpired: () => {
        const { accessToken } = get()
        if (!accessToken) return true
        try {
          const { exp } = jwtDecode<JwtPayload>(accessToken)
          return Date.now() >= exp * 1000 - 60_000 // 60s buffer
        } catch {
          return true
        }
      },
      hasRole: (role) => get().user?.roles.includes(role) ?? false,
      hasPermission: (perm) => get().user?.permissions.includes(perm) ?? false,
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
