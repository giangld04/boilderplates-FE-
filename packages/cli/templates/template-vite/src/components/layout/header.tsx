import { useTransition } from 'react'
import { LogOut, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSignOut } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/stores/auth-store'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
]

function LangSwitcher() {
  const { i18n } = useTranslation()
  const [isPending, startTransition] = useTransition()
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  return (
    <Select
      value={current.code}
      onValueChange={(v) => startTransition(() => i18n.changeLanguage(v))}
      disabled={isPending}
    >
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

export function Header() {
  const { user } = useAuthStore()
  const { mutate: signOut, isPending } = useSignOut()

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className='flex h-14 items-center border-b bg-background px-4 gap-2'>
      <div className='flex-1' />

      <LangSwitcher />
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='rounded-full' aria-label='User menu'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback className='text-xs'>{initials ?? <User className='h-4 w-4' />}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuLabel className='font-normal'>
            <p className='text-sm font-medium leading-none'>{user?.name}</p>
            <p className='mt-1 text-xs text-muted-foreground'>{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => signOut()}
            disabled={isPending}
            className='text-destructive focus:text-destructive'
          >
            <LogOut className='mr-2 h-4 w-4' />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
