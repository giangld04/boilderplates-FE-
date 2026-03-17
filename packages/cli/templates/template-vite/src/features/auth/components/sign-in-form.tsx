import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useSignIn } from '../hooks/use-auth'
import { signInSchema, type SignInValues } from '../schemas/auth-schema'

export function SignInForm() {
  const { mutate: signIn, isPending, error } = useSignIn()

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: SignInValues) {
    signIn(values)
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>Sign in</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Enter your credentials to access your account · or try <strong>demo / demo</strong>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='you@example.com'
                    autoComplete='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='••••••••'
                    autoComplete='current-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className='text-sm text-destructive'>
              {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Invalid credentials. Please try again.'}
            </p>
          )}

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
