# Debug an Issue

Use this prompt to systematically debug a problem in this project.

## Prompt

```
Debug this issue: [DESCRIBE THE BUG]

Steps:
1. Reproduce — identify exact steps to trigger the issue
2. Locate — search relevant files:
   - Error in UI? → src/features/ or src/components/
   - API error? → src/lib/api-client.ts, src/features/*/data/
   - Route issue? → src/routes/, routeTree.gen.ts
   - State issue? → src/stores/
3. Read error — check browser console / Sentry for stack trace
4. Root cause — trace the call chain, identify the failing assertion
5. Fix — minimal change, do not refactor unrelated code
6. Verify:
   - pnpm lint && pnpm type-check
   - Manually test the fixed flow
7. Commit: fix([scope]): [what was broken and how fixed]
```
