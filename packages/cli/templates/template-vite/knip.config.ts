import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx', 'src/routes/**/*.{ts,tsx}'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['src/components/ui/**', 'src/routeTree.gen.ts', 'src/features/*/services/gen/**'],
}
export default config
