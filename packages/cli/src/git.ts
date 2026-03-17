import { execa } from 'execa'

/**
 * Initialises a git repository at destDir and creates an initial commit
 * with all scaffolded files.
 */
export async function initGit(destDir: string): Promise<void> {
  await execa('git', ['init'], { cwd: destDir })
  await execa('git', ['add', '-A'], { cwd: destDir })
  await execa('git', ['commit', '-m', 'chore: initial scaffold from create-pila-app'], {
    cwd: destDir,
  })
}
