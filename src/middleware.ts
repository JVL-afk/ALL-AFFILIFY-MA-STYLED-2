import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { enforcePlanRestrictions } from './lib/plan-middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for non-dashboard routes, API routes, and static assets
  if (
    !pathname.startsWith('/dashboard') ||
    pathname.startsWith('/api') ||
    pathname.includes('/_next') ||
    pathname.includes('/static') ||
    pathname.includes('/images') ||
    pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }
  
  // Enforce plan restrictions for dashboard routes
  const result = await enforcePlanRestrictions(request, pathname);
  
  if (!result.allowed && result.redirectUrl) {
    // Redirect to login or upgrade page
    return NextResponse.redirect(new URL(result.redirectUrl, request.url));
  }
  
  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
