import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, isValidSessionCookie } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const validSession = await isValidSessionCookie(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!validSession && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  if (validSession && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
