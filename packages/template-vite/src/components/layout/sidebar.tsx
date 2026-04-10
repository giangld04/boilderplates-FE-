import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, LayoutDashboard, LayoutTemplate, Settings, Table2, Users, ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { siteConfig } from '@/config/site'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

const exampleItems = [
  { to: '/examples/toasts', label: 'Toasts', icon: Bell },
  { to: '/examples/modals', label: 'Modals', icon: LayoutTemplate },
  { to: '/examples/crud', label: 'CRUD', icon: Table2 },
] as const

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-sidebar transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo / Brand */}
      <div className='flex h-14 items-center border-b px-4'>
        {!collapsed && (
          <span className='truncate text-sm font-semibold text-sidebar-foreground'>
            {siteConfig.name}
          </span>
        )}
        <Button
          variant='ghost'
          size='icon'
          className={cn('ml-auto h-7 w-7 shrink-0', collapsed && 'mx-auto')}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto p-2'>
        <TooltipProvider delayDuration={0}>
          <div className='space-y-1'>
            {navItems.map(({ to, label, icon: Icon }) => (
              <Tooltip key={to} disableHoverableContent={!collapsed}>
                <TooltipTrigger asChild>
                  <Link
                    to={to}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      '[&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon className='h-4 w-4 shrink-0' />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side='right'>{label}</TooltipContent>}
              </Tooltip>
            ))}
          </div>

          {/* Examples group */}
          <Separator className='my-3' />
          {!collapsed && (
            <p className='mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Examples
            </p>
          )}
          <div className='space-y-1'>
            {exampleItems.map(({ to, label, icon: Icon }) => (
              <Tooltip key={to} disableHoverableContent={!collapsed}>
                <TooltipTrigger asChild>
                  <Link
                    to={to}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      '[&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon className='h-4 w-4 shrink-0' />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side='right'>{label}</TooltipContent>}
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
