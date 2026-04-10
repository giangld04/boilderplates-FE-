import * as Sentry from '@sentry/react'

/**
 * Initialize Sentry error tracking.
 * Only runs if VITE_SENTRY_DSN is set.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Only send errors in production and staging
    enabled: import.meta.env.PROD || import.meta.env.MODE === 'staging',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
