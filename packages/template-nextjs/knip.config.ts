import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/app/**/*.{ts,tsx}', 'src/middleware.ts'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['src/components/ui/**', 'src/features/*/services/gen/**'],
}
export default config
