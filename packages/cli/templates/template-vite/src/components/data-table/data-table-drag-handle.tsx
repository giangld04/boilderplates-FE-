import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import type { DraggableAttributes } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'

interface DragHandleProps {
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
}

/**
 * Drag handle icon for sortable column headers.
 * Receives dnd-kit listeners/attributes from the parent useSortable call
 * to avoid calling useSortable twice with the same id.
 */
export function ColumnDragHandle({ attributes, listeners }: DragHandleProps) {
  return (
    <button
      {...attributes}
      {...listeners}
      className='cursor-grab opacity-40 hover:opacity-100 active:cursor-grabbing'
      aria-label='Drag to reorder column'
    >
      <GripVertical className='h-4 w-4' />
    </button>
  )
}
