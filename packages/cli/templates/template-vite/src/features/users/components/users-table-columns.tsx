import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import type { User } from '../types/user'

/** Get initials from a full name for avatar fallback */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Map role value to badge variant */
const roleBadgeVariant: Record<User['role'], 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  manager: 'secondary',
  user: 'outline',
}

/** Map status value to badge variant */
const statusBadgeVariant: Record<User['status'], 'success' | 'destructive' | 'warning'> = {
  active: 'success',
  inactive: 'destructive',
  pending: 'warning',
}

interface GetColumnsOptions {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function getUsersTableColumns({ onEdit, onDelete }: GetColumnsOptions): ColumnDef<User>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className='flex items-center gap-3'>
            <Avatar className='h-8 w-8'>
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className='text-xs'>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <span className='font-medium'>{user.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ row }) => <span className='text-muted-foreground'>{row.getValue('email')}</span>,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
      cell: ({ row }) => {
        const role = row.getValue<User['role']>('role')
        return (
          <Badge variant={roleBadgeVariant[role]} className='capitalize'>
            {role}
          </Badge>
        )
      },
      filterFn: 'arrIncludesSome',
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const status = row.getValue<User['status']>('status')
        return (
          <Badge variant={statusBadgeVariant[status]} className='capitalize'>
            {status}
          </Badge>
        )
      },
      filterFn: 'arrIncludesSome',
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {new Date(row.getValue<string>('createdAt')).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(user)}
                className='text-destructive focus:text-destructive'
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
