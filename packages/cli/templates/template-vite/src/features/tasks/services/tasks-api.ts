import apiClient from '@/lib/api-client'
import type { PaginatedResponse } from '@/types'
import type { Task } from '../types/task'

export interface TaskListParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  priority?: string
}

export type CreateTaskPayload = Omit<Task, 'id' | 'createdAt'>
export type UpdateTaskPayload = Partial<CreateTaskPayload>

/** Raw API calls for the tasks resource — always use hooks (use-tasks.ts) in components */
export const tasksApi = {
  list: (params?: TaskListParams): Promise<PaginatedResponse<Task>> =>
    apiClient.get('/tasks', { params }).then((r) => r.data),

  getById: (id: string): Promise<Task> =>
    apiClient.get(`/tasks/${id}`).then((r) => r.data),

  create: (data: CreateTaskPayload): Promise<Task> =>
    apiClient.post('/tasks', data).then((r) => r.data),

  update: (id: string, data: UpdateTaskPayload): Promise<Task> =>
    apiClient.put(`/tasks/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/tasks/${id}`).then((r) => r.data),
}
