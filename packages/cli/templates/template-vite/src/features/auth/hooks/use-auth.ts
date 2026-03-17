import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useAuthStore } from '@/stores/auth-store'

import type { SignInValues } from '../schemas/auth-schema'
import { authApi } from '../services/auth-api'

export function useSignIn() {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: SignInValues) => authApi.login(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken)
      navigate({ to: '/dashboard' })
    },
  })
}

export function useSignOut() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout()
      qc.clear()
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
