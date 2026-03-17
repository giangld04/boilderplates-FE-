import validatePkgName from 'validate-npm-package-name'

/**
 * Validates that a string is a valid npm package name.
 * Returns undefined on success, or an error message string on failure
 * (compatible with @clack/prompts validate signature).
 */
export function validateProjectName(name: string): string | undefined {
  // Prevent path traversal attacks
  if (name.includes('/') || name.includes('\\') || name.includes('..')) {
    return 'Project name cannot contain path separators'
  }

  const result = validatePkgName(name)
  if (!result.validForNewPackages) {
    return result.errors?.[0] ?? result.warnings?.[0] ?? 'Invalid package name'
  }

  return undefined
}
