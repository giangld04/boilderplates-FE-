import { Link, createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { Button } from '@/components/ui/button'
import type { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
}

function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>404</h1>
      <p className='text-lg text-muted-foreground'>Page not found</p>
      <Button asChild>
        <Link to='/dashboard'>Go to Dashboard</Link>
      </Button>
    </div>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})
