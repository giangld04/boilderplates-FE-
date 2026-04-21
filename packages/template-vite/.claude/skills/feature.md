# Implement a Feature

Use this prompt to implement a new feature module in this project.

## Prompt

```
Implement the feature: [FEATURE_NAME]

Context:
- Read CLAUDE.md for project conventions
- Feature dir: src/features/[name]/
- Route: src/routes/_authenticated/[name].tsx
- Nav: src/components/layout/sidebar.tsx

Steps:
1. Create src/features/[name]/ with:
   - types/[name].types.ts — TypeScript interfaces
   - schemas/[name].schema.ts — zod validation schemas
   - data/use-[name].ts — TanStack Query hooks
   - components/[name]-list.tsx — list view using DataTable
   - components/[name]-form.tsx — create/edit form
2. Add route file at src/routes/_authenticated/[name].tsx
3. Register nav item in src/components/layout/sidebar.tsx
4. Wire API calls through src/lib/api-client.ts

After implementation:
- Run: pnpm lint && pnpm type-check
- Fix any lint/type errors before finishing
- Follow conventional commits: feat([name]): add [description]
```
