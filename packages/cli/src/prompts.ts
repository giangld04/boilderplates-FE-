import * as p from '@clack/prompts'
import pc from 'picocolors'
import { validateProjectName } from './utils/validate.js'

export type Feature = 'editor' | 'charts' | 'dnd' | 'sentry'

export type PackageManager = 'pnpm' | 'bun' | 'yarn'

export interface ProjectOptions {
  projectName: string
  framework: 'nextjs' | 'vite'
  packageManager: PackageManager
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
    const valid: Feature[] = ['editor', 'charts', 'dnd', 'sentry']
    const validPMs: PackageManager[] = ['pnpm', 'bun', 'yarn']
    const projectName = defaults.projectName ?? 'my-portal'
    const framework = (defaults.framework === 'nextjs' || defaults.framework === 'vite')
      ? defaults.framework : 'vite'
    const packageManager = validPMs.includes(defaults.pm as PackageManager)
      ? (defaults.pm as PackageManager) : 'pnpm'
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
        { value: 'vite' as const,   label: 'Vite 8',     hint: 'SPA · faster builds · TanStack Router' },
        { value: 'nextjs' as const, label: 'Next.js 16', hint: 'SSR · App Router · i18n-ready' },
      ],
    })
    if (p.isCancel(answer)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }
    framework = answer as 'nextjs' | 'vite'
  }

  // ── 3. Package manager ─────────────────────────────────────────────────────
  const validPMs: PackageManager[] = ['pnpm', 'bun', 'yarn']
  let packageManager: PackageManager
  if (validPMs.includes(defaults.pm as PackageManager)) {
    packageManager = defaults.pm as PackageManager
  } else {
    const answer = await p.select<PackageManager>({
      message: 'Package manager',
      options: [
        { value: 'pnpm' as const, label: 'pnpm', hint: 'recommended · efficient disk usage' },
        { value: 'bun' as const,  label: 'bun',  hint: 'fastest · all-in-one runtime' },
        { value: 'yarn' as const, label: 'yarn', hint: 'reliable · stable' },
      ],
    })
    if (p.isCancel(answer)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }
    packageManager = answer as PackageManager
  }

  // ── 4. Features ────────────────────────────────────────────────────────────
  // Note: i18n and dark-mode are always included by default
  let features: Feature[]
  if (defaults.features && defaults.features.length > 0) {
    const valid: Feature[] = ['editor', 'charts', 'dnd', 'sentry']
    features = defaults.features.filter((f): f is Feature => valid.includes(f as Feature))
  } else {
    const answer = await p.multiselect<Feature>({
      message: 'Features ' + pc.dim('(space to toggle, enter to confirm)'),
      options: [
        { value: 'editor' as const, label: 'Rich text editor', hint: 'Tiptap' },
        { value: 'charts' as const, label: 'Charts',           hint: 'ECharts' },
        { value: 'dnd' as const,    label: 'Drag & drop',      hint: '@dnd-kit' },
        { value: 'sentry' as const, label: 'Error tracking',   hint: 'Sentry' },
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
