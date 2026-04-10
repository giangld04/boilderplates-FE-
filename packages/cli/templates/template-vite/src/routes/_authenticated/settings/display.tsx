import { createFileRoute } from '@tanstack/react-router'

import { SettingsContentSection } from '@/features/settings/components/settings-content-section'

export const Route = createFileRoute('/_authenticated/settings/display')({
  component: SettingsDisplayPage,
})

function SettingsDisplayPage() {
  return (
    <SettingsContentSection
      title='Display'
      desc='Turn items on or off to control what is displayed in the app.'
    >
      <p className='text-sm text-muted-foreground'>Display settings coming soon.</p>
    </SettingsContentSection>
  )
}
