import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { siteConfig } from '@/config/site'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
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
      <nav className='flex-1 space-y-1 p-2'>
        <TooltipProvider delayDuration={0}>
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
        </TooltipProvider>
      </nav>
    </aside>
  )
}
