import { createFileRoute } from '@tanstack/react-router'

import { SignInForm } from '@/features/auth/components/sign-in-form'

export const Route = createFileRoute('/(auth)/sign-in')({
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
