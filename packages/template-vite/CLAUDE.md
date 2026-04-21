# {{PROJECT_NAME}}

This file provides guidance to Claude Code when working in this project.

## Tech Stack

- Vite 8, React 19, TypeScript 5
- Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- TanStack Router (file-based routing), TanStack Query, TanStack Table
- Zustand (global state), react-hook-form + zod (forms)
- i18next (internationalization), Sentry (error tracking), Axios (HTTP)

## Project Structure

```
src/
  routes/        # file-based routes — auto-generates routeTree.gen.ts
  features/      # feature modules: components/, hooks/, types/, schemas/, data/
  components/
    ui/          # shadcn/ui components
    data-table/  # reusable DataTable
    layout/      # Sidebar, Header, PageLayout
  lib/           # api-client, query-client, sentry, utils
  stores/        # Zustand stores
  config/        # app configuration
  context/       # React contexts
  hooks/         # shared hooks
  types/         # shared types
```

## Dev Commands

```bash
pnpm dev           # start dev server
pnpm build         # TypeScript check + Vite build
pnpm lint          # ESLint check
pnpm lint:fix      # ESLint auto-fix
pnpm type-check    # tsc --noEmit
pnpm format        # Prettier write
pnpm format:check  # Prettier check
pnpm knip          # detect unused exports/deps
pnpm docker:build  # build Docker image + Trivy scan
pnpm docker:scan   # Trivy security scan only
```

## Code Conventions

- **File naming:** kebab-case
- **Feature structure:** group by domain in `src/features/{name}/`
- **Commits:** conventional commits enforced by commitlint + Husky
- **Pre-commit:** ESLint + Prettier run automatically via lint-staged
- **Routes:** auto-discovered — create file in `src/routes/`, run `pnpm dev` to regenerate

## Adding a Feature

1. Create `src/features/{name}/` with: `types/`, `schemas/`, `components/`, `data/`
2. Add route at `src/routes/_authenticated/{name}.tsx`
3. Add nav item in `src/components/layout/sidebar.tsx`
4. Use `DataTable` from `src/components/data-table/` for list views
5. Use TanStack Query hooks + `src/lib/api-client.ts` for API calls

## Environment Variables

Copy `.env.example` to `.env`. Key vars:
- `VITE_SENTRY_DSN` — Sentry DSN (optional)

## Library-Specific Rules

### Tailwind CSS v4
- No `tailwind.config.js` — config lives in CSS via `@theme` block
- Use `@utility` to define custom utilities, NOT `@apply` for component styles
- CSS variables for design tokens: `var(--color-primary)`, `var(--spacing-4)`
- Import: `import '@/styles/globals.css'` (single entry, no per-component imports)
- Dark mode: use `dark:` variant, toggled via `next-themes` `ThemeProvider`

### TanStack Router
- File-based routing only — create files in `src/routes/`, never manually edit `routeTree.gen.ts`
- Every route file must export via `createFileRoute('...')` — path must match filename exactly
- Authenticated routes go under `src/routes/_authenticated/` (wrapped by auth layout)
- Navigation: `useNavigate()` hook or `<Link to="...">`, never `window.location`
- Params: `const { id } = Route.useParams()`, search: `Route.useSearch()`
- Lazy load heavy routes: `export const Route = createLazyFileRoute(...)`

### TanStack Query
- Prefer `useSuspenseQuery` over `useQuery` — wrap route component in `<Suspense>`
- Query keys: array format `['resource', id]` or `['resource', 'list', filters]`
- Mutations: `useMutation` + `onSuccess: () => queryClient.invalidateQueries(...)`
- Global config in `src/lib/query-client.ts` — do not create new QueryClient instances
- All API calls go through `src/lib/api-client.ts` (axios instance with auth headers)

### shadcn/ui
- Components live in `src/components/ui/` — do not edit them directly
- Add new components: `pnpm dlx shadcn@latest add <component>`
- Compose with Radix primitives when shadcn doesn't have what you need
- Use `cn()` from `src/lib/utils.ts` for conditional class merging (not `clsx` directly)

### react-hook-form + zod
- Always define schema with `z.object({...})` in `src/features/{name}/schemas/`
- Use `useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })`
- Never use uncontrolled inputs — always register with `{...register('field')}`

## Claude AI Workflow

- Always run `pnpm lint && pnpm type-check` after code changes
- Follow conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
