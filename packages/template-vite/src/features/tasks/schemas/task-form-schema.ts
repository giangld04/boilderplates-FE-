import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  status: z.enum(['todo', 'in-progress', 'done', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high']),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
