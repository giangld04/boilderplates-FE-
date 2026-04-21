# Plan an Implementation

Use this prompt to plan a feature or change before writing code.

## Prompt

```
Plan the implementation for: [FEATURE OR CHANGE]

Steps:
1. Read CLAUDE.md for project context and conventions
2. Analyze requirements — list what needs to be built
3. Identify affected files:
   - New feature? → src/features/[name]/
   - New route? → src/routes/_authenticated/
   - Shared component? → src/components/
   - API change? → src/lib/api-client.ts
4. Define phases (if complex):
   - Phase 1: types + schemas
   - Phase 2: API hooks (TanStack Query)
   - Phase 3: UI components
   - Phase 4: route + nav integration
5. Success criteria:
   - pnpm lint && pnpm type-check pass
   - Feature works end-to-end
   - No regressions in existing routes
6. Risks: list potential blockers or edge cases

Output: numbered implementation steps ready to execute
```
