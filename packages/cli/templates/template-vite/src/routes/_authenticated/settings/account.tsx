import { createFileRoute } from '@tanstack/react-router'

import { SettingsContentSection } from '@/features/settings/components/settings-content-section'
import { AccountSettingsForm } from '@/features/settings/account/account-settings-form'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccountPage,
})

function SettingsAccountPage() {
  return (
    <SettingsContentSection
      title='Account'
      desc='Update your account settings. Set your preferred language and timezone.'
    >
      <AccountSettingsForm />
    </SettingsContentSection>
  )
}
