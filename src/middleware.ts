import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const isAuthenticated = (await cookies()).get('jao.token')
  const pathname = req.nextUrl.pathname;

  if ((pathname === '/login' || pathname === '/logon') && isAuthenticated) {
    return NextResponse.redirect(new URL('/app', req.url))
  }

  if ((pathname.includes('/app') || pathname === '/') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all pages except:
     * 1. /logon (exclude the register page)
     * 2. /login (exclude the login page)
     * 3. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
