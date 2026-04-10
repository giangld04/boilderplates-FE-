import * as p from '@clack/prompts'
import { validateProjectName } from './utils/validate.js'

export type PackageManager = 'pnpm'

export interface ProjectOptions {
  projectName: string
  packageManager: PackageManager
}

/** Partial pre-fill from CLI flags passed by the user */
export interface CliDefaults {
  projectName?: string
}

/**
 * Runs the interactive @clack/prompts flow (when isTTY=true) or falls back
 * to defaults (non-interactive mode). Package manager is always pnpm.
 */
export async function collectOptions(defaults: CliDefaults, isTTY = true): Promise<ProjectOptions> {
  // Non-interactive fallback
  if (!isTTY) {
    return { projectName: defaults.projectName ?? 'my-portal', packageManager: 'pnpm' }
  }

  // ── Project name ────────────────────────────────────────────────────────────
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

  return { projectName, packageManager: 'pnpm' }
}
