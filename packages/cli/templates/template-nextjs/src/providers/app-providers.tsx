'use client'

import { type ReactNode, useEffect } from 'react'
import { Toaster } from 'sonner'

import { useAuthStore } from '@/stores/auth-store'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'

/** Sync auth-token cookie from localStorage so Next.js proxy can read it */
function AuthCookieSync() {
  useEffect(() => {
    const { isAuthenticated, accessToken, isTokenExpired } = useAuthStore.getState()
    if (isAuthenticated && accessToken && !isTokenExpired()) {
      document.cookie = `auth-token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`
    }
  }, [])
  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthCookieSync />
        {children}
        <Toaster richColors position='top-right' />
      </QueryProvider>
    </ThemeProvider>
  )
}
