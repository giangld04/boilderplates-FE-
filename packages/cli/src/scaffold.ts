import fse from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import type { ProjectOptions } from './prompts.js'
import { getThemeCss } from './themes.js'
import { mergeDepsIntoPackageJson, type DepsJson } from './utils/package-json.js'
import { replaceInFiles } from './utils/template.js'

// Resolve __dirname in ESM context
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Special file renames: git/env files can't ship as dotfiles in npm packages */
const FILE_RENAMES: [string, string][] = [
  ['_gitignore', '.gitignore'],
  ['_env.example', '.env.example'],
  ['_prettierrc', '.prettierrc'],
  ['_prettierignore', '.prettierignore'],
]

/**
 * Copies the chosen base template to destDir, applies feature toggles,
 * renames special files, and runs string replacements.
 */
export async function scaffold(options: ProjectOptions, destDir: string): Promise<void> {
  const templateName = options.framework === 'nextjs' ? 'template-nextjs' : 'template-vite'
  const templateSymlink = path.join(__dirname, '..', 'templates', templateName)
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

  // 3. Apply optional features
  for (const feature of options.features) {
    await applyFeature(feature, templateDir, destDir)
  }

  // 4. Write theme-specific globals.css
  const globalsCssPath = path.join(destDir, 'src', 'styles', 'globals.css')
  await fse.writeFile(globalsCssPath, getThemeCss(options.theme, options.framework), 'utf-8')

  // 5. Token replacement across all text files
  await replaceInFiles(destDir, {
    '{{PROJECT_NAME}}': options.projectName,
    '{{YEAR}}': new Date().getFullYear().toString(),
  })
}

/**
 * Copies feature-specific source files and merges feature dependencies
 * into the project's package.json.
 */
async function applyFeature(feature: string, templateDir: string, destDir: string): Promise<void> {
  const featureDir = path.join(templateDir, 'optional', feature)
  if (!(await fse.pathExists(featureDir))) return

  // Copy feature source files into dest src/
  const filesDir = path.join(featureDir, 'files')
  if (await fse.pathExists(filesDir)) {
    await fse.copy(filesDir, path.join(destDir, 'src'), { overwrite: true })
  }

  // Merge feature dependencies into package.json
  const depsFile = path.join(featureDir, 'deps.json')
  if (await fse.pathExists(depsFile)) {
    const deps = await fse.readJson(depsFile) as DepsJson
    await mergeDepsIntoPackageJson(destDir, deps)
  }
}
