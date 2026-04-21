# Code Review Summary

## Scope

- Files reviewed:
  - `packages/template-vite/CLAUDE.md`
  - `packages/template-vite/_package.json`
  - `packages/template-vite/commitlint.config.ts`
  - `packages/template-vite/.husky/pre-commit`
  - `packages/template-vite/.husky/commit-msg`
  - `packages/template-vite/.claude/skills/feature.md`
  - `packages/template-vite/.claude/skills/debug.md`
  - `packages/template-vite/.claude/skills/review.md`
  - `packages/template-vite/.claude/skills/plan.md`
  - `packages/cli/scripts/copy-templates.mjs`
  - `packages/cli/src/scaffold.ts`
  - `packages/cli/src/utils/template.ts`
  - `packages/template-vite/_gitignore`
- Review focus: Phase 1+2 new files (Husky, commitlint, CLAUDE.md, skills)

## Overall Assessment

All core deliverables implemented correctly. Husky 9 wiring is proper, commitlint config minimal and valid, CLAUDE.md accurate. One critical gap: `copy-templates.mjs` uses Node `fs.cp` without `{ dot: true }` — dotfiles/dot-directories (`.husky/`, `.claude/`) will be **silently skipped** in the npm-publish copy step, meaning scaffolded projects will be missing hooks and skills.

**Score: 7.5/10**

---

## Critical Issues

### 1. `copy-templates.mjs` drops dot-directories

**File:** `packages/cli/scripts/copy-templates.mjs`

Node's `fs.cp` with `recursive: true` excludes dotfiles (entries starting with `.`) by default unless `{ dot: true }` is passed. The current filter does NOT pass this option, so `.husky/` and `.claude/` will not be copied into `cli/templates/template-vite/` at publish time. When a user runs `create-pila-app`, the scaffolded project will have no Husky hooks and no `.claude/skills/`.

Note: `fse.copy` used in `scaffold.ts` copies dotfiles by default — that path is fine. The problem is only in `copy-templates.mjs` (the publish-time copy).

**Fix:**

```js
await cp(src, dest, {
  recursive: true,
  dot: true,            // <-- add this
  filter: (src) => { ... }
})
```

---

## High Priority Findings

### 2. Hook executable permissions — git may not preserve them

**Files:** `.husky/pre-commit`, `.husky/commit-msg`

Current `ls -la` shows `-rwxr-xr-x` (correct), but git does not preserve execute bits on non-executable files in all environments. Husky 9 requires hooks to be executable. If a developer clones the repo fresh on Windows or in certain CI configs, the bits may be lost.

**Mitigation options (pick one):**
- Document in README that `git config core.fileMode true` is required
- Add a `postinstall` or `prepare` step that `chmod +x .husky/*`
- Already partially mitigated: Husky 9's `husky` init command sets bits when `prepare` runs — but only after `pnpm install` in the scaffolded project, not in the template repo itself

**Assessment:** Low operational risk for end-users (bits set correctly via `prepare` in scaffolded project), but the template repo itself could have stale permissions. Non-blocking.

### 3. `_gitignore` does not exclude `.claude/` or `.husky/`

**Status:** Verified clean — `_gitignore` contains only `.env`, `.env.local`, `node_modules`, `dist`, `*.log`, `.turbo`, `src/routeTree.gen.ts`. Neither `.claude/` nor `.husky/` is excluded. No issue here.

---

## Medium Priority Improvements

### 4. `commitlint.config.ts` — TypeScript type annotation missing

The file exports a plain object with no type annotation:

```ts
export default {
  extends: ['@commitlint/config-conventional'],
}
```

`@commitlint/types` provides `UserConfig`. Adding it makes the config self-documenting and catches typos at compile time:

```ts
import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
}
export default config
```

Low impact since commitlint resolves the config at runtime, but it's a consistency issue given the project uses TypeScript everywhere.

### 5. `CLAUDE.md` — `styles/` dir in structure not in actual source tree

CLAUDE.md documents `src/styles/` but this dir is not referenced anywhere in the boilerplate source. YAGNI — remove to avoid confusing contributors.

### 6. Skill files — no `{{PROJECT_NAME}}` token

`feature.md`, `debug.md`, `review.md`, `plan.md` use hardcoded `[name]` placeholders (for the user to fill in), which is intentional and correct. However, the `plan.md` phase file noted that `.md` files in `.claude/skills/` get token replacement applied. Since no `{{PROJECT_NAME}}` token exists in skills files, replacement is a no-op there — harmless, but worth confirming there's no intent to inject the project name into skills content.

---

## Low Priority Suggestions

### 7. `copy-templates.mjs` filter uses string replace for relative path

```js
const rel = src.replace(path.join(repoRoot, 'packages', name), '')
```

`String.replace` only replaces the first occurrence. Prefer `replaceAll` or better: use `path.relative(basePath, src)`. Harmless in practice since the base path is unique, but brittle.

---

## Positive Observations

- Husky 9 wiring is correct: `prepare: "is-ci || husky"`, plain shell hook files (no `#!/bin/sh` needed in Husky 9), `pnpm lint-staged` and `pnpm commitlint --edit $1` syntax are all valid.
- `is-ci` guard is the right approach for CI compatibility.
- `commitlint.config.ts` is appropriately minimal (KISS).
- `CLAUDE.md` is accurate, concise (72 lines), and well-structured — covers tech stack, commands, conventions, feature workflow.
- Hook files are `chmod +x` already.
- `scaffold.ts` `fse.copy` correctly copies dot-directories by default.
- `_gitignore` does not block `.husky/` or `.claude/`.
- Token replacement covers all relevant extensions (`.md`, `.ts`, `.json`).
- Skill files are actionable and well-scoped.

---

## Recommended Actions

1. **[Critical]** Fix `copy-templates.mjs` — add `dot: true` to `fs.cp` options to include `.husky/` and `.claude/` in publish copy.
2. **[Medium]** Add `UserConfig` type to `commitlint.config.ts` for consistency with project TypeScript standards.
3. **[Medium]** Remove `src/styles/` from `CLAUDE.md` project structure if dir doesn't exist in template.
4. **[Low]** Replace `String.replace` with `path.relative` in `copy-templates.mjs` filter.

---

## Phase Task Completeness

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: CLAUDE.md + .claude/skills/ | COMPLETE | All 5 files created, token present, all skill files exist |
| Phase 2: Husky + commitlint | COMPLETE | All files created, hooks executable, deps added to _package.json |
| Phase 3: Trivy + CLI scaffold validation | PARTIAL | Critical gap found: `copy-templates.mjs` drops dotfiles |

---

## Unresolved Questions

1. Is `copy-templates.mjs` exercised in CI? If not, the dotfile bug would only surface at publish time — confirm whether there's a CI step that runs `node scripts/copy-templates.mjs` and checks output.
2. Intent for `{{PROJECT_NAME}}` in `.claude/skills/` files — should skills greet the user with their project name anywhere (e.g., in the debug skill header)?
3. `src/styles/` — does it exist in the actual template source tree, or was it documented speculatively?
