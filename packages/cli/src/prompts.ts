import * as p from '@clack/prompts'
import pc from 'picocolors'
import { validateProjectName } from './utils/validate.js'

export type Feature = 'i18n' | 'dark-mode' | 'editor' | 'charts' | 'dnd' | 'sentry'

export interface ProjectOptions {
  projectName: string
  framework: 'nextjs' | 'vite'
  packageManager: 'pnpm' | 'bun'
  features: Feature[]
  auth: 'jwt' | 'oauth' | 'none'
  install: boolean
}

/** Partial pre-fill from CLI flags passed by the user */
export interface CliDefaults {
  projectName?: string
  framework?: string
  pm?: string
  features?: string[]
  auth?: string
}

/**
 * Runs the interactive @clack/prompts flow (when isTTY=true) or falls back
 * to defaults + hard-coded fallback values (non-interactive mode).
 * Any value already provided via CLI flags is used directly.
 */
export async function collectOptions(defaults: CliDefaults, isTTY = true): Promise<ProjectOptions> {
  // Non-interactive fallback: use flags or defaults immediately
  if (!isTTY) {
    const valid: Feature[] = ['i18n', 'dark-mode', 'editor', 'charts', 'dnd', 'sentry']
    const projectName = defaults.projectName ?? 'my-portal'
    const framework = (defaults.framework === 'nextjs' || defaults.framework === 'vite')
      ? defaults.framework : 'vite'
    const packageManager = (defaults.pm === 'pnpm' || defaults.pm === 'bun')
      ? defaults.pm : 'pnpm'
    const features = (defaults.features ?? []).filter((f): f is Feature => valid.includes(f as Feature))
    const auth = (defaults.auth === 'jwt' || defaults.auth === 'oauth' || defaults.auth === 'none')
      ? defaults.auth : 'jwt'
    return { projectName, framework, packageManager, features, auth, install: true }
  }
  // ── 1. Project name ────────────────────────────────────────────────────────
  let projectName: string
  if (defaults.projectName) {
    const validation = validateProjectName(defaults.projectName)
    if (validation !== undefined) {
      p.cancel(`Invalid project name: ${validation}`)
      process.exit(1)
    }
    projectName = defaults.projectName
  } else {
    const answer = await p.text({
      message: 'Project name',
      placeholder: 'my-portal',
      defaultValue: 'my-portal',
      validate: validateProjectName,
    })
    if (p.isCancel(answer)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }
    projectName = answer as string
  }

  // ── 2. Framework ───────────────────────────────────────────────────────────
  let framework: 'nextjs' | 'vite'
  if (defaults.framework === 'nextjs' || defaults.framework === 'vite') {
    framework = defaults.framework
  } else {
    const answer = await p.select<'nextjs' | 'vite'>({
      message: 'Framework',
      options: [
        { value: 'nextjs' as const, label: 'Next.js 16', hint: 'SSR · App Router · i18n-ready' },
        { value: 'vite' as const, label: 'Vite 7', hint: 'SPA · faster builds · TanStack Router' },
      ],
    })
    if (p.isCancel(answer)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }
    framework = answer as 'nextjs' | 'vite'
  }

  // ── 3. Package manager ─────────────────────────────────────────────────────
  let packageManager: 'pnpm' | 'bun'
  if (defaults.pm === 'pnpm' || defaults.pm === 'bun') {
    packageManager = defaults.pm
  } else {
    const answer = await p.select<'pnpm' | 'bun'>({
      message: 'Package manager',
      options: [
        { value: 'pnpm' as const, label: 'pnpm' },
        { value: 'bun' as const, label: 'bun' },
      ],
    })
    if (p.isCancel(answer)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }
    packageManager = answer as 'pnpm' | 'bun'
  }

  // ── 4. Features ────────────────────────────────────────────────────────────
  let features: Feature[]
  if (defaults.features && defaults.features.length > 0) {
    const valid: Feature[] = ['i18n', 'dark-mode', 'editor', 'charts', 'dnd', 'sentry']
    features = defaults.features.filter((f): f is Feature => valid.includes(f as Feature))
  } else {
    const answer = await p.multiselect<Feature>({
      message: 'Features ' + pc.dim('(space to toggle, enter to confirm)'),
      options: [
        { value: 'i18n' as const,      label: 'i18n',            hint: 'next-intl / custom' },
        { value: 'dark-mode' as const, label: 'Dark mode',        hint: 'next-themes' },
        { value: 'editor' as const,    label: 'Rich text editor', hint: 'Tiptap' },
        { value: 'charts' as const,    label: 'Charts',           hint: 'ECharts' },
        { value: 'dnd' as const,       label: 'Drag & drop',      hint: '@dnd-kit' },
        { value: 'sentry' as const,    label: 'Error tracking',   hint: 'Sentry' },
      ],
      required: false,
    })
    if (p.isCancel(answer)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }
    features = answer as Feature[]
  }

  // ── 5. Auth ────────────────────────────────────────────────────────────────
  let auth: 'jwt' | 'oauth' | 'none'
  if (defaults.auth === 'jwt' || defaults.auth === 'oauth' || defaults.auth === 'none') {
    auth = defaults.auth
  } else {
    const answer = await p.select<'jwt' | 'oauth' | 'none'>({
      message: 'Auth pattern',
      options: [
        { value: 'jwt' as const,   label: 'JWT tokens', hint: 'access + refresh token flow' },
        { value: 'oauth' as const, label: 'OAuth',       hint: 'placeholder, configure later' },
        { value: 'none' as const,  label: 'None',        hint: 'skip auth setup' },
      ],
    })
    if (p.isCancel(answer)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }
    auth = answer as 'jwt' | 'oauth' | 'none'
  }

  // ── 6. Install dependencies? ───────────────────────────────────────────────
  const installAnswer = await p.confirm({
    message: 'Install dependencies now?',
    initialValue: true,
  })
  if (p.isCancel(installAnswer)) {
    p.cancel('Operation cancelled.')
    process.exit(0)
  }
  const install = installAnswer as boolean

  return { projectName, framework, packageManager, features, auth, install }
}
