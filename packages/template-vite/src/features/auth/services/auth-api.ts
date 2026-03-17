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

/** Build a minimal JWT (not server-verified) for the demo account */
function makeDemoToken(): string {
  const b64 = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const header = b64({ alg: 'HS256', typ: 'JWT' })
  const payload = b64({ sub: 'demo', roles: ['admin'], permissions: ['*'], exp: 9999999999 })
  return `${header}.${payload}.demo`
}

const DEMO_RESPONSE: LoginResponse = {
  user: { id: 'demo', email: 'demo', name: 'Demo User', roles: ['admin'], permissions: ['*'] },
  accessToken: makeDemoToken(),
  refreshToken: 'demo-refresh',
}

export const authApi = {
  login: (data: SignInValues): Promise<LoginResponse> => {
    // Demo account — works without a real backend
    if (data.email === 'demo' && data.password === 'demo') {
      return Promise.resolve(DEMO_RESPONSE)
    }
    return apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data)
  },

  logout: () => apiClient.post('/auth/logout'),

  me: () => apiClient.get<LoginResponse['user']>('/auth/me').then((r) => r.data),
}
