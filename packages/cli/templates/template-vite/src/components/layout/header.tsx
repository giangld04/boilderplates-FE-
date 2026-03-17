import { LogOut, User } from 'lucide-react'

import { useSignOut } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

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
    <header className='flex h-14 items-center border-b bg-background px-4 gap-4'>
      <div className='flex-1' />

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
