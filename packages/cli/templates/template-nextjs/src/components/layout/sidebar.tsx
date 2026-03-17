'use client'

import { LayoutDashboard, Menu, Settings, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { create } from 'zustand'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet'

// Sidebar collapsed state
interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggle: () => void
  setMobileOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
}))

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
}: {
  href: string
  label: string
  icon: React.ElementType
  collapsed: boolean
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-border/60 hover:text-sidebar-primary'
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const { toggle } = useSidebarStore()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo area */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        {!collapsed && (
          <Link href="/dashboard" className="text-sm font-bold">
            {'{{PROJECT_NAME}}'}
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="ml-auto text-sidebar-foreground hover:bg-sidebar-border/60"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>
    </div>
  )
}

// Desktop sidebar
export function Sidebar() {
  const { isCollapsed } = useSidebarStore()

  return (
    <aside
      className={cn(
        'hidden h-full border-r border-sidebar-border transition-all duration-200 lg:block',
        isCollapsed ? 'w-14' : 'w-60'
      )}
    >
      <SidebarContent collapsed={isCollapsed} />
    </aside>
  )
}

// Mobile sidebar (Sheet)
export function MobileSidebar() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore()

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-60 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarContent collapsed={false} />
      </SheetContent>
    </Sheet>
  )
}
