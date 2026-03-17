import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/layout/page-layout'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <PageLayout title='Settings' description='Manage your application settings'>
      <div className='rounded-lg border bg-card p-6'>
        <p className='text-sm text-muted-foreground'>Settings content coming soon.</p>
      </div>
    </PageLayout>
  )
}
