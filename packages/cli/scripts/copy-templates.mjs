/**
 * Copies real template directories into packages/cli/templates/
 * replacing the dev symlinks with real files for npm publish.
 */
import { cp, rm } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import { existsSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliDir = path.join(__dirname, '..')
const templatesDir = path.join(cliDir, 'templates')
const repoRoot = path.join(cliDir, '..', '..')

const templates = ['template-nextjs', 'template-vite']

for (const name of templates) {
  const src = path.join(repoRoot, 'packages', name)
  const dest = path.join(templatesDir, name)

  // Remove existing (symlink or old copy)
  if (existsSync(dest)) {
    await rm(dest, { recursive: true, force: true })
  }

  console.log(`Copying ${name}...`)
  await cp(src, dest, {
    recursive: true,
    dot: true, // include dotfiles (.husky/, .claude/, etc.)
    filter: (src) => {
      // Skip node_modules, .git, dist, tsconfig.tsbuildinfo
      const rel = src.replace(path.join(repoRoot, 'packages', name), '')
      if (rel.startsWith('/node_modules')) return false
      if (rel.startsWith('/.git')) return false
      if (rel.startsWith('/dist')) return false
      if (rel.endsWith('.tsbuildinfo')) return false
      return true
    },
  })
  console.log(`  ✓ ${name}`)
}

console.log('Templates copied successfully.')
