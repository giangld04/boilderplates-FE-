import { createFileRoute } from '@tanstack/react-router'

import { SettingsContentSection } from '@/features/settings/components/settings-content-section'
import { ProfileSettingsForm } from '@/features/settings/profile/profile-settings-form'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsProfilePage,
})

function SettingsProfilePage() {
  return (
    <SettingsContentSection
      title='Profile'
      desc='This is how others will see you on the site.'
    >
      <ProfileSettingsForm />
    </SettingsContentSection>
  )
}
