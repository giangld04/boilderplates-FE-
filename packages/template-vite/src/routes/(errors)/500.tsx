import { createFileRoute } from '@tanstack/react-router'
import { ErrorPage } from '@/components/common/error-page'

export const Route = createFileRoute('/(errors)/500')({
  component: () => (
    <ErrorPage
      code={500}
      title='Internal Server Error'
      description='Something went wrong on our end. Please try again later.'
      showBack={false}
    />
  ),
})
