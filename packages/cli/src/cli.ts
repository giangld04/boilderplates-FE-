import * as p from '@clack/prompts'
import pc from 'picocolors'
import path from 'path'
import fse from 'fs-extra'
import { Command } from 'commander'
import { collectOptions } from './prompts.js'
import { scaffold } from './scaffold.js'
import { install } from './install.js'
import { initGit } from './git.js'
import { printSuccess } from './post-setup.js'

/** True when stdout is an interactive terminal */
const isTTY = Boolean(process.stdout.isTTY && process.stdin.isTTY)

function log(msg: string) {
  console.log(msg)
}

/**
 * Main CLI entry point.
 * Parses CLI arguments → collects interactive prompts (if TTY) → scaffolds → installs → git init.
 */
export async function run(): Promise<void> {
  const program = new Command()
    .name('create-pila-app')
    .description('Scaffold a Pila portal frontend project')
    .version('0.1.0')
    .argument('[project-name]', 'Name of the project')
    .option('--framework <framework>', 'nextjs or vite')
    .option('--pm <pm>', 'Package manager: pnpm or bun')
    .option('--features <features>', 'Comma-separated: i18n,dark-mode,editor,charts,dnd,sentry')
    .option('--auth <auth>', 'jwt, oauth, or none')
    .option('--no-install', 'Skip dependency installation')
    .option('--no-git', 'Skip git initialization')
    .parse(process.argv)

  log('')
  if (isTTY) {
    p.intro(pc.bgCyan(pc.black(' create-pila-app ')))
  } else {
    log(pc.bgCyan(pc.black(' create-pila-app ')))
  }

  const args = program.args
  const opts = program.opts<{
    framework?: string
    pm?: string
    features?: string
    auth?: string
    install: boolean
    git: boolean
  }>()

  // Collect options interactively (TTY) or from flags (non-interactive)
  const options = await collectOptions({
    projectName: args[0],
    framework: opts.framework,
    pm: opts.pm,
    features: opts.features?.split(','),
    auth: opts.auth,
  }, isTTY)

  // --no-install flag overrides the prompt answer
  if (!opts.install) {
    options.install = false
  }

  const destDir = path.resolve(process.cwd(), options.projectName)

  // Guard: refuse to scaffold into a non-empty directory
  if (await fse.pathExists(destDir)) {
    const files = await fse.readdir(destDir)
    if (files.length > 0) {
      const msg = `Directory "${options.projectName}" already exists and is not empty.`
      if (isTTY) p.cancel(msg)
      else log(pc.red('✖ ' + msg))
      process.exit(1)
    }
  }

  await fse.ensureDir(destDir)

  // ── Scaffold ───────────────────────────────────────────────────────────────
  log(pc.cyan('→ Scaffolding project...'))
  if (isTTY) {
    const scaffoldSpinner = p.spinner()
    scaffoldSpinner.start('Scaffolding project...')
    try {
      await scaffold(options, destDir)
      scaffoldSpinner.stop('Project scaffolded')
    } catch (err) {
      scaffoldSpinner.stop('Scaffolding failed')
      throw err
    }
  } else {
    await scaffold(options, destDir)
    log(pc.green('✓ Project scaffolded'))
  }

  // ── Install ────────────────────────────────────────────────────────────────
  if (options.install) {
    await install(destDir, options.packageManager)
  }

  // ── Git init ───────────────────────────────────────────────────────────────
  if (opts.git !== false) {
    try {
      await initGit(destDir)
    } catch {
      // Non-fatal: git may not be available in all environments
    }
  }

  printSuccess(options, destDir, isTTY)
}
