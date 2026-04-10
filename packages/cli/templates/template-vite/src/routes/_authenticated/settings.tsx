import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Bell, Monitor, Palette, UserCog, Wrench } from 'lucide-react'

import { PageLayout } from '@/components/layout/page-layout'
import { SettingsSidebarNav } from '@/features/settings/components/settings-sidebar-nav'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsLayout,
})

const sidebarNavItems = [
  { title: 'Profile', href: '/settings', icon: <UserCog size={16} /> },
  { title: 'Account', href: '/settings/account', icon: <Wrench size={16} /> },
  { title: 'Appearance', href: '/settings/appearance', icon: <Palette size={16} /> },
  { title: 'Notifications', href: '/settings/notifications', icon: <Bell size={16} /> },
  { title: 'Display', href: '/settings/display', icon: <Monitor size={16} /> },
]

function SettingsLayout() {
  return (
    <PageLayout title='Settings' description='Manage your account settings and preferences.'>
      <div className='flex flex-col gap-6 lg:flex-row lg:gap-12'>
        <aside className='lg:w-48 shrink-0'>
          <SettingsSidebarNav items={sidebarNavItems} />
        </aside>
        <div className='flex-1 min-w-0'>
          <Outlet />
        </div>
      </div>
    </PageLayout>
  )
}
