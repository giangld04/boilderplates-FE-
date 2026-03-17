import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'

interface PageLayoutProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

/** Standard page wrapper with title, optional description + actions slot */
export function PageLayout({ title, description, actions, children }: PageLayoutProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-start justify-between px-6 pt-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
          {description && (
            <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
          )}
        </div>
        {actions && <div className='flex items-center gap-2'>{actions}</div>}
      </div>

      <Separator className='my-4' />

      <div className='flex-1 overflow-auto px-6 pb-6'>{children}</div>
    </div>
  )
}
