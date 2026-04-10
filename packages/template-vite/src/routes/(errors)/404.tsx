import { createFileRoute } from '@tanstack/react-router'
import { ErrorPage } from '@/components/common/error-page'

export const Route = createFileRoute('/(errors)/404')({
  component: () => (
    <ErrorPage
      code={404}
      title='Page Not Found'
      description="The page you're looking for doesn't exist or has been moved."
    />
  ),
})
