import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware disabled - using client-side auth check instead
 // Token is stored in localStorage, which is not accessible on server-side
  // Dashboard pages will check for token on client side
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
