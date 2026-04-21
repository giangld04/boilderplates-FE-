import { useState } from 'react'

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type Cell, type ColumnDef, type Table as TanstackTable, flexRender } from '@tanstack/react-table'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import { DataTablePagination } from './data-table-pagination'
import { SortableHeader } from './data-table-sortable-header'

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  columns: ColumnDef<TData>[]
  isLoading?: boolean
}

/**
 * Cell that participates in DnD column reordering.
 * Uses useSortable to get CSS transform during drag so the cell visually
 * moves with its column header — matching ndatrace-cms DragAlongCell pattern.
 */
function DragAlongCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  const { isDragging, setNodeRef, transform } = useSortable({ id: cell.column.id })

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.6 : 1,
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    position: 'relative',
  }

  return (
    <TableCell ref={setNodeRef} style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  )
}

export function DataTable<TData>({ table, columns, isLoading }: DataTableProps<TData>) {
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    table.getAllLeafColumns().map((col) => col.id)
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const newOrder = arrayMove(
        columnOrder,
        columnOrder.indexOf(String(active.id)),
        columnOrder.indexOf(String(over.id))
      )
      setColumnOrder(newOrder)
      // Also sync to table instance if parent wired onColumnOrderChange
      table.setColumnOrder(newOrder)
    }
  }

  // Sort by local columnOrder so DnD works self-contained (no parent config needed).
  // After drag ends, re-renders headers/cells in the new order.
  function sortById<T extends { id: string }>(items: T[]): T[] {
    return [...items].sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div className='space-y-4'>
        <div className='rounded-md border overflow-hidden'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <SortableContext
                  key={headerGroup.id}
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  <tr>
                    {sortById(headerGroup.headers).map((header) => (
                      <SortableHeader key={header.id} header={header} />
                    ))}
                  </tr>
                </SortableContext>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className='h-4 w-full' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                      {sortById(row.getVisibleCells()).map((cell) => (
                        <DragAlongCell key={cell.id} cell={cell} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </DndContext>
  )
}
