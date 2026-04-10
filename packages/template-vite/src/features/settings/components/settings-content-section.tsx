import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'

interface SettingsContentSectionProps {
  title: string
  desc: string
  children: ReactNode
}

export function SettingsContentSection({ title, desc, children }: SettingsContentSectionProps) {
  return (
    <div className='flex flex-1 flex-col'>
      <div>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>
      <Separator className='my-4' />
      <div className='flex-1'>{children}</div>
    </div>
  )
}
