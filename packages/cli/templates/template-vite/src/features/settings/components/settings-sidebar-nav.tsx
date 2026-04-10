import type { JSX } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface NavItem {
  href: string
  title: string
  icon: JSX.Element
}

interface SettingsSidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[]
}

export function SettingsSidebarNav({ className, items, ...props }: SettingsSidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <>
      {/* Mobile: dropdown select */}
      <div className='p-1 md:hidden'>
        <Select value={pathname} onValueChange={(v) => navigate({ to: v })}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue placeholder='Select section' />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className='flex gap-x-4 px-2 py-1'>
                  <span className='scale-125'>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: vertical nav */}
      <nav className={cn('hidden md:flex md:flex-col md:space-y-1', className)} {...props}>
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === item.href ? 'bg-muted hover:bg-muted' : 'hover:bg-muted/50',
              'justify-start gap-2'
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    </>
  )
}
