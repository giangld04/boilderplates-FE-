# {{PROJECT_NAME}}

> Next.js 16 server-side rendered portal frontend

Production-ready Next.js 16 application with App Router, i18n, dark mode, authentication, and DevOps integration.

## Quick Start

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm type-check` | TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting without changes |
| `pnpm knip` | Find unused files/exports |
| `pnpm gen:api` | Generate types from Swagger spec |
| `pnpm gen:api:watch` | Watch mode for API generation |
| `pnpm docker:build` | Build & scan Docker image |
| `pnpm docker:scan` | Security scan image with Trivy |

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS 4 + Shadcn/ui
- **i18n:** next-intl (EN/VI built-in)
- **State:** Zustand 5 (global) + TanStack Query 5 (server)
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios with JWT interceptors
- **Auth:** JWT store with refresh token persistence
- **DevOps:** Docker (multi-stage) + Trivy security scan

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Key variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_AUTH_URL=http://localhost:8001

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME={{PROJECT_NAME}}
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth layout group (login, register)
│   ├── (dashboard)/         # Protected layout group
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # Shadcn/ui components
│   └── **/                  # Feature-specific components
├── features/
│   ├── auth/
│   │   ├── hooks/
│   │   ├── stores/          # Zustand auth store
│   │   ├── services/
│   │   │   └── gen/         # Generated API types (gen:api)
│   │   └── types/
│   └── **/
├── hooks/                   # Custom React hooks
├── i18n/
│   ├── request.ts           # Server-side i18n setup
│   ├── routing.ts           # Route configuration
│   └── translations/        # Message files
├── lib/
│   ├── cn.ts                # Tailwind merge utility
│   ├── http.ts              # Axios instance
│   └── **/
├── middleware.ts            # next-intl middleware
├── providers/
│   ├── ClientProvider.tsx    # Client-side providers
│   └── ThemeProvider.tsx     # next-themes setup
├── stores/                  # Zustand stores
├── styles/
│   ├── globals.css
│   └── variables.css        # CSS variables
└── types/
    └── index.ts
```

## API Code Generation

Generate TypeScript types from backend Swagger spec:

```bash
# Place spec at docs/swagger/api.json
curl https://api.example.com/swagger.json > docs/swagger/api.json

# Generate types
pnpm gen:api

# Watch mode during API development
pnpm gen:api:watch
```

Generated types appear in `src/features/auth/services/gen/`.

## Docker Deployment

### Build & Scan

```bash
pnpm docker:build
```

Builds optimized multi-stage image and scans for vulnerabilities with Trivy.

### Local Development

```bash
docker-compose up
# App runs on http://localhost:3000
```

Environment variables read from `.env` file.

### Production Build

```bash
docker build -t my-app:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com .

docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  my-app:latest
```

## Next.js App Router Basics

### Routing

Routes defined by file structure in `src/app/`:

```
app/
├── page.tsx           → /
├── about/
│   └── page.tsx       → /about
└── (auth)/
    ├── login/
    │   └── page.tsx   → /login
    └── register/
        └── page.tsx   → /register
```

Parentheses `(auth)` create layout groups without affecting URL.

### Server & Client Components

By default, all components are **Server Components** (run on server):

```typescript
// src/app/page.tsx (Server Component)
export default function Home() {
  return <h1>SSR rendered on server</h1>
}
```

For client-side logic, add `'use client'`:

```typescript
// src/components/Counter.tsx (Client Component)
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Layouts

Create shared layouts for route groups:

```typescript
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>Sidebar</nav>
      <main>{children}</main>
    </div>
  )
}
```

---

**Learn more:** [Next.js Docs](https://nextjs.org/docs)
