import { useState } from 'react'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type ColumnOrderState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { mockUsers } from '../data/users-mock-data'
import { getUsersTableColumns } from './users-table-columns'
import { UserFormDialog } from './user-form-dialog'
import { UserDeleteConfirmationDialog } from './user-delete-confirmation-dialog'
import type { User } from '../types/user'

/** Filter options for role and status faceted filters */
const roleFilterOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'User', value: 'user' },
]

const statusFilterOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]

const toolbarFilters = [
  { columnId: 'role', title: 'Role', options: roleFilterOptions },
  { columnId: 'status', title: 'Status', options: statusFilterOptions },
]

export function UsersTable() {
  const [data, setData] = useState<User[]>(mockUsers)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [rowSelection, setRowSelection] = useState({})

  // Dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedUser(null)
    setFormDialogOpen(true)
  }

  const handleFormSubmit = (values: Omit<User, 'id' | 'createdAt'>) => {
    if (selectedUser) {
      // Edit existing user
      setData((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...values } : u)))
    } else {
      // Add new user
      const newUser: User = {
        ...values,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split('T')[0],
      }
      setData((prev) => [newUser, ...prev])
    }
    setFormDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setData((prev) => prev.filter((u) => u.id !== selectedUser.id))
    }
    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const columns = getUsersTableColumns({ onEdit: handleEdit, onDelete: handleDelete })

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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <DataTableToolbar
          table={table}
          searchColumn='name'
          searchPlaceholder='Search users...'
          filters={toolbarFilters}
        />
        <Button size='sm' className='ml-4' onClick={handleAddNew}>
          <PlusCircle className='mr-2 h-4 w-4' />
          Add User
        </Button>
      </div>
      <DataTable table={table} columns={columns} />

      <UserFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        user={selectedUser}
        onSubmit={handleFormSubmit}
      />

      <UserDeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
