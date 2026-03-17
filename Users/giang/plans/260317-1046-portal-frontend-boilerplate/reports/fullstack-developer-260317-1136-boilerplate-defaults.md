# Phase Implementation Report

## Executed Phase
- Phase: boilerplate-defaults
- Plan: /Users/giang/plans/260317-1046-portal-frontend-boilerplate
- Status: completed

## Files Modified

### CLI
- `packages/cli/src/prompts.ts` — expanded PackageManager to 5 options; removed i18n/dark-mode from Feature type and multiselect; updated non-TTY validation
- `packages/cli/src/install.ts` — support all 5 PMs (npm/yarn/pnpm/bun/deno); deno gets `--node-modules-dir`
- `packages/cli/src/cli.ts` — updated `--pm` and `--features` help text
- `packages/cli/src/post-setup.ts` — fixed `runCmd` to show correct PM-specific dev command

### Next.js template
- `packages/template-nextjs/package.json` — added `next-intl ^4.3.4`, `next-themes ^0.4.6`; updated gen:api scripts; added gen:api:watch, docker:build, docker:scan scripts
- `packages/template-nextjs/src/i18n/config.ts` — new file: locales config (en/vi)
- `packages/template-nextjs/src/providers/theme-provider.tsx` — new file: ThemeProvider using next-themes
- `packages/template-nextjs/src/providers/app-providers.tsx` — wrapped with ThemeProvider
- `packages/template-nextjs/src/components/common/theme-toggle.tsx` — new file: Sun/Moon toggle button
- `packages/template-nextjs/docs/swagger/api.json` — new file: minimal OpenAPI 3.0 spec
- `packages/template-nextjs/scripts/trivy-scan.sh` — new file, executable
- `packages/template-nextjs/scripts/build-and-scan.sh` — new file, executable

### Vite template
- `packages/template-vite/package.json` — added `i18next ^25.2.1`, `react-i18next ^15.5.2`, `i18next-browser-languagedetector ^8.0.5`, `next-themes ^0.4.6`; updated gen:api scripts; added gen:api:watch, docker:build, docker:scan scripts
- `packages/template-vite/src/lib/i18n.ts` — new file: i18next config with en/vi translations
- `packages/template-vite/src/context/theme-provider.tsx` — new file: ThemeProvider wrapper
- `packages/template-vite/src/main.tsx` — added `import '@/lib/i18n'` and ThemeProvider wrap
- `packages/template-vite/src/components/common/theme-toggle.tsx` — new file: Sun/Moon toggle button
- `packages/template-vite/docs/swagger/api.json` — new file: minimal OpenAPI 3.0 spec
- `packages/template-vite/scripts/trivy-scan.sh` — new file, executable
- `packages/template-vite/scripts/build-and-scan.sh` — new file, executable

## Tasks Completed
- [x] Expand PackageManager type: npm | yarn | pnpm | bun | deno
- [x] Update install.ts for all 5 PMs (deno uses --node-modules-dir)
- [x] Next.js: add next-intl dep + src/i18n/config.ts
- [x] Vite: add i18next deps + src/lib/i18n.ts + import in main.tsx
- [x] Next.js: add next-themes dep + theme-provider + wrap AppProviders + ThemeToggle
- [x] Vite: add next-themes dep + context/theme-provider + wrap main.tsx + ThemeToggle
- [x] Both templates: docs/swagger/api.json (OpenAPI 3.0.3 minimal spec)
- [x] Both templates: updated gen:api path + added gen:api:watch, docker:build, docker:scan scripts
- [x] Both templates: scripts/trivy-scan.sh + scripts/build-and-scan.sh (chmod +x)
- [x] Remove i18n and dark-mode from Feature type and CLI multiselect
- [x] Rebuild CLI: pnpm build success
- [x] E2E test: vite/npm/charts, nextjs/pnpm/sentry, vite/deno — all pass

## Tests Status
- Type check: pass (tsup build clean)
- Unit tests: N/A (CLI has no test suite)
- E2E scaffold tests: pass — verified all output files and package.json contents

## Issues Encountered
None. All changes applied cleanly.

## Next Steps
- Optional: remove now-redundant `optional/i18n` and `optional/dark-mode` dirs from templates if desired
- Optional: update `generate/` dir documentation to point to `docs/swagger/` path
