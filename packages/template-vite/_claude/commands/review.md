# Code Review

Use this prompt to review code changes in this project.

## Prompt

```
Review the following code changes: [FILE(S) OR DIFF]

Checklist:
- [ ] TypeScript types are explicit (no `any` unless justified)
- [ ] Error handling: API calls wrapped in try/catch or TanStack Query error state
- [ ] Naming: kebab-case files, camelCase vars, PascalCase components
- [ ] No unused imports/exports (run `pnpm knip` to verify)
- [ ] Zod schemas match API response shape
- [ ] No hardcoded strings — use i18n keys or constants
- [ ] No secrets or API keys in code
- [ ] lint-staged passes: pnpm lint && pnpm format:check
- [ ] Type check passes: pnpm type-check
- [ ] Follows feature-based structure in src/features/

Rate each: Pass / Warn / Fail
Summary: overall assessment + top 3 issues to fix
```
