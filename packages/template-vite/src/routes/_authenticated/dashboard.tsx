import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/layout/page-layout'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <PageLayout title='Dashboard' description='Welcome to your portal'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {['Total Users', 'Active Sessions', 'Revenue', 'Growth'].map((label) => (
          <div key={label} className='rounded-lg border bg-card p-6'>
            <p className='text-sm text-muted-foreground'>{label}</p>
            <p className='mt-2 text-2xl font-bold'>—</p>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
