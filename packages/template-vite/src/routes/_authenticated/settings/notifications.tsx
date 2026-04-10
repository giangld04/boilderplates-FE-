import { createFileRoute } from '@tanstack/react-router'

import { SettingsContentSection } from '@/features/settings/components/settings-content-section'

export const Route = createFileRoute('/_authenticated/settings/notifications')({
  component: SettingsNotificationsPage,
})

function SettingsNotificationsPage() {
  return (
    <SettingsContentSection
      title='Notifications'
      desc='Configure how you receive notifications.'
    >
      <p className='text-sm text-muted-foreground'>Notification settings coming soon.</p>
    </SettingsContentSection>
  )
}
