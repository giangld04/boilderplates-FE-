import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { useAuthStore } from '@/stores/auth-store'

import type { SignInValues } from '../schemas/auth-schema'
import { authApi } from '../services/auth-api'

export function useSignIn() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SignInValues) => authApi.login(data),
    onSuccess: async (data) => {
      login(data.user, data.accessToken, data.refreshToken)
      // Invalidate router so _authenticated.beforeLoad re-evaluates with new auth state
      await router.invalidate()
      navigate({ to: '/dashboard' })
    },
  })
}

export function useSignOut() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: async () => {
      logout()
      qc.clear()
      await router.invalidate()
      navigate({ to: '/sign-in' })
    },
  })
}

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  })
}
