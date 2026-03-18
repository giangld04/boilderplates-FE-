'use client'

import { useState } from 'react'
import { LogOut, Menu, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useSignOut } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/stores/auth-store'
import { ThemeToggle } from '@/components/common/theme-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useSidebarStore } from './sidebar'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
]

function getLangFromCookie(): string {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/)
  return match?.[1] ?? 'en'
}

function LangSwitcher() {
  const [locale, setLocale] = useState(getLangFromCookie)
  const router = useRouter()
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  function switchLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=${365 * 24 * 60 * 60}`
    setLocale(code)
    router.refresh()
  }

  return (
    <Select value={current.code} onValueChange={switchLocale}>
      <SelectTrigger className='h-8 w-auto gap-1 border-0 bg-transparent px-2 shadow-none focus:ring-0'>
        <SelectValue>
          <span>{current.flag}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align='end'>
        {LANGUAGES.map(({ code, name, flag }) => (
          <SelectItem key={code} value={code}>
            <div className='flex items-center gap-2'>
              <span>{flag}</span>
              <span>{name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface HeaderProps {
  title?: string
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const { user } = useAuthStore()
  const signOut = useSignOut()
  const { setMobileOpen } = useSidebarStore()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Mobile menu trigger + page title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <LangSwitcher />
        <ThemeToggle />

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name ?? 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut.mutate()}
            disabled={signOut.isPending}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
  )
}
