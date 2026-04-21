import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tasksApi, type CreateTaskPayload, type UpdateTaskPayload, type TaskListParams } from '../services/tasks-api'

export const TASK_QUERY_KEY = 'tasks'

/** Fetch paginated task list */
export function useTasks(params?: TaskListParams) {
  return useQuery({
    queryKey: [TASK_QUERY_KEY, params],
    queryFn: () => tasksApi.list(params),
  })
}

/** Fetch single task by id */
export function useTask(id: string) {
  return useQuery({
    queryKey: [TASK_QUERY_KEY, id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  })
}

/** Create a new task */
export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskPayload) => tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY] })
      toast.success('Task created')
    },
    onError: () => toast.error('Failed to create task'),
  })
}

/** Update an existing task */
export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY] })
      toast.success('Task updated')
    },
    onError: () => toast.error('Failed to update task'),
  })
}

/** Delete a task by id */
export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY] })
      toast.success('Task deleted')
    },
    onError: () => toast.error('Failed to delete task'),
  })
}
