import apiClient from '@/lib/api-client'

import type { SignInValues } from '../schemas/auth-schema'

interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    roles: string[]
    permissions: string[]
  }
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: (data: SignInValues) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  logout: () => apiClient.post('/auth/logout'),

  me: () =>
    apiClient.get<LoginResponse['user']>('/auth/me').then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<{ accessToken: string }>('/auth/refresh', { refreshToken })
      .then((r) => r.data),
}
