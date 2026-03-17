import { z } from 'zod'

export const signInSchema = z.object({
  email: z.union([z.string().email('Please enter a valid email address'), z.literal('demo')]),
  password: z.string().min(1, 'Password is required'),
})

export type SignInValues = z.infer<typeof signInSchema>
