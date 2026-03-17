import fse from 'fs-extra'
import path from 'path'

export interface DepsJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

/**
 * Deep-merges dependency entries from a feature deps.json
 * into the project's package.json at destDir.
 */
export async function mergeDepsIntoPackageJson(destDir: string, deps: DepsJson): Promise<void> {
  const pkgPath = path.join(destDir, 'package.json')
  const pkg = await fse.readJson(pkgPath)

  if (deps.dependencies) {
    pkg.dependencies = { ...pkg.dependencies, ...deps.dependencies }
  }
  if (deps.devDependencies) {
    pkg.devDependencies = { ...pkg.devDependencies, ...deps.devDependencies }
  }

  await fse.writeJson(pkgPath, pkg, { spaces: 2 })
}
