'use client'

import { useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggle = useCallback((e: React.MouseEvent) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement

    if (!document.startViewTransition) {
      setTheme(next)
      return
    }

    root.style.setProperty('--x', `${e.clientX}px`)
    root.style.setProperty('--y', `${e.clientY}px`)
    document.startViewTransition(() => setTheme(next))
  }, [resolvedTheme, setTheme])

  return (
    <Button variant='ghost' size='icon' onClick={toggle} aria-label='Toggle theme'>
      <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
