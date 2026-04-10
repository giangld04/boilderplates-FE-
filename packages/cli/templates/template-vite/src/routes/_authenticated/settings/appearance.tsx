import { createFileRoute } from '@tanstack/react-router'

import { SettingsContentSection } from '@/features/settings/components/settings-content-section'
import { AppearanceSettingsForm } from '@/features/settings/appearance/appearance-settings-form'

export const Route = createFileRoute('/_authenticated/settings/appearance')({
  component: SettingsAppearancePage,
})

function SettingsAppearancePage() {
  return (
    <SettingsContentSection
      title='Appearance'
      desc='Customize the appearance of the app. Automatically switch between day and night themes.'
    >
      <AppearanceSettingsForm />
    </SettingsContentSection>
  )
}
