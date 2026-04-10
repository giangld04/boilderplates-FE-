import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/** Class-based error boundary catching render errors */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className='flex min-h-[200px] flex-col items-center justify-center gap-4 p-6 text-center'>
          <p className='text-lg font-semibold'>Something went wrong</p>
          <p className='max-w-md text-sm text-muted-foreground'>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <div className='flex gap-3'>
            <Button variant='outline' onClick={this.handleReset}>
              Try again
            </Button>
            <Button asChild>
              <Link to='/500'>View error details</Link>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
