import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from './config/env/server';
import { verifyConfiguredLoginToken } from './lib/auth';

export const config = {
  matcher: '/admin/:path*',
};

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isGetRequest = request.method === 'GET';

  const shouldBeAuthenticated = isAdminPage && !isLoginPage;
  const shouldRedirect = shouldBeAuthenticated && isGetRequest;

  if (!shouldRedirect) {
    return NextResponse.next();
  }

  const jwt = request.cookies.get(serverEnv.loginCookieName)?.value;
  const isAuthenticated = await verifyConfiguredLoginToken(jwt);

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
