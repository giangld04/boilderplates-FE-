import * as p from '@clack/prompts'
import pc from 'picocolors'
import path from 'path'
import type { ProjectOptions } from './prompts.js'

/**
 * Prints the coloured success message and "next steps" guide
 * after scaffolding and git init complete.
 */
export function printSuccess(options: ProjectOptions, destDir: string, isTTY = true): void {
  const relPath = path.relative(process.cwd(), destDir)
  const cdTarget = relPath || options.projectName
  const pm = options.packageManager
  const runCmd = `${pm} ${pm === 'npm' ? 'run dev' : 'dev'}`

  const msg =
    `${pc.green('✓')} Project created! Get started:\n\n` +
    `  ${pc.cyan(`cd ${cdTarget}`)}\n` +
    `  ${pc.cyan(`${pm} install`)}\n` +
    `  ${pc.cyan(runCmd)}\n\n` +
    `  ${pc.dim('Copy .env.example → .env and fill in your API URLs.')}`

  if (isTTY) {
    p.outro(msg)
  } else {
    console.log('\n' + msg + '\n')
  }
}
