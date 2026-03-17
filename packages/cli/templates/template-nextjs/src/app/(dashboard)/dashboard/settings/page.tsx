import { PageLayout } from '@/components/layout/page-layout'

export const metadata = {
  title: 'Settings',
}

export default function SettingsPage() {
  return (
    <PageLayout title="Settings" description="Manage your application settings and preferences.">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">Settings configuration coming soon.</p>
      </div>
    </PageLayout>
  )
}
