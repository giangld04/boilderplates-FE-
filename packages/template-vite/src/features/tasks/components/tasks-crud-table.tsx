import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnOrderState,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/use-tasks'
import { getTaskColumns } from './tasks-table-columns'
import { TaskFormDialog } from './task-form-dialog'
import type { Task } from '../types/task'
import type { TaskFormValues } from '../schemas/task-form-schema'

const STATUS_FILTER_OPTIONS = [
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
  { label: 'Cancelled', value: 'cancelled' },
]

const PRIORITY_FILTER_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

/** CRUD data table for tasks — data fetched via TanStack Query, mutations invalidate cache */
export function TasksCrudTable() {
  const { data: response, isLoading } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleEdit = (task: Task) => { setEditingTask(task); setDialogOpen(true) }
  const handleDelete = (id: string) => deleteTask.mutate(id)

  const handleSubmit = (values: TaskFormValues) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, data: values })
    } else {
      createTask.mutate(values)
    }
    setEditingTask(undefined)
  }

  const data = response?.data ?? []
  const columns = getTaskColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, columnOrder, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <DataTableToolbar
          table={table}
          searchColumn='title'
          searchPlaceholder='Search tasks...'
          filters={[
            { columnId: 'status', title: 'Status', options: STATUS_FILTER_OPTIONS },
            { columnId: 'priority', title: 'Priority', options: PRIORITY_FILTER_OPTIONS },
          ]}
        />
        <Button
          size='sm'
          className='ml-2'
          disabled={isLoading}
          onClick={() => { setEditingTask(undefined); setDialogOpen(true) }}
        >
          <Plus className='mr-1 h-4 w-4' /> Add Task
        </Button>
      </div>
      <DataTable table={table} columns={columns} />
      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
