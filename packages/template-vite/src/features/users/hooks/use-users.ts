import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi, type CreateUserPayload, type UpdateUserPayload, type UserListParams } from '../services/users-api'

export const USER_QUERY_KEY = 'users'

/** Fetch paginated user list */
export function useUsers(params?: UserListParams) {
  return useQuery({
    queryKey: [USER_QUERY_KEY, params],
    queryFn: () => usersApi.list(params),
  })
}

/** Fetch single user by id */
export function useUser(id: string) {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  })
}

/** Create a new user */
export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserPayload) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] })
      toast.success('User created')
    },
    onError: () => toast.error('Failed to create user'),
  })
}

/** Update an existing user */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] })
      toast.success('User updated')
    },
    onError: () => toast.error('Failed to update user'),
  })
}

/** Delete a user by id */
export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] })
      toast.success('User deleted')
    },
    onError: () => toast.error('Failed to delete user'),
  })
}
