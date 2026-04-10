import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { TasksCrudTable } from '@/features/tasks/components/tasks-crud-table'

export const Route = createFileRoute('/_authenticated/examples/crud')({
  component: CrudPage,
})

function CrudPage() {
  return (
    <PageLayout title='CRUD Example' description='Full Create, Read, Update, Delete with DataTable'>
      <TasksCrudTable />
    </PageLayout>
  )
}
