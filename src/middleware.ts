import { NextResponse, type NextRequest } from 'next/server';
import { isDevelopmentMode } from '@/config/site';

// Diblokir di sini, bukan di layout, supaya halaman tidak sempat dirender dan bocor lewat payload RSC.
export function middleware(request: NextRequest) {
  if (!isDevelopmentMode) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname === '/maintenance') {
    return NextResponse.next();
  }

  const response = NextResponse.rewrite(new URL('/maintenance', request.url));

  // Jangan diindeks mesin pencari selama situs ditutup.
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Retry-After', '3600');
  response.headers.set('Cache-Control', 'no-store');

  return response;
}

export const config = {
  // Aset statis dilewati supaya halaman maintenance tetap bergaya dan berlogo.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
