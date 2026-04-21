# create-pila-app

> CLI scaffolding tool for production-ready Vite + React admin portals

Scaffold a complete admin panel in seconds — authentication, data tables, dark mode, i18n, API integration, security scanning, and AI-assisted development workflow included by default.

---

## Quick Start

```bash
# Interactive
npx create-pila-app

# With project name
npx create-pila-app my-app

# Alternative alias
npx doo-boilerplate my-app
```

Then:
```bash
cd my-app
pnpm install
pnpm dev
```

> **Demo account:** `demo@gmail.com` / `demo` — works without a backend.

---

## What You Get

### Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Vite 8 + React 19 + TypeScript 5 |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query 5 |
| Tables | TanStack Table 8 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State | Zustand 5 |
| Forms | react-hook-form + zod |
| HTTP | Axios (with auth interceptor) |
| i18n | i18next + react-i18next (EN/VI) |
| Error tracking | Sentry |
| Security | Trivy container scanning |

### DX & Tooling

| Tool | Purpose |
|------|---------|
| Husky 9 | Git hooks (pre-commit, commit-msg) |
| lint-staged | ESLint + Prettier on commit |
| commitlint | Conventional commits enforcement |
| ESLint 9 | Flat config + TypeScript + React hooks |
| Prettier 3 | Code formatting + import sorting |
| Knip | Unused exports/deps detection |
| Docker | Multi-stage production build |
| GitHub Actions | CI (lint → type-check → build) + weekly security audit |

### AI-Assisted Development

Every scaffolded project includes:

- **`CLAUDE.md`** — loaded automatically by Claude Code every session. Contains tech stack, project structure, dev commands, library-specific rules, API patterns, and anti-patterns.
- **`.claude/commands/`** — project-level slash commands:
  - `/feature` — implement a new feature module
  - `/debug` — systematic debug workflow
  - `/review` — code review checklist
  - `/plan` — plan before coding

---

## Project Structure

```
my-app/
├── src/
│   ├── routes/              # File-based routes (TanStack Router)
│   │   ├── __root.tsx
│   │   ├── _authenticated.tsx
│   │   ├── _authenticated/
│   │   │   ├── dashboard.tsx
│   │   │   ├── users.tsx
│   │   │   └── settings.tsx
│   │   └── (auth)/sign-in.tsx
│   ├── features/            # Domain modules
│   │   ├── auth/            # Authentication (sign-in, session)
│   │   ├── users/           # User management
│   │   │   ├── services/    # users-api.ts (axios calls)
│   │   │   ├── hooks/       # use-users.ts (TanStack Query)
│   │   │   ├── components/  # UsersTable, UserFormDialog
│   │   │   ├── schemas/     # zod validation
│   │   │   └── types/       # TypeScript interfaces
│   │   ├── tasks/           # Task management (same structure)
│   │   ├── dashboard/       # Charts and stats
│   │   └── settings/        # Account, profile, appearance
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── data-table/      # Reusable DataTable with sorting/filtering/pagination
│   │   └── layout/          # Sidebar, Header, PageLayout
│   ├── lib/
│   │   ├── api-client.ts    # Axios instance (auto-attaches Bearer token)
│   │   ├── query-client.ts  # TanStack Query config
│   │   └── utils.ts         # cn() and helpers
│   ├── stores/              # Zustand stores
│   └── types/               # Shared TypeScript types
├── .claude/
│   └── commands/            # Claude Code slash commands
├── .husky/                  # Git hooks
├── .github/workflows/       # CI + security audit
├── scripts/
│   ├── trivy-scan.sh        # Container security scan
│   └── build-and-scan.sh
├── CLAUDE.md                # AI development guidance
└── commitlint.config.ts
```

---

## API Integration

The template ships with a complete API integration pattern. Replace the endpoints with your backend:

```typescript
// src/features/users/services/users-api.ts
export const usersApi = {
  list: (params?: UserListParams) =>
    apiClient.get('/users', { params }).then(r => r.data),
  create: (data: CreateUserPayload) =>
    apiClient.post('/users', data).then(r => r.data),
  update: (id, data) =>
    apiClient.put(`/users/${id}`, data).then(r => r.data),
  delete: (id) =>
    apiClient.delete(`/users/${id}`),
}

// src/features/users/hooks/use-users.ts
export function useUsers(params?) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params),
  })
}
```

### Environment Variables

```bash
# .env (copy from .env.example)
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=my-app

# Optional
VITE_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

## Dev Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript check + production build
pnpm lint          # ESLint
pnpm lint:fix      # ESLint auto-fix
pnpm type-check    # tsc --noEmit
pnpm format        # Prettier write
pnpm knip          # Detect unused code
pnpm docker:build  # Build Docker image + Trivy scan
pnpm docker:scan   # Trivy security scan only
```

---

## Adding a Feature

1. Create `src/features/{name}/` with: `types/`, `schemas/`, `services/`, `hooks/`, `components/`
2. Add `services/{name}-api.ts` with axios calls
3. Add `hooks/use-{name}.ts` with TanStack Query hooks
4. Add route at `src/routes/_authenticated/{name}.tsx`
5. Add nav item in `src/components/layout/sidebar.tsx`

Or use the Claude Code slash command: `/feature`

---

## Git Workflow

Conventional commits are enforced automatically:

```bash
git commit -m "feat(users): add bulk delete"   # ✅
git commit -m "fix(auth): handle expired token" # ✅
git commit -m "updated stuff"                   # ❌ rejected by commitlint
```

Pre-commit runs ESLint + Prettier automatically via lint-staged.

---

## Security

- **Trivy** scans the Docker image for HIGH/CRITICAL CVEs (`pnpm docker:scan`)
- **GitHub Actions** runs `pnpm audit --audit-level=high` weekly
- Auth tokens stored in localStorage, auto-cleared on 401
- No secrets committed — `.env` is gitignored

---

## Requirements

- Node.js ≥ 20.19.0
- pnpm ≥ 10

---

## License

MIT
