import { createFileRoute, redirect } from '@tanstack/react-router'

import { SignInForm } from '@/features/auth/components/sign-in-form'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: () => {
    const { isAuthenticated, isTokenExpired } = useAuthStore.getState()
    if (isAuthenticated && !isTokenExpired()) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <div className='w-full max-w-sm'>
        <SignInForm />
      </div>
    </div>
  )
}
