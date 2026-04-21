# Phase 04: Sentry Integration

## Context Links
- Current main.tsx: `packages/template-vite/src/main.tsx`
- Current vite.config.ts: `packages/template-vite/vite.config.ts`
- Error boundary: `packages/template-vite/src/components/common/error-boundary.tsx`
- Sentry deps (already merged in phase-01): `@sentry/react`, `@sentry/vite-plugin`
- Sentry React docs: https://docs.sentry.io/platforms/javascript/guides/react/

## Overview
- **Priority:** P2
- **Status:** pending
- **Description:** Initialize Sentry in main.tsx, add Vite plugin for source maps, wrap app in Sentry error boundary, add env variable for DSN.

## Key Insights
- `@sentry/react` v9 uses `Sentry.init()` with `@sentry/vite-plugin` for source maps
- Sentry should init BEFORE React renders (top of main.tsx)
- DSN comes from env var `VITE_SENTRY_DSN` -- if empty, Sentry is effectively disabled
- Sentry ErrorBoundary replaces or wraps existing error boundary
- Vite plugin uploads source maps during `vite build` only (needs auth token)

## Requirements

### Functional
- Sentry initializes on app load when `VITE_SENTRY_DSN` is set
- Unhandled errors captured and sent to Sentry
- Source maps uploaded during production build
- Error boundary shows fallback UI and reports to Sentry
- `VITE_SENTRY_DSN` and `VITE_SENTRY_AUTH_TOKEN` in `.env.example`

### Non-functional
- Zero performance impact when DSN is empty (Sentry SDK no-ops)
- Source map upload only runs when auth token is present

## Related Code Files

### Files to Modify
- `packages/template-vite/src/main.tsx` -- add Sentry.init + Sentry ErrorBoundary
- `packages/template-vite/vite.config.ts` -- add sentryVitePlugin
- `packages/template-vite/src/components/common/error-boundary.tsx` -- integrate with Sentry
- `packages/template-vite/_env.example` -- add VITE_SENTRY_DSN, VITE_SENTRY_AUTH_TOKEN

### Files to Create
- `packages/template-vite/src/lib/sentry.ts` -- Sentry init logic (keep main.tsx clean)

## Implementation Steps

### 1. Create Sentry init module
`src/lib/sentry.ts`:
```typescript
import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
```

### 2. Update `main.tsx`
Add at top (before React imports):
```typescript
import { initSentry } from './lib/sentry'
initSentry()
```
Wrap `RouterProvider` with Sentry error boundary:
```typescript
import * as Sentry from '@sentry/react'

// In render:
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <RouterProvider router={router} />
</Sentry.ErrorBoundary>
```

### 3. Update error-boundary.tsx
Either:
- (a) Replace custom ErrorBoundary with Sentry's `Sentry.ErrorBoundary` usage in layout, OR
- (b) Keep custom one but add `Sentry.captureException(error)` in componentDidCatch

Option (a) is simpler. Update existing error-boundary to export a fallback component:
```typescript
export function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    </div>
  )
}
```

### 4. Update `vite.config.ts`
```typescript
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  build: {
    sourcemap: true, // Required for Sentry source maps
    // ...existing
  },
  plugins: [
    // ...existing plugins
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      disable: !process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
})
```

### 5. Update `_env.example`
Add:
```env
# Sentry
VITE_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

### 6. Add Sentry to manualChunks (vite.config.ts)
```typescript
manualChunks: {
  // ...existing
  sentry: ['@sentry/react'],
}
```

## Todo List
- [ ] Create `src/lib/sentry.ts`
- [ ] Update `src/main.tsx` (init + error boundary)
- [ ] Update `src/components/common/error-boundary.tsx` (fallback component)
- [ ] Update `vite.config.ts` (sentry plugin + sourcemap)
- [ ] Update `_env.example` with Sentry vars
- [ ] Add sentry to manualChunks
- [ ] Verify: `pnpm --filter template-vite build` succeeds (no SENTRY_AUTH_TOKEN = plugin disabled)
- [ ] Verify: no runtime errors when VITE_SENTRY_DSN is empty

## Success Criteria
- App boots without errors when VITE_SENTRY_DSN is not set
- Sentry.init runs when DSN is provided
- Error boundary catches rendering errors and shows fallback
- `vite build` succeeds with sourcemap: true
- Sentry plugin is disabled when no auth token (no upload errors)
- `.env.example` documents all Sentry env vars

## Risk Assessment
- **Build breaks if sentry plugin misconfigured** -- mitigated by `disable: !process.env.SENTRY_AUTH_TOKEN`
- **Source map size increase** -- acceptable for production debugging
- **Sentry SDK bundle size (~30KB gzip)** -- isolated in manualChunks, lazy-loadable

## Security Considerations
- SENTRY_AUTH_TOKEN must NEVER be committed (it's in .env, not .env.example values)
- DSN is safe to expose client-side (Sentry design)
- Source maps uploaded to Sentry, not served publicly (if configured correctly)

## Next Steps
- This is the final phase
- After all phases: full build test, manual QA of scaffolded output
