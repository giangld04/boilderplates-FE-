import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { tasksMockData } from '../data/tasks-mock-data'
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

/** Full CRUD data table for tasks using local state */
export function TasksCrudTable() {
  const [tasks, setTasks] = useState<Task[]>(tasksMockData)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast.success('Task deleted')
  }

  const handleSubmit = (values: TaskFormValues) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...values } : t))
      toast.success('Task updated')
    } else {
      const newTask: Task = {
        id: String(Date.now()),
        ...values,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setTasks((prev) => [newTask, ...prev])
      toast.success('Task created')
    }
    setEditingTask(undefined)
  }

  const columns = getTaskColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
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
