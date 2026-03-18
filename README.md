# doo-boilerplate (create-pila-app)

> CLI scaffolding tool for Pila portal frontend projects

Quickly scaffold production-ready portal frontends with **Next.js 16** (SSR) or **Vite 8** (SPA). Ships with authentication, i18n, dark mode, a cohesive design system, state management, and DevOps tooling by default.

---

## Quick Start

```bash
# Interactive mode (recommended)
npx doo-boilerplate

# Non-interactive (CI/CD)
npx doo-boilerplate my-app --framework vite --pm pnpm --theme violet --auth jwt --no-git
```

---

## CLI Options

| Flag | Values | Default |
|------|--------|---------|
| `[project-name]` | string | prompt |
| `--framework` | `nextjs`, `vite` | prompt |
| `--pm` | `pnpm`, `bun`, `yarn` | prompt |
| `--theme` | `violet`, `blue`, `emerald`, `rose` | prompt |
| `--features` | comma-separated | none |
| `--auth` | `jwt`, `oauth`, `none` | prompt |
| `--no-git` | — | false |

### Color Themes (`--theme`)

All themes use **hue-tinted neutrals** — borders, muted text, sidebar, and secondary surfaces share the primary hue at low saturation for a fully cohesive palette.

| Theme | Primary | Description |
|-------|---------|-------------|
| `violet` | `hsl(262 83% 58%)` | Modern & distinctive — default |
| `blue` | `hsl(217 91% 60%)` | Trustworthy & familiar |
| `emerald` | `hsl(158 64% 42%)` | Fresh & natural |
| `rose` | `hsl(346 77% 49%)` | Bold & energetic |

### Optional Features (`--features`)

| Value | Adds |
|-------|------|
| `editor` | Tiptap rich text editor |
| `charts` | ECharts + Recharts |
| `dnd` | @dnd-kit drag & drop |
| `sentry` | Sentry error tracking |

---

## Templates

| | **Next.js 16** | **Vite 8** |
|-|---------------|------------|
| Rendering | SSR + ISR + SSG | CSR (SPA) |
| Routing | App Router | TanStack Router (file-based) |
| I18n | `next-intl` | `i18next` |
| Bundle (baseline) | ~200KB | ~80KB |
| SEO | Yes | No |
| API routes | Yes | No |
| Deployment | Vercel / Node | Static host + Nginx |

Both templates include identically:
- Shadcn/ui + Radix UI + Tailwind CSS 4
- **Design system** — 4 color themes, violet-tinted tokens, polished button/badge/card variants
- **Header** — language switcher (EN/VI flag emojis) + theme toggle with circular reveal animation
- i18n EN/VI (default)
- Dark mode via `next-themes` (circular reveal via `document.startViewTransition`)
- Zustand 5 + TanStack Query 5
- React Hook Form + Zod
- Axios with JWT interceptors
- Docker multi-stage + GitHub Actions CI
- ESLint 9 + Prettier + Husky + Knip
- Swagger API type generation

---

## Folder Structure

### Next.js 16

```
my-portal/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Auth layout group (unauthenticated routes)
│   │   │   ├── layout.tsx          # Minimal layout (no sidebar/header)
│   │   │   └── sign-in/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/            # Protected layout group
│   │   │   ├── layout.tsx          # Full layout: sidebar + header
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   └── health/route.ts     # Health check endpoint
│   │   ├── layout.tsx              # Root layout (providers, fonts)
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── common/                 # Reusable app components
│   │   │   ├── error-boundary.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── layout/                 # Page layout building blocks
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── page-layout.tsx
│   │   └── ui/                     # Shadcn/ui primitives (do not edit)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ... (18 components)
│   │
│   ├── features/                   # Domain-specific modules
│   │   └── auth/
│   │       ├── components/         # Auth UI (sign-in form, etc.)
│   │       ├── hooks/              # useSignIn, useSignOut, useCurrentUser
│   │       ├── schemas/            # Zod validation schemas
│   │       └── services/
│   │           ├── auth-api.ts     # API calls for this feature
│   │           └── gen/            # Auto-generated types (pnpm gen:api)
│   │
│   ├── hooks/                      # Shared custom hooks
│   │   └── use-media-query.ts
│   │
│   ├── i18n/
│   │   └── config.ts               # locales = ['en', 'vi']
│   │
│   ├── lib/                        # Pure utilities & singletons
│   │   ├── api-client.ts           # Axios instance with auth interceptors
│   │   ├── query-client.ts         # TanStack Query client config
│   │   └── utils.ts                # cn() helper
│   │
│   ├── proxy.ts                    # Auth proxy: routes by auth-token cookie
│   │
│   ├── providers/
│   │   ├── app-providers.tsx       # Root provider composition
│   │   ├── query-provider.tsx      # TanStack Query provider
│   │   └── theme-provider.tsx      # next-themes provider
│   │
│   ├── stores/
│   │   └── auth-store.ts           # Zustand auth (persisted to localStorage)
│   │
│   ├── styles/
│   │   └── globals.css             # Tailwind imports + CSS variables
│   │
│   └── types/
│       └── index.ts                # Shared TypeScript types
│
├── messages/                       # i18n translation files
│   ├── en.json
│   └── vi.json
│
├── docs/
│   └── swagger/
│       └── api.json                # OpenAPI spec → pnpm gen:api reads this
│
├── scripts/
│   ├── build-and-scan.sh           # Docker build + Trivy scan
│   └── trivy-scan.sh               # Scan existing image
│
├── .env.example
├── docker-compose.yml
├── Dockerfile                      # Multi-stage: deps → builder → runner
├── eslint.config.ts
├── next.config.ts
├── postcss.config.js
└── tsconfig.json
```

### Vite 8

```
my-portal/
├── src/
│   ├── routes/                     # TanStack Router (file-based, auto-gen)
│   │   ├── __root.tsx              # Root route layout (QueryClient, providers)
│   │   ├── _authenticated.tsx      # Auth guard layout (redirects if no token)
│   │   ├── _authenticated/
│   │   │   ├── dashboard.tsx
│   │   │   ├── profile.tsx
│   │   │   └── settings.tsx
│   │   ├── (auth)/
│   │   │   └── sign-in.tsx
│   │   └── (errors)/
│   │       └── 404.tsx
│   │
│   ├── routeTree.gen.ts            # Auto-generated (never edit manually)
│   │
│   ├── main.tsx                    # App entry: i18n init + render
│   │
│   ├── components/                 # (same structure as Next.js template)
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── context/
│   │   └── theme-provider.tsx      # next-themes provider (Vite version)
│   │
│   ├── features/                   # (same feature-first structure)
│   │   └── auth/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── schemas/
│   │       └── services/
│   │           ├── auth-api.ts
│   │           └── gen/
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── i18n.ts                 # i18next init with EN/VI resources
│   │   ├── query-client.ts
│   │   └── utils.ts
│   │
│   ├── stores/
│   │   └── auth-store.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── types/
│       └── index.ts
│
├── docs/swagger/api.json
├── scripts/
├── index.html
├── nginx.conf                      # SPA fallback: try_files $uri /index.html
├── vite.config.ts
└── tsconfig.json
```

---

## Design Patterns

### 1. Feature-First Architecture

All domain logic lives inside `src/features/{feature}/`, colocated by domain rather than by type. Each feature is self-contained:

```
features/auth/
├── components/    ← UI components only this feature uses
├── hooks/         ← TanStack Query mutations/queries for this feature
├── schemas/       ← Zod validation schemas
└── services/
    ├── auth-api.ts   ← API calls
    └── gen/          ← Auto-generated API types (pnpm gen:api)
```

**Adding a new feature** (e.g., `users`):
```
features/users/
├── components/user-list.tsx
├── hooks/use-users.ts
├── schemas/user-schema.ts
└── services/users-api.ts
```

### 2. State Layers

| Layer | Tool | Where |
|-------|------|-------|
| Server state | TanStack Query | `features/{x}/hooks/` |
| Global client state | Zustand | `src/stores/` |
| Form state | React Hook Form | inside components |
| URL state | Router params | route components |

**Rule:** Don't put server data in Zustand. Use TanStack Query for anything fetched from an API.

### 3. Auth Store Pattern

The auth store is persisted to `localStorage` via Zustand's `persist` middleware. It exposes:

```ts
// Read state
const { user, isAuthenticated, accessToken } = useAuthStore()

// RBAC checks
const canEdit = useAuthStore(s => s.hasRole('editor'))
const canDelete = useAuthStore(s => s.hasPermission('delete:posts'))

// Mutations
const { login, logout } = useAuthStore()
```

The Axios client reads the token directly from `localStorage` (not React state) so it works outside React context.

### 4. API Client Pattern

```ts
// lib/api-client.ts — one instance, shared everywhere
import apiClient from '@/lib/api-client'

// features/users/services/users-api.ts
export const usersApi = {
  list: () => apiClient.get<User[]>('/users').then(r => r.data),
  create: (data: CreateUserDto) => apiClient.post<User>('/users', data).then(r => r.data),
}
```

The client automatically injects `Authorization: Bearer <token>` and redirects to `/sign-in` on 401.

### 5. Form Pattern (React Hook Form + Zod)

```ts
// 1. Define schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type LoginValues = z.infer<typeof loginSchema>

// 2. Use in component
const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

// 3. Combine with TanStack Query mutation
const { mutate, isPending } = useMutation({ mutationFn: authApi.login })
```

### 6. Component Naming Convention

| Pattern | Usage |
|---------|-------|
| `src/components/ui/` | Shadcn/ui primitives — never modify |
| `src/components/common/` | Shared app components (error boundary, spinner) |
| `src/components/layout/` | Page layout: sidebar, header, page-layout wrapper |
| `src/features/{x}/components/` | Feature-specific components |

### 7. Route Protection

**Next.js:** Route groups with layout files.

```ts
// app/(dashboard)/layout.tsx — redirects if not authenticated
import { redirect } from 'next/navigation'
export default function DashboardLayout({ children }) {
  const isAuthenticated = checkAuth() // server-side check
  if (!isAuthenticated) redirect('/sign-in')
  return <>{children}</>
}
```

**Vite (TanStack Router):** `_authenticated.tsx` layout route.

```ts
// routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) throw redirect({ to: '/sign-in' })
  },
})
```

### 8. i18n Usage

```ts
// Next.js — server & client components
import { useTranslations } from 'next-intl'
const t = useTranslations('auth')
t('signIn.title')

// Vite — client components
import { useTranslation } from 'react-i18next'
const { t } = useTranslation('auth')
t('signIn.title')
```

Translation files live in `messages/` (Next.js) or are inlined in `lib/i18n.ts` (Vite). Add new locales by extending the `locales` array in the config.

---

## Available Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm type-check       # TypeScript check
pnpm format           # Prettier format
pnpm knip             # Find unused code
pnpm gen:api          # Generate types from docs/swagger/api.json
pnpm gen:api:watch    # Watch mode for API generation
pnpm docker:build     # Build image + Trivy security scan
pnpm docker:scan      # Scan existing Docker image
```

---

## API Type Generation

Place your backend OpenAPI spec at `docs/swagger/api.json`, then:

```bash
pnpm gen:api
```

Types are generated into `src/features/auth/services/gen/`. Change the output path in `package.json` `gen:api` script to match your feature.

```ts
import type { LoginRequest, LoginResponse } from '@/features/auth/services/gen'
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**Next.js:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_AUTH_URL=http://localhost:8001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MyApp
```

**Vite:** Same variables but prefixed with `VITE_` and accessed via `import.meta.env.VITE_*`.

---

## Docker

```bash
# Build + scan for vulnerabilities
pnpm docker:build

# Local dev stack
docker-compose up
```

The Dockerfile is multi-stage optimized. Next.js uses `output: 'standalone'`. Vite builds a static bundle served by Nginx.

---

## Monorepo Development (Contributing)

```
.
├── packages/
│   ├── cli/                    # CLI source (tsup → dist/index.js)
│   │   ├── src/
│   │   │   ├── cli.ts          # Commander entry + TTY detection
│   │   │   ├── prompts.ts      # @clack/prompts interactive flow
│   │   │   ├── scaffold.ts     # Copy & customize templates
│   │   │   ├── themes.ts       # 4 color theme CSS definitions
│   │   │   ├── install.ts      # Run pnpm/yarn/bun install
│   │   │   ├── git.ts          # git init + initial commit
│   │   │   └── post-setup.ts   # Print success message
│   │   ├── templates/          # Real dirs (symlinks in dev, copied on publish)
│   │   └── scripts/
│   │       └── copy-templates.mjs  # Replaces symlinks before npm publish
│   ├── template-nextjs/        # Next.js 16 template (source of truth)
│   └── template-vite/          # Vite 8 template (source of truth)
├── pnpm-workspace.yaml
└── turbo.json
```

```bash
# Setup
pnpm install

# Test CLI locally
cd packages/cli && pnpm build
npm link
npm unlink create-pila-app
```

---

**npm:** `doo-boilerplate` | **bin:** `doo-boilerplate` or `create-pila-app`
