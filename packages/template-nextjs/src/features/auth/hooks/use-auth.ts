'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/stores/auth-store'

import { authApi } from '../services/auth-api'
import type { SignInValues } from '../schemas/auth-schema'

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export function useSignIn() {
  const { login } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SignInValues) => authApi.login(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken)
      // Sync cookie for Next.js proxy auth check
      document.cookie = `auth-token=${data.accessToken}; path=/; max-age=${COOKIE_MAX_AGE}`
      router.push('/dashboard')
    },
  })
}

export function useSignOut() {
  const { logout } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout()
      document.cookie = 'auth-token=; path=/; max-age=0'
      qc.clear()
      router.push('/sign-in')
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
