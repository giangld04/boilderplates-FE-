import { createFileRoute } from '@tanstack/react-router'
import { ErrorPage } from '@/components/common/error-page'

export const Route = createFileRoute('/(errors)/401')({
  component: () => (
    <ErrorPage
      code={401}
      title='Unauthorized'
      description='You need to be logged in to access this page.'
    />
  ),
})
