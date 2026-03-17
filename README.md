# create-pila-app

> CLI scaffolding tool for Pila portal frontend projects

Quickly scaffold production-ready portal frontends with Next.js 16 (SSR) or Vite 7 (SPA). Includes sensible defaults: authentication, i18n, UI components, state management, and DevOps tooling.

## Quick Start

```bash
# Interactive mode (recommended)
npx create-pila-app

# Non-interactive (CI/CD)
npx create-pila-app my-portal --framework nextjs --pm pnpm --auth jwt --no-install
```

## Usage

### Interactive Mode

Run without arguments to be guided through options:

```bash
npx create-pila-app
```

You'll be prompted for:
- Project name
- Framework (Next.js 16 or Vite 7)
- Package manager (npm, yarn, pnpm, bun, deno)
- Optional features (editor, charts, drag-drop, Sentry)
- Authentication type (JWT, OAuth, none)
- Dependency installation

### Non-Interactive Mode (CI/CD)

Provide all options via flags:

```bash
npx create-pila-app my-app --framework vite --pm bun --features editor,charts --auth oauth --no-install
```

### CLI Options

| Flag | Values | Default | Notes |
|------|--------|---------|-------|
| `[project-name]` | string | prompt | Directory name for new project |
| `--framework` | `nextjs`, `vite` | prompt | SSR or SPA |
| `--pm` | `npm`, `yarn`, `pnpm`, `bun`, `deno` | prompt | Package manager to use |
| `--features` | comma-separated list | none | See [Optional Features](#optional-features) |
| `--auth` | `jwt`, `oauth`, `none` | prompt | Authentication method |
| `--no-install` | — | false | Skip `pnpm install` |
| `--no-git` | — | false | Skip `git init` |

## Templates

### Next.js 16 (Recommended for SSR)

Server-side rendering with App Router, ideal for SEO-heavy portals.

**Key features:**
- Next.js 16 with Turbopack (dev) and SWC (build)
- App Router with layouts
- `next-intl` for i18n with middleware
- `next-themes` for dark mode toggle
- Static and dynamic rendering strategies
- Built-in API routes (optional)

**Best for:** Public-facing portals, multi-language sites, SEO requirements.

### Vite 7 (Recommended for SPA)

Client-side rendering with TanStack Router, ideal for internal tools and single-page apps.

**Key features:**
- Vite 7 with lightning-fast HMR
- TanStack Router with file-based routing
- `i18next` for i18n with auto-detection
- `react-top-loading-bar` for UX feedback
- Nginx config for SPA deployment

**Best for:** Internal portals, admin dashboards, real-time applications.

### Feature Comparison

| Feature | Next.js | Vite |
|---------|---------|------|
| Rendering | SSR + ISR + SSG | CSR (SPA) |
| Routing | App Router (framework) | TanStack Router (library) |
| I18n | `next-intl` | `i18next` |
| Learning curve | Steeper | Gentler |
| Bundle size (baseline) | ~200KB | ~80KB |
| SEO out-of-box | Yes | No (CSR) |
| API routes | Yes | No |
| Deployment | Vercel / Node servers | Any static host + Nginx |

## What's Included

### All Templates

**UI & Styling:**
- Shadcn/ui component library
- Radix UI primitives
- Tailwind CSS 4 with custom theme
- Dark mode via `next-themes`

**State & Forms:**
- Zustand 5 for global state
- TanStack Query 5 for server state
- React Hook Form with Zod validation
- Axios with JWT auth interceptors

**Internationalization (i18n):**
- English (EN) and Vietnamese (VI) by default
- Lazy-load additional languages
- Next.js: server-side translation with `next-intl`
- Vite: browser-side translation with `i18next`

**Authentication:**
- JWT store with refresh token persistence
- RBAC (role-based access control) utilities
- JWT decode for claims
- OAuth scaffolding when selected

**Developer Experience:**
- ESLint 9 with flat config
- Prettier with import sorting
- Husky + lint-staged for pre-commit hooks
- Knip for unused code detection
- TypeScript strict mode

**DevOps:**
- Multi-stage Docker (optimized for size)
- Docker Compose for local development
- GitHub Actions CI (lint, type-check)
- Weekly Trivy security scans

### Optional Features

Add via `--features editor,charts,dnd,sentry`:

#### `editor` — Rich Text Editor
- Tiptap with Markdown support
- Configurable toolbar (bold, italic, links, etc.)
- Output as HTML or JSON

#### `charts` — Data Visualization
- ECharts for complex dashboards
- Recharts for composable React components
- Choose based on your needs

#### `dnd` — Drag & Drop
- @dnd-kit for accessible, performant drag-drop
- Pre-configured sortable lists
- Customize constraints and animations

#### `sentry` — Error Tracking
- Sentry integration with source maps
- Auto-capture unhandled errors
- Session replay in production

## Package Managers

Scaffolded projects support all modern package managers:

```bash
# Install dependencies
pnpm install      # Recommended (fastest, monorepo-ready)
npm install
yarn install
bun install
deno cache

# Run dev server
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm preview      # Vite only
npm start         # Next.js only
```

## Project Structure

### Next.js 16

```
my-portal/
├── src/
│   ├── app/                    # App Router pages & layouts
│   │   ├── (auth)/             # Auth layout group
│   │   ├── (dashboard)/        # Dashboard layout group
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable React components
│   │   └── ui/                 # Shadcn/ui components
│   ├── features/               # Feature-specific logic
│   │   ├── auth/
│   │   │   └── services/gen/   # Generated API types
│   │   └── dashboard/
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization config
│   ├── lib/                    # Utilities (cn, validators, etc.)
│   ├── middleware.ts           # Next.js middleware
│   ├── providers/              # Client context providers
│   ├── stores/                 # Zustand stores
│   ├── styles/                 # Global CSS
│   └── types/                  # TypeScript types
├── docs/
│   └── swagger/
│       └── api.json            # Swagger spec for gen:api
├── scripts/
│   ├── build-and-scan.sh       # Docker build + Trivy scan
│   └── trivy-scan.sh           # Security scan existing image
├── .env.example                # Environment variables template
├── docker-compose.yml          # Local development stack
├── Dockerfile                  # Multi-stage production build
├── eslint.config.ts            # ESLint flat config
├── next.config.ts              # Next.js configuration
├── package.json
├── postcss.config.js           # Tailwind CSS
├── tsconfig.json               # TypeScript config
└── README.md
```

### Vite 7

```
my-portal/
├── src/
│   ├── routes/                 # TanStack Router routes
│   │   ├── __root.tsx          # Root route layout
│   │   ├── index.tsx           # Homepage
│   │   ├── auth/
│   │   │   └── login.tsx
│   │   └── dashboard/
│   ├── routeTree.gen.ts        # Auto-generated route tree
│   ├── main.tsx                # App entry point
│   ├── components/             # Reusable React components
│   │   └── ui/                 # Shadcn/ui components
│   ├── features/               # Feature-specific logic
│   │   ├── auth/
│   │   │   └── services/gen/   # Generated API types
│   │   └── dashboard/
│   ├── hooks/                  # Custom React hooks
│   ├── context/                # React context providers
│   ├── lib/                    # Utilities (cn, validators, etc.)
│   ├── stores/                 # Zustand stores
│   ├── styles/                 # Global CSS
│   ├── types/                  # TypeScript types
│   └── routeTree.gen.ts        # Generated by @tanstack/router-plugin
├── docs/
│   └── swagger/
│       └── api.json            # Swagger spec for gen:api
├── scripts/
│   ├── build-and-scan.sh       # Docker build + Trivy scan
│   └── trivy-scan.sh           # Security scan existing image
├── .env.example                # Environment variables template
├── docker-compose.yml          # Local development stack
├── Dockerfile                  # Multi-stage production build
├── nginx.conf                  # SPA Nginx routing config
├── eslint.config.ts            # ESLint flat config
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── package.json
├── tsconfig.json               # TypeScript config
└── README.md
```

## API Code Generation

Generate TypeScript types from your backend Swagger/OpenAPI spec.

### Setup

1. Place your Swagger spec at `docs/swagger/api.json`:

```bash
curl https://api.example.com/swagger.json > docs/swagger/api.json
```

2. Run generator:

```bash
pnpm gen:api
```

This generates types in `src/features/auth/services/gen/` (customize in `package.json` `gen:api` script).

3. Use generated types:

```typescript
import type { LoginRequest, LoginResponse } from '@/features/auth/services/gen'

async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await axios.post('/auth/login', payload)
  return data
}
```

### Watch Mode

For active API development:

```bash
pnpm gen:api:watch
```

Regenerates types whenever `docs/swagger/api.json` changes.

## Docker Deployment

### Build & Scan

```bash
pnpm docker:build
```

This:
1. Builds Docker image with multi-stage optimization
2. Scans image with Trivy for vulnerabilities
3. Prints summary (HIGH/CRITICAL issues only)

### Custom Scan

```bash
pnpm docker:scan <image-name>
```

### Run Locally

```bash
docker-compose up
# App runs on http://localhost:3000
```

### Environment Variables

Configure via `.env` file (copy from `.env.example`):

**Next.js:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_AUTH_URL=http://localhost:8001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MyApp
```

**Vite:**
- Same vars but read via `import.meta.env.VITE_*`
- Prefix non-public vars with `VITE_` in `.env`

## Development (Contributing to Boilerplate)

Working on the boilerplate itself?

### Setup

```bash
# Install workspace dependencies
pnpm install

# Build all packages
pnpm build

# Watch mode for CLI development
cd packages/cli
pnpm dev
```

### Test CLI Locally

```bash
cd packages/cli
pnpm build

# Link for global usage
npm link

# Test scaffolding
create-pila-app test-project --framework nextjs --pm pnpm --no-install

# Unlink when done
npm unlink create-pila-app
```

### Project Structure

```
.
├── packages/
│   ├── cli/                    # Main CLI entry point
│   │   ├── src/
│   │   │   ├── cli.ts          # Commander setup
│   │   │   ├── prompts.ts      # @clack/prompts flow
│   │   │   ├── scaffold.ts     # Copy & customize templates
│   │   │   ├── install.ts      # Run pnpm/npm/yarn/bun
│   │   │   ├── git.ts          # git init & initial commit
│   │   │   └── utils/          # Validators, helpers
│   │   └── templates/          # Symlinks or embedded templates
│   ├── template-nextjs/        # Next.js 16 template
│   ├── template-vite/          # Vite 7 template
│   └── ui-kit/                 # Shared UI components (optional)
├── pnpm-workspace.yaml         # Workspace config
├── turbo.json                  # Turborepo config
└── README.md                   # This file
```

### Workspace Commands

```bash
pnpm build           # Build all packages
pnpm dev             # Dev all packages
pnpm lint            # Lint all packages
pnpm type-check      # Type-check all packages
pnpm format          # Format with Prettier
```

---

**Questions?** See [Next.js Template README](./packages/template-nextjs/README.md) or [Vite Template README](./packages/template-vite/README.md).
