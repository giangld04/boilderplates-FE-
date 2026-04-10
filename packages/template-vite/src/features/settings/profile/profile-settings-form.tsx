import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const profileSchema = z.object({
  username: z.string().min(2, 'At least 2 characters').max(30, 'Max 30 characters'),
  email: z.string().email('Invalid email'),
  bio: z.string().min(4, 'At least 4 characters').max(160, 'Max 160 characters').optional().or(z.literal('')),
  urls: z.array(z.object({ value: z.string().url('Invalid URL').optional().or(z.literal('')) })).max(5),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfileSettingsForm() {
  const { user } = useAuthStore()

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.name ?? '',
      email: user?.email ?? '',
      bio: '',
      urls: [{ value: '' }],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({ name: 'urls', control: form.control })

  function onSubmit(data: ProfileValues) {
    toast.success('Profile updated successfully')
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Your name' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email@example.com' type='email' {...field} />
              </FormControl>
              <FormDescription>
                You can manage verified email addresses in your email settings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder='Tell us a little bit about yourself' className='resize-none' {...field} />
              </FormControl>
              <FormDescription>
                You can <span className='font-medium'>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-2'>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && (
                    <>
                      <FormLabel>URLs</FormLabel>
                      <FormDescription>
                        Add links to your website, blog, or social media profiles.
                      </FormDescription>
                    </>
                  )}
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input placeholder='https://example.com' {...field} />
                    </FormControl>
                    {fields.length > 1 && (
                      <Button type='button' variant='outline' size='sm' onClick={() => remove(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {fields.length < 5 && (
            <Button type='button' variant='outline' size='sm' onClick={() => append({ value: '' })}>
              Add URL
            </Button>
          )}
        </div>

        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  )
}
