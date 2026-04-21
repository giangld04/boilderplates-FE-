import apiClient from '@/lib/api-client'
import type { PaginatedResponse } from '@/types'
import type { User } from '../types/user'

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

export type CreateUserPayload = Omit<User, 'id' | 'createdAt'>
export type UpdateUserPayload = Partial<CreateUserPayload>

/** Raw API calls for the users resource — always use hooks (use-users.ts) in components */
export const usersApi = {
  list: (params?: UserListParams): Promise<PaginatedResponse<User>> =>
    apiClient.get('/users', { params }).then((r) => r.data),

  getById: (id: string): Promise<User> =>
    apiClient.get(`/users/${id}`).then((r) => r.data),

  create: (data: CreateUserPayload): Promise<User> =>
    apiClient.post('/users', data).then((r) => r.data),

  update: (id: string, data: UpdateUserPayload): Promise<User> =>
    apiClient.put(`/users/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/users/${id}`).then((r) => r.data),
}
