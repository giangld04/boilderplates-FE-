import fse from 'fs-extra'
import path from 'path'

// File extensions considered "text" for string replacement
const TEXT_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx',
  '.json', '.md', '.yml', '.yaml',
  '.env', '.css', '.html', '.txt',
]

/**
 * Recursively collects all text file paths under a directory,
 * skipping node_modules and the optional feature directory.
 */
async function getAllTextFiles(dir: string): Promise<string[]> {
  const entries = await fse.readdir(dir, { withFileTypes: true, recursive: true })

  return entries
    .filter(e => {
      if (!e.isFile()) return false
      if (!TEXT_EXTENSIONS.some(ext => e.name.endsWith(ext))) return false

      // e.parentPath is Node >=20; fall back to e.path for older Node
      const parent = (e as { parentPath?: string; path?: string }).parentPath
        ?? (e as { path?: string }).path
        ?? dir

      const fullPath = path.join(parent, e.name)
      return !fullPath.includes('node_modules') && !fullPath.includes(`${path.sep}optional${path.sep}`)
    })
    .map(e => {
      const parent = (e as { parentPath?: string; path?: string }).parentPath
        ?? (e as { path?: string }).path
        ?? dir
      return path.join(parent, e.name)
    })
}

/**
 * Replaces all placeholder tokens in every text file under dir.
 * Skips files inside node_modules and optional/ directories.
 *
 * @param dir - root directory to walk
 * @param replacements - map of { '{{TOKEN}}': 'value' }
 */
export async function replaceInFiles(
  dir: string,
  replacements: Record<string, string>,
): Promise<void> {
  const files = await getAllTextFiles(dir)

  await Promise.all(
    files.map(async (file) => {
      let content = await fse.readFile(file, 'utf-8')
      let changed = false

      for (const [from, to] of Object.entries(replacements)) {
        if (content.includes(from)) {
          content = content.replaceAll(from, to)
          changed = true
        }
      }

      if (changed) {
        await fse.writeFile(file, content, 'utf-8')
      }
    }),
  )
}
