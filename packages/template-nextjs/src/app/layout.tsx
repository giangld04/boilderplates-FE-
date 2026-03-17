import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AppProviders } from '@/providers/app-providers'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '{{PROJECT_NAME}}',
  description: 'Portal frontend application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
