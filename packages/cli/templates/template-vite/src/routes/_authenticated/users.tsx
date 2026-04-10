import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/layout/page-layout'
import { UsersTable } from '@/features/users/components/users-table'

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <PageLayout title='User Management' description='Manage your application users'>
      <UsersTable />
    </PageLayout>
  )
}
