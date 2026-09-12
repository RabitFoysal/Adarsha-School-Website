import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ইউজারের ব্রাউজারে লগইন কুকি (Cookie) আছে কি না চেক করছি
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;

  // যদি কেউ /admin লিংকে যেতে চায়
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // এবং সে যদি লগইন করা না থাকে
    if (isLoggedIn !== 'true') {
      // তাকে জোর করে /login পেজে পাঠিয়ে দাও
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}