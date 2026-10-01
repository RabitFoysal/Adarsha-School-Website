import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session')?.value;
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;
  const isAuthenticated = adminSession === 'authenticated' || isLoggedIn === 'true';

  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in, redirect away from /login to /admin
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
