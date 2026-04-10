import { createFileRoute } from '@tanstack/react-router'
import { ErrorPage } from '@/components/common/error-page'

export const Route = createFileRoute('/(errors)/403')({
  component: () => (
    <ErrorPage
      code={403}
      title='Forbidden'
      description="You don't have permission to access this resource."
    />
  ),
})
