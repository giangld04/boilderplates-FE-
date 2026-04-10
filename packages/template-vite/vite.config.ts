import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    // Only upload source maps in production builds with SENTRY_AUTH_TOKEN set
    ...(process.env.SENTRY_AUTH_TOKEN ? [sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    })] : []),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    rolldownOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          tanstack: ['@tanstack/react-router', '@tanstack/react-query'],
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          form: ['react-hook-form', 'zod', '@hookform/resolvers'],
          date: ['date-fns'],
        },
      },
    },
  },
})
