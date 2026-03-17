import { execa } from 'execa'
import * as p from '@clack/prompts'
import type { PackageManager } from './prompts.js'

/** Returns the install command args for the given package manager */
function getInstallArgs(pm: PackageManager): { cmd: string; args: string[] } {
  if (pm === 'deno') return { cmd: 'deno', args: ['install', '--node-modules-dir'] }
  return { cmd: pm, args: ['install'] }
}

/**
 * Runs the appropriate install command inside destDir,
 * showing a spinner while running.
 * Supports: npm, yarn, pnpm, bun, deno
 */
export async function install(destDir: string, packageManager: PackageManager): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Installing dependencies...')

  try {
    const { cmd, args } = getInstallArgs(packageManager)
    await execa(cmd, args, { cwd: destDir })
    spinner.stop('Dependencies installed')
  } catch (err) {
    spinner.stop('Installation failed')
    throw err
  }
}
