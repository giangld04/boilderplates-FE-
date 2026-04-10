import { createFileRoute, redirect } from '@tanstack/react-router'

import { SignInForm } from '@/features/auth/components/sign-in-form'
import { useAuthStore } from '@/stores/auth-store'
import { siteConfig } from '@/config/site'

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
    <div className='grid min-h-screen lg:grid-cols-2'>
      {/* Left: branding panel (hidden on mobile) */}
      <div className='hidden lg:flex flex-col items-start justify-between bg-sidebar p-10'>
        <div className='flex items-center gap-2 text-lg font-semibold'>
          <div className='h-8 w-8 rounded-md bg-primary' />
          {siteConfig.name}
        </div>
        <blockquote className='space-y-2'>
          <p className='text-lg'>"This boilerplate saved us weeks of setup time. Everything just works."</p>
          <footer className='text-sm text-muted-foreground'>— A Happy Developer</footer>
        </blockquote>
      </div>

      {/* Right: form panel */}
      <div className='flex items-center justify-center bg-background p-8'>
        <div className='w-full max-w-sm'>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
