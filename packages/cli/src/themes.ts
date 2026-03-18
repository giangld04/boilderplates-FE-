/** Each theme exports a complete globals.css string written to src/styles/globals.css */

export type Theme = 'violet' | 'blue' | 'emerald' | 'rose'

/** Shared CSS wrapping the color tokens — view transitions + base styles */
function buildGlobalsCss(lightTokens: string, darkTokens: string, hasTailwindLayer: boolean): string {
  const baseStyles = hasTailwindLayer
    ? `\n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}`
    : `\n* {\n  border-color: var(--color-border);\n}\n\nbody {\n  background-color: var(--color-background);\n  color: var(--color-foreground);\n  font-family: var(--font-sans);\n}`

  return `@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Radii — sharp minimal */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

${lightTokens}
}

.dark {
${darkTokens}
}
${baseStyles}

/* View transition: circular reveal for theme toggle */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
.dark::view-transition-old(root) {
  z-index: 1;
}
.dark::view-transition-new(root) {
  z-index: 999;
}
::view-transition-new(root) {
  clip-path: circle(0% at var(--x, 50%) var(--y, 50%));
  animation: theme-reveal 0.45s ease-in-out;
}
@keyframes theme-reveal {
  from { clip-path: circle(0% at var(--x, 50%) var(--y, 50%)); }
  to   { clip-path: circle(150% at var(--x, 50%) var(--y, 50%)); }
}
`
}

const VIOLET_LIGHT = `  /* Violet-tinted neutrals — cohesive with violet primary */
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(262 30% 10%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(262 30% 10%);
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(262 30% 10%);
  --color-primary: hsl(262 83% 58%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(262 30% 96%);
  --color-secondary-foreground: hsl(262 47% 12%);
  --color-muted: hsl(262 30% 96%);
  --color-muted-foreground: hsl(262 15% 47%);
  --color-accent: hsl(262 30% 96%);
  --color-accent-foreground: hsl(262 47% 12%);
  --color-destructive: hsl(0 72% 51%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(262 25% 90%);
  --color-input: hsl(262 25% 90%);
  --color-ring: hsl(262 83% 58%);
  --color-sidebar: hsl(262 30% 98%);
  --color-sidebar-foreground: hsl(262 20% 26%);
  --color-sidebar-primary: hsl(262 83% 58%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(262 30% 96%);
  --color-sidebar-accent-foreground: hsl(262 47% 12%);
  --color-sidebar-border: hsl(262 25% 90%);
  --color-sidebar-ring: hsl(262 83% 58%);`

const VIOLET_DARK = `  --color-background: hsl(262 20% 5%);
  --color-foreground: hsl(0 0% 98%);
  --color-card: hsl(262 20% 5%);
  --color-card-foreground: hsl(0 0% 98%);
  --color-popover: hsl(262 20% 7%);
  --color-popover-foreground: hsl(0 0% 98%);
  --color-primary: hsl(262 70% 67%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(262 20% 15%);
  --color-secondary-foreground: hsl(0 0% 98%);
  --color-muted: hsl(262 20% 15%);
  --color-muted-foreground: hsl(262 12% 65%);
  --color-accent: hsl(262 20% 15%);
  --color-accent-foreground: hsl(0 0% 98%);
  --color-destructive: hsl(0 63% 31%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(262 20% 15%);
  --color-input: hsl(262 20% 15%);
  --color-ring: hsl(262 70% 67%);
  --color-sidebar: hsl(262 25% 8%);
  --color-sidebar-foreground: hsl(262 10% 80%);
  --color-sidebar-primary: hsl(262 70% 67%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(262 20% 15%);
  --color-sidebar-accent-foreground: hsl(0 0% 98%);
  --color-sidebar-border: hsl(262 20% 15%);
  --color-sidebar-ring: hsl(262 70% 67%);`

const BLUE_LIGHT = `  /* Blue-tinted neutrals — cohesive with blue-500 primary */
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(217 30% 10%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(217 30% 10%);
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(217 30% 10%);
  --color-primary: hsl(217 91% 60%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(217 40% 96%);
  --color-secondary-foreground: hsl(217 47% 12%);
  --color-muted: hsl(217 40% 96%);
  --color-muted-foreground: hsl(217 15% 47%);
  --color-accent: hsl(217 40% 96%);
  --color-accent-foreground: hsl(217 47% 12%);
  --color-destructive: hsl(0 72% 51%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(217 30% 90%);
  --color-input: hsl(217 30% 90%);
  --color-ring: hsl(217 91% 60%);
  --color-sidebar: hsl(217 40% 98%);
  --color-sidebar-foreground: hsl(217 20% 26%);
  --color-sidebar-primary: hsl(217 91% 60%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(217 40% 96%);
  --color-sidebar-accent-foreground: hsl(217 47% 12%);
  --color-sidebar-border: hsl(217 30% 90%);
  --color-sidebar-ring: hsl(217 91% 60%);`

const BLUE_DARK = `  --color-background: hsl(217 25% 5%);
  --color-foreground: hsl(0 0% 98%);
  --color-card: hsl(217 25% 5%);
  --color-card-foreground: hsl(0 0% 98%);
  --color-popover: hsl(217 25% 7%);
  --color-popover-foreground: hsl(0 0% 98%);
  --color-primary: hsl(217 91% 65%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(217 20% 15%);
  --color-secondary-foreground: hsl(0 0% 98%);
  --color-muted: hsl(217 20% 15%);
  --color-muted-foreground: hsl(217 12% 65%);
  --color-accent: hsl(217 20% 15%);
  --color-accent-foreground: hsl(0 0% 98%);
  --color-destructive: hsl(0 63% 31%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(217 20% 15%);
  --color-input: hsl(217 20% 15%);
  --color-ring: hsl(217 91% 65%);
  --color-sidebar: hsl(217 25% 8%);
  --color-sidebar-foreground: hsl(217 10% 80%);
  --color-sidebar-primary: hsl(217 91% 65%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(217 20% 15%);
  --color-sidebar-accent-foreground: hsl(0 0% 98%);
  --color-sidebar-border: hsl(217 20% 15%);
  --color-sidebar-ring: hsl(217 91% 65%);`

const EMERALD_LIGHT = `  /* Emerald-tinted neutrals — cohesive with emerald-500 primary */
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(158 30% 8%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(158 30% 8%);
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(158 30% 8%);
  --color-primary: hsl(158 64% 42%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(158 30% 95%);
  --color-secondary-foreground: hsl(158 47% 10%);
  --color-muted: hsl(158 30% 95%);
  --color-muted-foreground: hsl(158 12% 46%);
  --color-accent: hsl(158 30% 95%);
  --color-accent-foreground: hsl(158 47% 10%);
  --color-destructive: hsl(0 72% 51%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(158 25% 89%);
  --color-input: hsl(158 25% 89%);
  --color-ring: hsl(158 64% 42%);
  --color-sidebar: hsl(158 25% 98%);
  --color-sidebar-foreground: hsl(158 18% 25%);
  --color-sidebar-primary: hsl(158 64% 42%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(158 30% 95%);
  --color-sidebar-accent-foreground: hsl(158 47% 10%);
  --color-sidebar-border: hsl(158 25% 89%);
  --color-sidebar-ring: hsl(158 64% 42%);`

const EMERALD_DARK = `  --color-background: hsl(158 20% 5%);
  --color-foreground: hsl(0 0% 98%);
  --color-card: hsl(158 20% 5%);
  --color-card-foreground: hsl(0 0% 98%);
  --color-popover: hsl(158 20% 7%);
  --color-popover-foreground: hsl(0 0% 98%);
  --color-primary: hsl(158 60% 52%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(158 18% 14%);
  --color-secondary-foreground: hsl(0 0% 98%);
  --color-muted: hsl(158 18% 14%);
  --color-muted-foreground: hsl(158 10% 64%);
  --color-accent: hsl(158 18% 14%);
  --color-accent-foreground: hsl(0 0% 98%);
  --color-destructive: hsl(0 63% 31%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(158 18% 14%);
  --color-input: hsl(158 18% 14%);
  --color-ring: hsl(158 60% 52%);
  --color-sidebar: hsl(158 22% 8%);
  --color-sidebar-foreground: hsl(158 8% 80%);
  --color-sidebar-primary: hsl(158 60% 52%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(158 18% 14%);
  --color-sidebar-accent-foreground: hsl(0 0% 98%);
  --color-sidebar-border: hsl(158 18% 14%);
  --color-sidebar-ring: hsl(158 60% 52%);`

const ROSE_LIGHT = `  /* Rose-tinted neutrals — cohesive with rose-600 primary */
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(346 30% 10%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(346 30% 10%);
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(346 30% 10%);
  --color-primary: hsl(346 77% 49%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(346 30% 96%);
  --color-secondary-foreground: hsl(346 47% 12%);
  --color-muted: hsl(346 30% 96%);
  --color-muted-foreground: hsl(346 14% 47%);
  --color-accent: hsl(346 30% 96%);
  --color-accent-foreground: hsl(346 47% 12%);
  --color-destructive: hsl(0 72% 51%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(346 25% 90%);
  --color-input: hsl(346 25% 90%);
  --color-ring: hsl(346 77% 49%);
  --color-sidebar: hsl(346 30% 98%);
  --color-sidebar-foreground: hsl(346 20% 26%);
  --color-sidebar-primary: hsl(346 77% 49%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(346 30% 96%);
  --color-sidebar-accent-foreground: hsl(346 47% 12%);
  --color-sidebar-border: hsl(346 25% 90%);
  --color-sidebar-ring: hsl(346 77% 49%);`

const ROSE_DARK = `  --color-background: hsl(346 20% 5%);
  --color-foreground: hsl(0 0% 98%);
  --color-card: hsl(346 20% 5%);
  --color-card-foreground: hsl(0 0% 98%);
  --color-popover: hsl(346 20% 7%);
  --color-popover-foreground: hsl(0 0% 98%);
  --color-primary: hsl(346 75% 60%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(346 18% 15%);
  --color-secondary-foreground: hsl(0 0% 98%);
  --color-muted: hsl(346 18% 15%);
  --color-muted-foreground: hsl(346 10% 65%);
  --color-accent: hsl(346 18% 15%);
  --color-accent-foreground: hsl(0 0% 98%);
  --color-destructive: hsl(0 63% 31%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(346 18% 15%);
  --color-input: hsl(346 18% 15%);
  --color-ring: hsl(346 75% 60%);
  --color-sidebar: hsl(346 22% 8%);
  --color-sidebar-foreground: hsl(346 8% 80%);
  --color-sidebar-primary: hsl(346 75% 60%);
  --color-sidebar-primary-foreground: hsl(0 0% 100%);
  --color-sidebar-accent: hsl(346 18% 15%);
  --color-sidebar-accent-foreground: hsl(0 0% 98%);
  --color-sidebar-border: hsl(346 18% 15%);
  --color-sidebar-ring: hsl(346 75% 60%);`

/** Returns the complete globals.css content for the given theme and framework */
export function getThemeCss(theme: Theme, framework: 'nextjs' | 'vite'): string {
  const hasTailwindLayer = framework === 'vite'
  switch (theme) {
    case 'violet':  return buildGlobalsCss(VIOLET_LIGHT,  VIOLET_DARK,  hasTailwindLayer)
    case 'blue':    return buildGlobalsCss(BLUE_LIGHT,    BLUE_DARK,    hasTailwindLayer)
    case 'emerald': return buildGlobalsCss(EMERALD_LIGHT, EMERALD_DARK, hasTailwindLayer)
    case 'rose':    return buildGlobalsCss(ROSE_LIGHT,    ROSE_DARK,    hasTailwindLayer)
  }
}
