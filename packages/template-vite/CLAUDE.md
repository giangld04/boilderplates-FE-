# CLAUDE.md

This file provides guidance to Claude Code when working in this project.

## Tech Stack
- React 19, TypeScript, Vite 8
- TanStack Router (file-based routing) — add routes in `src/routes/`
- TanStack Query — data fetching via `useQuery`/`useMutation`
- TanStack Table — data tables via `src/components/data-table/`
- Tailwind CSS 4 + shadcn/ui components in `src/components/ui/`
- Zustand — global state in `src/stores/`
- react-hook-form + zod — forms with validation
- Sentry — error tracking (set `VITE_SENTRY_DSN` in `.env`)

## Project Structure
- `src/routes/` — file-based routes (TanStack Router auto-generates `routeTree.gen.ts`)
- `src/features/` — feature modules (each has components/, hooks/, types/, schemas/, data/)
- `src/components/ui/` — shadcn/ui components
- `src/components/data-table/` — reusable DataTable components
- `src/components/layout/` — Sidebar, Header, PageLayout
- `src/lib/` — utilities (api-client, query-client, sentry, utils)
- `src/stores/` — Zustand stores

## Development Commands
```bash
pnpm dev          # start dev server
pnpm build        # build for production
pnpm type-check   # TypeScript check
pnpm lint         # ESLint
```

## Adding a New Feature Module
1. Create `src/features/{name}/` with: types/, schemas/, components/, data/
2. Add route at `src/routes/_authenticated/{name}.tsx`
3. Add nav item in `src/components/layout/sidebar.tsx`
4. Use `DataTable` from `src/components/data-table/data-table.tsx` for list views

## Adding New Routes
Routes are auto-discovered. Create a file in `src/routes/` and run `pnpm dev` to regenerate `routeTree.gen.ts`.

## API Integration
Replace mock data in `src/features/*/data/` with real API calls using `src/lib/api-client.ts` (axios).
Use TanStack Query hooks for data fetching.

## Environment Variables
Copy `.env.example` to `.env` and fill in values.
`VITE_SENTRY_DSN` — Sentry DSN for error tracking (optional)
