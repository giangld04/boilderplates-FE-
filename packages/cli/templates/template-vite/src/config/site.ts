export const siteConfig = {
  name: import.meta.env.VITE_APP_NAME ?? '{{PROJECT_NAME}}',
  description: 'Portal frontend application',
  url: import.meta.env.VITE_APP_URL ?? 'http://localhost:3000',
}
