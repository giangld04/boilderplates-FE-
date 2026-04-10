import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/examples/toasts')({
  component: ToastsPage,
})

function ToastsPage() {
  const showPromise = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Loading...',
      success: 'Promise resolved!',
      error: 'Promise rejected',
    })
  }

  return (
    <PageLayout title='Toast Notifications' description='Interactive toast notification examples using Sonner'>
      <Card>
        <CardHeader>
          <CardTitle>Toast Types</CardTitle>
          <CardDescription>Click buttons to trigger different toast variants</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-3'>
          <Button onClick={() => toast.success('Operation completed successfully!')}>Success</Button>
          <Button variant='destructive' onClick={() => toast.error('Something went wrong!')}>Error</Button>
          <Button variant='outline' onClick={() => toast.warning('Proceed with caution')}>Warning</Button>
          <Button variant='outline' onClick={() => toast.info('Here is some information')}>Info</Button>
          <Button variant='outline' onClick={showPromise}>Promise</Button>
          <Button
            variant='secondary'
            onClick={() =>
              toast('Event created', {
                action: { label: 'Undo', onClick: () => toast.info('Undone!') },
              })
            }
          >
            With Action
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
