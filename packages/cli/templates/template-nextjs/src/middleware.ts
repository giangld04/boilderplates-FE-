import { NextRequest, NextResponse } from 'next/server'

const protectedPaths = ['/dashboard']
const authPaths = ['/sign-in', '/sign-up']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  if (protectedPaths.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL(`/sign-in?redirect=${pathname}`, request.url))
  }

  if (authPaths.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
