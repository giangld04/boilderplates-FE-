import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { isAuthenticated, isTokenExpired } = useAuthStore.getState()
    if (!isAuthenticated || isTokenExpired()) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.pathname },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Header />
        <main className='flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
