# Phase 01: Simplify CLI

## Context Links
- Current CLI: `packages/cli/src/cli.ts`
- Prompts: `packages/cli/src/prompts.ts`
- Scaffold: `packages/cli/src/scaffold.ts`
- Themes: `packages/cli/src/themes.ts`
- Post-setup: `packages/cli/src/post-setup.ts`

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Strip CLI down to only project name + package manager. Remove framework, theme, features, auth selection. All features baked in by default.

## Key Insights
- Current CLI has 5 interactive prompts: name, framework, pm, features, auth, theme
- After rebuild: 2 prompts max (name, pm) -- or just name if `--pm` flag provided
- `scaffold.ts` uses `optional/` directory to merge features -- will be removed since everything is included
- `themes.ts` has 4 themes -- keep file but hardcode violet as default

## Requirements

### Functional
- CLI only prompts for project name (default: `my-portal`)
- CLI only prompts for package manager (default: `pnpm`)
- `--pm` flag still works to skip pm prompt
- `--no-git` flag still works
- All features (sentry, charts) included by default
- JWT auth included by default
- Violet theme applied by default

### Non-functional
- CLI runs in <2s for non-interactive mode
- Clean, minimal terminal output

## Related Code Files

### Files to Modify
- `packages/cli/src/cli.ts` -- remove --framework, --features, --auth, --theme flags
- `packages/cli/src/prompts.ts` -- remove framework/features/auth/theme prompts, simplify types
- `packages/cli/src/scaffold.ts` -- remove optional feature logic, hardcode theme, merge all deps into base
- `packages/cli/src/themes.ts` -- keep but simplify (only export violet getter, or make `getThemeCss` default to violet)
- `packages/cli/src/post-setup.ts` -- minor: remove references to optional features in success msg if any

### Files to Modify (Template)
- `packages/template-vite/package.json` -- merge sentry + recharts deps directly into dependencies
- Remove `packages/template-vite/optional/` directory entirely

### Files to Delete
- `packages/template-vite/optional/charts/deps.json`
- `packages/template-vite/optional/sentry/deps.json`
- `packages/template-vite/optional/editor/deps.json`
- `packages/template-vite/optional/dnd/deps.json`
- `packages/template-vite/optional/dark-mode/deps.json`
- `packages/template-vite/optional/i18n/deps.json`
- Entire `packages/template-vite/optional/` directory

## Implementation Steps

### 1. Simplify `ProjectOptions` type in `prompts.ts`
```typescript
export interface ProjectOptions {
  projectName: string
  packageManager: PackageManager
}
```
Remove `Feature`, `CliDefaults.framework/features/auth/theme` fields.

### 2. Simplify `collectOptions` in `prompts.ts`
- Remove framework prompt (lines 76-92)
- Remove features prompt (lines 115-137)
- Remove theme prompt (lines 139-159)
- Remove auth prompt (lines 161-179)
- Keep only project name prompt (lines 52-73) and package manager prompt (lines 94-113)
- Non-interactive fallback: only needs name + pm

### 3. Update `cli.ts`
- Remove `.option('--framework <framework>', ...)`
- Remove `.option('--features <features>', ...)`
- Remove `.option('--auth <auth>', ...)`
- Remove `.option('--theme <theme>', ...)`
- Update `collectOptions` call to only pass `projectName` and `pm`
- Keep `.option('--pm <pm>', ...)` and `.option('--no-git', ...)`

### 4. Update `scaffold.ts`
- Remove `options.framework` check -- always use `template-vite`
- Remove `applyFeature` function entirely
- Remove the loop over `options.features`
- Hardcode theme: call `getThemeCss('violet', 'vite')` directly
- Remove import of `Feature` type

### 5. Merge deps into template package.json
Add to `packages/template-vite/package.json` dependencies:
```json
"recharts": "^2.15.1",
"@sentry/react": "^9.19.0"
```
Add to devDependencies:
```json
"@sentry/vite-plugin": "^2.22.7"
```
Remove `echarts` and `echarts-for-react` (use recharts only).

### 6. Delete `optional/` directory
```bash
rm -rf packages/template-vite/optional/
```

### 7. Update `post-setup.ts`
- Remove any feature-specific messaging
- Simplify the type usage to match new `ProjectOptions`

### 8. Simplify `themes.ts`
- Keep all theme definitions (future-proofing) but the scaffold only uses violet
- Alternatively: export a `getDefaultThemeCss()` that returns violet for vite

## Todo List
- [ ] Update `ProjectOptions` interface in `prompts.ts`
- [ ] Strip `collectOptions` to name + pm only
- [ ] Remove CLI flags in `cli.ts`
- [ ] Simplify `scaffold.ts` (remove optional logic, hardcode theme)
- [ ] Merge sentry/recharts deps into template `package.json`
- [ ] Delete `optional/` directory
- [ ] Update `post-setup.ts` types
- [ ] Test: `node dist/index.js my-app --pm pnpm --no-git` works
- [ ] Test: interactive mode only shows 2 prompts

## Success Criteria
- `create-pila-app my-app` only asks for package manager
- `create-pila-app my-app --pm pnpm --no-git` runs fully non-interactive
- Scaffolded project includes recharts + @sentry/react in package.json
- No `optional/` directory in scaffolded output
- Violet theme applied by default in globals.css
- CLI builds without errors: `pnpm --filter cli build`

## Risk Assessment
- **Breaking change for existing users** -- acceptable since this is a rebuild
- **themes.ts becomes mostly dead code** -- keep for potential future re-enablement

## Next Steps
- Phase 02 and 03 can start after this (they modify template files)
