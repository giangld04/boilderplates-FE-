import fse from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import type { ProjectOptions } from './prompts.js'
import { replaceInFiles } from './utils/template.js'

// Resolve __dirname in ESM context
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Special file renames: underscore-prefixed files restored to their real names on scaffold */
const FILE_RENAMES: [string, string][] = [
  ['_gitignore', '.gitignore'],
  ['_env.example', '.env.example'],
  ['_prettierrc', '.prettierrc'],
  ['_prettierignore', '.prettierignore'],
  ['_package.json', 'package.json'],
]

/**
 * Copies the Vite base template to destDir,
 * renames special files, and runs string replacements.
 */
export async function scaffold(options: ProjectOptions, destDir: string): Promise<void> {
  const templateSymlink = path.join(__dirname, '..', 'templates', 'template-vite')
  // Resolve symlinks so fs-extra can copy the real directory
  const templateDir = await fse.realpath(templateSymlink)

  // 1. Copy base template, skipping the optional/ directory
  await fse.copy(templateDir, destDir, {
    overwrite: true,
    filter: (src) => !src.includes(`${path.sep}optional${path.sep}`) && src !== path.join(templateDir, 'optional'),
  })

  // 2. Rename special files that can't ship as dotfiles
  for (const [from, to] of FILE_RENAMES) {
    const fromPath = path.join(destDir, from)
    const toPath = path.join(destDir, to)
    if (await fse.pathExists(fromPath)) {
      await fse.move(fromPath, toPath)
    }
  }

  // 3. Token replacement across all text files
  await replaceInFiles(destDir, {
    '{{PROJECT_NAME}}': options.projectName,
    '{{YEAR}}': new Date().getFullYear().toString(),
  })
}
