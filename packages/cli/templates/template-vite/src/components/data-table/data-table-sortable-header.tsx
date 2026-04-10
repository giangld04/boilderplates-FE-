import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type Header, flexRender } from '@tanstack/react-table'

import { TableHead } from '@/components/ui/table'

import { ColumnDragHandle } from './data-table-drag-handle'

interface SortableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>
}

/**
 * Table header cell with DnD sortable support.
 * useSortable is called once here; listeners are passed to ColumnDragHandle
 * to avoid duplicate useSortable calls with the same id.
 */
export function SortableHeader<TData, TValue>({ header }: SortableHeaderProps<TData, TValue>) {
  const { attributes, listeners, transform, transition, isDragging } = useSortable({
    id: header.column.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <TableHead colSpan={header.colSpan} style={style}>
      {header.isPlaceholder ? null : (
        <div className='flex items-center gap-1'>
          <ColumnDragHandle attributes={attributes} listeners={listeners} />
          {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
      )}
    </TableHead>
  )
}
