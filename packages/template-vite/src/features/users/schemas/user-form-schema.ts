import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Please select a role',
  }),
  status: z.enum(['active', 'inactive', 'pending'], {
    required_error: 'Please select a status',
  }),
})

export type UserFormValues = z.infer<typeof userFormSchema>
