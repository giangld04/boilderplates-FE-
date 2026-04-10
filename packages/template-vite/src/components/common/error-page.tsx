import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  code: number
  title: string
  description: string
  /** Show 'Go Back' button using history.back() */
  showBack?: boolean
}

/**
 * Reusable full-screen error page for HTTP-style error statuses.
 */
export function ErrorPage({ code, title, description, showBack = true }: ErrorPageProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-2 text-center px-4'>
      <p className='text-8xl font-bold text-muted-foreground/30'>{code}</p>
      <h1 className='text-2xl font-semibold'>{title}</h1>
      <p className='max-w-md text-muted-foreground'>{description}</p>
      <div className='mt-4 flex gap-3'>
        {showBack && (
          <Button variant='outline' onClick={() => window.history.back()}>Go Back</Button>
        )}
        <Button asChild>
          <Link to='/dashboard'>Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
