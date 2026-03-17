'use client'

import { useAuthStore } from '@/stores/auth-store'
import { PageLayout } from '@/components/layout/page-layout'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <PageLayout title="Profile" description="View and manage your profile information.">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        {user ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </p>
              <p className="mt-1 text-sm font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </p>
              <p className="mt-1 text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Roles
              </p>
              <p className="mt-1 text-sm font-medium">{user.roles.join(', ') || 'No roles'}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No profile information available.</p>
        )}
      </div>
    </PageLayout>
  )
}
