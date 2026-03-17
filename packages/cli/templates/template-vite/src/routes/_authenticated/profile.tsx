import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/layout/page-layout'
import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: user } = useCurrentUser()

  return (
    <PageLayout title='Profile' description='Manage your personal information'>
      <div className='max-w-lg rounded-lg border bg-card p-6'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-16 w-16'>
            <AvatarFallback className='text-xl'>
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='font-semibold'>{user?.name ?? '—'}</p>
            <p className='text-sm text-muted-foreground'>{user?.email ?? '—'}</p>
          </div>
        </div>

        {user?.roles && user.roles.length > 0 && (
          <div className='mt-4'>
            <p className='text-sm font-medium'>Roles</p>
            <div className='mt-1 flex flex-wrap gap-2'>
              {user.roles.map((role) => (
                <span
                  key={role}
                  className='rounded-full bg-secondary px-3 py-1 text-xs font-medium'
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
