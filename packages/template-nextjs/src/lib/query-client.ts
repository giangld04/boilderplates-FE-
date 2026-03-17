import { QueryClient } from '@tanstack/react-query'

const isDev = process.env.NODE_ENV === 'development'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: isDev ? 10_000 : 30_000,
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status: number } })?.response?.status
        if (status === 401 || status === 403) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: !isDev,
    },
  },
})
