import { execa } from 'execa'
import * as p from '@clack/prompts'

/**
 * Runs `pnpm install` or `bun install` inside destDir,
 * showing a spinner while running.
 */
export async function install(destDir: string, packageManager: 'pnpm' | 'bun'): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Installing dependencies...')

  try {
    await execa(packageManager, ['install'], { cwd: destDir })
    spinner.stop('Dependencies installed')
  } catch (err) {
    spinner.stop('Installation failed')
    throw err
  }
}
