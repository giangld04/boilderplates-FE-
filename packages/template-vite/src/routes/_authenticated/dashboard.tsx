import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/layout/page-layout'
import { OverviewChart } from '@/features/dashboard/components/overview-chart'
import { RecentActivity } from '@/features/dashboard/components/recent-activity'
import { StatsCards } from '@/features/dashboard/components/stats-cards'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <PageLayout title='Dashboard' description='Welcome to your portal'>
      <div className='space-y-6'>
        <StatsCards />
        <div className='grid gap-6 lg:grid-cols-7'>
          <div className='lg:col-span-4'>
            <OverviewChart />
          </div>
          <div className='lg:col-span-3'>
            <RecentActivity />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
