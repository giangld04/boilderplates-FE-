# {{PROJECT_NAME}}

> Vite 8 SPA portal — scaffolded by [doo-boilerplate](https://www.npmjs.com/package/doo-boilerplate)

## Quick Start

```bash
cp .env.example .env   # configure API URLs
pnpm dev               # http://localhost:5173
```

---

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` / `lint:fix` | ESLint |
| `pnpm type-check` | TypeScript |
| `pnpm format` | Prettier |
| `pnpm knip` | Find unused code |
| `pnpm gen:api` | Generate types from `docs/swagger/api.json` |
| `pnpm gen:api:watch` | Watch mode |
| `pnpm docker:build` | Build image + Trivy scan |
| `pnpm docker:scan` | Scan existing image |

---

## Folder Structure

```
src/
├── routes/                         # TanStack Router (file-based, type-safe)
│   ├── __root.tsx                  # Root layout: providers, loading bar
│   ├── _authenticated.tsx          # Auth guard: redirects to /sign-in if no token
│   ├── _authenticated/
│   │   ├── dashboard.tsx           # /dashboard
│   │   ├── profile.tsx             # /profile
│   │   └── settings.tsx            # /settings
│   ├── (auth)/
│   │   └── sign-in.tsx             # /sign-in (public)
│   └── (errors)/
│       └── 404.tsx                 # 404 page
│
├── routeTree.gen.ts                # Auto-generated — NEVER edit manually
│
├── main.tsx                        # Entry: i18n init → <RouterProvider>
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
├── context/
│   └── theme-provider.tsx          # next-themes wrapper for Vite
│
├── features/                       # Domain modules (feature-first)
│   └── auth/
│       ├── components/
│       │   └── sign-in-form.tsx
│       ├── hooks/
│       │   └── use-auth.ts         # useSignIn, useSignOut, useCurrentUser
│       ├── schemas/
│       │   └── auth-schema.ts      # Zod: LoginSchema
│       └── services/
│           ├── auth-api.ts         # API calls: login, logout, me
│           └── gen/                # Auto-generated types (pnpm gen:api)
│
├── hooks/                          # Shared custom hooks
│   └── use-media-query.ts
│
├── lib/                            # Utilities & singletons
│   ├── api-client.ts               # Axios instance (auto Bearer token + 401 handler)
│   ├── i18n.ts                     # i18next init with EN/VI resources
│   ├── query-client.ts             # TanStack Query client config
│   └── utils.ts                    # cn() = clsx + tailwind-merge
│
├── stores/
│   └── auth-store.ts               # Zustand auth (persisted to localStorage)
│
├── styles/
│   └── globals.css                 # @import tailwindcss + CSS variables
│
└── types/
    └── index.ts                    # Shared TS types
```

---

## Design Patterns

### File-Based Routing (TanStack Router)

Routes are defined by files in `src/routes/`. The router plugin auto-generates `routeTree.gen.ts` on save.

| File naming | Result |
|-------------|--------|
| `_authenticated.tsx` | Layout route — all nested routes require auth |
| `_authenticated/dashboard.tsx` | `/dashboard` (protected) |
| `(auth)/sign-in.tsx` | `/sign-in` (parentheses = pathless group) |
| `__root.tsx` | Root layout (wraps everything) |

**Add a new protected page:**

```bash
touch src/routes/_authenticated/reports.tsx
```

```ts
// src/routes/_authenticated/reports.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  return <PageLayout title="Reports">...</PageLayout>
}
```

The route is auto-discovered and added to the type-safe route tree.

### Feature-First Modules

Add new domain logic as a self-contained feature:

```
features/reports/
├── components/report-table.tsx
├── hooks/use-reports.ts        ← TanStack Query hooks
├── schemas/report-schema.ts    ← Zod validation
└── services/
    ├── reports-api.ts          ← API calls
    └── gen/                    ← Generated types (optional)
```

### State Layers

| State type | Tool | Location |
|-----------|------|----------|
| Server / async data | TanStack Query | `features/{x}/hooks/` |
| Global client state | Zustand | `src/stores/` |
| Form state | React Hook Form | component-local |
| URL / search params | TanStack Router | `Route.useSearch()` |

**Rule:** Never put fetched data in Zustand. Only truly global client state (auth, UI prefs) goes in stores.

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

### Auth Guard (Route Protection)

```ts
// routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/sign-in' })
  },
})
```

All routes nested under `_authenticated/` inherit this guard automatically.

### API Client

```ts
import apiClient from '@/lib/api-client'

// features/reports/services/reports-api.ts
export const reportsApi = {
  list: (params?: FilterParams) =>
    apiClient.get<Report[]>('/reports', { params }).then(r => r.data),
  create: (data: CreateReportDto) =>
    apiClient.post<Report>('/reports', data).then(r => r.data),
}
```

Auto-injects `Authorization: Bearer <token>` and redirects to `/sign-in` on 401.

### TanStack Query Hooks

```ts
// features/reports/hooks/use-reports.ts
export function useReports(params?: FilterParams) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportsApi.list(params),
    staleTime: 5 * 60_000,
  })
}

export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reportsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }),
  })
}
```

### Form Pattern

```ts
const schema = z.object({ title: z.string().min(3) })
type Values = z.infer<typeof schema>

function CreateReportForm() {
  const form = useForm<Values>({ resolver: zodResolver(schema) })
  const { mutate, isPending } = useCreateReport()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => mutate(data))}>
        <FormField control={form.control} name="title" render={...} />
        <Button disabled={isPending}>Create</Button>
      </form>
    </Form>
  )
}
```

### Internationalization

```ts
import { useTranslation } from 'react-i18next'

function Dashboard() {
  const { t, i18n } = useTranslation('dashboard')
  return <h1>{t('welcome')}</h1>
}

// Switch language
i18n.changeLanguage('vi')
```

Translation resources are in `src/lib/i18n.ts`. Add new namespaces or languages there.

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

---

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_API_AUTH_URL=http://localhost:8001
VITE_APP_NAME={{PROJECT_NAME}}
```

Access in code: `import.meta.env.VITE_API_URL`

---

## Docker

```bash
pnpm docker:build          # Build + Trivy scan
docker-compose up          # Local dev stack on :3000
```

Vite builds a static bundle served by Nginx. The `nginx.conf` uses `try_files $uri /index.html` for SPA routing.

---

**Framework:** Vite 8 + React 19 · **Routing:** TanStack Router (file-based) · **Styling:** Tailwind CSS 4 + Shadcn/ui · **i18n:** i18next (EN/VI) · **State:** Zustand 5 + TanStack Query 5 · **Node:** ≥20.19.0
