import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isLandingPage = request.nextUrl.pathname === '/';
  const isHomePage = request.nextUrl.pathname === '/home';

  // debug logging (remove in production)
  console.log('Middleware:', {
    path: request.nextUrl.pathname,
    isAuth,
    isAuthPage,
    isLandingPage,
    isHomePage,
    hasToken: !!token
  });

  // allow access to landing page without authentication
  if (isLandingPage) {
    return NextResponse.next();
  }

  // if user is on auth pages
  if (isAuthPage) {
    // if authenticated, redirect to home
    if (isAuth) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    // if not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // if user is trying to access protected routes (including /home)
  if (!isAuth) {
    return NextResponse.redirect(
      new URL('/auth/signin', request.url)
    );
  }

  // if authenticated and accessing any other protected route, allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * But include the root path for landing page logic
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
