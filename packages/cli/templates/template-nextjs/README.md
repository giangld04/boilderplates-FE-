# {{PROJECT_NAME}}

> Next.js 16 SSR portal — scaffolded by [doo-boilerplate](https://www.npmjs.com/package/doo-boilerplate)

## Quick Start

```bash
cp .env.example .env   # configure API URLs
pnpm dev               # http://localhost:3000
```

---

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` / `lint:fix` | ESLint |
| `pnpm type-check` | TypeScript |
| `pnpm format` | Prettier |
| `pnpm knip` | Find unused code |
| `pnpm gen:api` | Generate types from `docs/swagger/api.json` |
| `pnpm gen:api:watch` | Watch mode |
| `pnpm docker:build` | Build image + Trivy security scan |
| `pnpm docker:scan` | Scan existing image |

---

## Folder Structure

```
src/
├── app/                            # Next.js App Router (pages + layouts)
│   ├── (auth)/                     # Unauthenticated route group
│   │   ├── layout.tsx              # Minimal layout (no sidebar)
│   │   └── sign-in/page.tsx
│   ├── (dashboard)/                # Protected route group
│   │   ├── layout.tsx              # Full layout: sidebar + header
│   │   ├── page.tsx                # /dashboard
│   │   ├── profile/page.tsx        # /profile
│   │   └── settings/page.tsx       # /settings
│   ├── api/health/route.ts         # Health check: GET /api/health
│   ├── layout.tsx                  # Root: fonts, providers, html lang
│   └── not-found.tsx               # 404 page
│
├── components/
│   ├── ui/                         # Shadcn/ui primitives — DO NOT EDIT
│   │   └── button, card, dialog, form, input, select, ...
│   ├── common/                     # Shared app-wide components
│   │   ├── error-boundary.tsx
│   │   ├── loading-spinner.tsx
│   │   └── theme-toggle.tsx        # Dark/light/system toggle
│   └── layout/                     # Page chrome
│       ├── sidebar.tsx             # Collapsible nav sidebar
│       ├── header.tsx              # Top bar with user menu
│       └── page-layout.tsx         # Wrapper: sidebar + main content
│
├── features/                       # Domain modules (feature-first)
│   └── auth/
│       ├── components/
│       │   └── sign-in-form.tsx
│       ├── hooks/
│       │   └── use-auth.ts         # useSignIn, useSignOut, useCurrentUser
│       ├── schemas/
│       │   └── auth-schema.ts      # Zod: LoginSchema, RegisterSchema
│       └── services/
│           ├── auth-api.ts         # API calls: login, logout, me
│           └── gen/                # Auto-generated types (pnpm gen:api)
│
├── hooks/                          # Shared custom hooks
│   └── use-media-query.ts
│
├── i18n/
│   └── config.ts                   # locales: ['en', 'vi'], defaultLocale: 'en'
│
├── lib/                            # Utilities & singletons
│   ├── api-client.ts               # Axios instance (auto Bearer token + 401 handler)
│   ├── query-client.ts             # TanStack Query client config
│   └── utils.ts                    # cn() = clsx + tailwind-merge
│
├── middleware.ts                    # next-intl routing (locale prefix)
│
├── providers/
│   ├── app-providers.tsx           # Compose all providers here
│   ├── query-provider.tsx          # <QueryClientProvider>
│   └── theme-provider.tsx          # <ThemeProvider> (next-themes)
│
├── stores/
│   └── auth-store.ts               # Zustand auth (persisted to localStorage)
│
├── styles/
│   └── globals.css                 # @import tailwindcss + CSS variables
│
└── types/
    └── index.ts                    # Shared TS types (ApiError, PaginatedResponse, etc.)
```

---

## Design Patterns

### Feature-First Modules

Add new domain logic as a feature module:

```
features/users/
├── components/user-table.tsx
├── hooks/use-users.ts          ← TanStack Query hooks
├── schemas/user-schema.ts      ← Zod validation
└── services/
    ├── users-api.ts            ← API calls
    └── gen/                    ← Generated types (optional)
```

### State Layers

| State type | Tool | Location |
|-----------|------|----------|
| Server / async data | TanStack Query | `features/{x}/hooks/` |
| Global client state | Zustand | `src/stores/` |
| Form state | React Hook Form | component-local |
| URL / route params | `useSearchParams` | component-local |

**Rule:** Never put fetched data in Zustand. Only put truly global client state (auth, UI prefs) in stores.

### Auth Store

```ts
import { useAuthStore } from '@/stores/auth-store'

// Read
const { user, isAuthenticated } = useAuthStore()

// RBAC
const isAdmin = useAuthStore(s => s.hasRole('admin'))
const canPublish = useAuthStore(s => s.hasPermission('publish:articles'))

// Mutations
const { login, logout } = useAuthStore()
```

Persisted fields: `user`, `accessToken`, `refreshToken`, `isAuthenticated`.

### API Client

```ts
// All features use the shared client from lib/api-client.ts
import apiClient from '@/lib/api-client'

// features/users/services/users-api.ts
export const usersApi = {
  list: (params?: ListParams) =>
    apiClient.get<User[]>('/users', { params }).then(r => r.data),
  create: (data: CreateUserDto) =>
    apiClient.post<User>('/users', data).then(r => r.data),
  update: (id: string, data: UpdateUserDto) =>
    apiClient.patch<User>(`/users/${id}`, data).then(r => r.data),
}
```

The client auto-injects `Authorization: Bearer <token>` and clears auth + redirects to `/sign-in` on 401.

### TanStack Query Hooks

```ts
// features/users/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../services/users-api'

export function useUsers(params?: ListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params),
    staleTime: 5 * 60_000,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
```

### Form Pattern

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ name: z.string().min(2) })
type Values = z.infer<typeof schema>

function CreateUserForm() {
  const form = useForm<Values>({ resolver: zodResolver(schema) })
  const { mutate, isPending } = useCreateUser()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => mutate(data))}>
        <FormField control={form.control} name="name" render={...} />
        <Button disabled={isPending}>Create</Button>
      </form>
    </Form>
  )
}
```

### Protected Routes

Route groups handle protection at the layout level:

```ts
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { getAuthFromCookies } from '@/lib/auth-server'

export default async function DashboardLayout({ children }) {
  const auth = await getAuthFromCookies()
  if (!auth?.isAuthenticated) redirect('/sign-in')
  return <PageLayout>{children}</PageLayout>
}
```

### Internationalization

```ts
// Server Component
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('dashboard')

// Client Component ('use client')
import { useTranslations } from 'next-intl'
const t = useTranslations('dashboard')

t('welcome')         // → "Welcome" / "Chào mừng"
t('items', { n: 5 }) // with interpolation
```

Add translations in `messages/en.json` and `messages/vi.json`.

---

## API Type Generation

```bash
# 1. Place your backend OpenAPI spec
curl https://api.example.com/swagger.json > docs/swagger/api.json

# 2. Generate TypeScript types
pnpm gen:api

# 3. Import generated types
import type { LoginRequest } from '@/features/auth/services/gen'
```

To generate types for a different feature, update the `-o` path in `package.json`:

```json
"gen:api": "swagger-typescript-api -p ./docs/swagger/api.json -o ./src/features/users/services/gen --no-client --modular"
```

---

## Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_AUTH_URL=http://localhost:8001

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME={{PROJECT_NAME}}
```

---

## Docker

```bash
pnpm docker:build          # Build + Trivy scan
docker-compose up          # Local dev stack on :3000
```

The Dockerfile uses 3 stages: `deps` → `builder` → `runner` (minimal Node image). Uses `output: 'standalone'` for smallest container size.

---

**Framework:** Next.js 16 · **Styling:** Tailwind CSS 4 + Shadcn/ui · **i18n:** next-intl (EN/VI) · **State:** Zustand 5 + TanStack Query 5
