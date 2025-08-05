import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import type { NextRequest } from 'next/server';

interface AuthenticatedRequest extends NextRequest {
  nextauth: {
    token: {
      name?: string | null;
      email?: string | null;
      role?: string;
      [key: string]: unknown;
    } | null;
  };
}

export default withAuth(
  function middleware(req: AuthenticatedRequest) {
    const role = req.nextauth.token?.role || 'user';
    const { pathname } = req.nextUrl;

    // Admin routes - only admins can access
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Seller routes - sellers and admins can access
    if (pathname.startsWith('/seller') && !['seller', 'admin'].includes(role)) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // User protected routes - all authenticated users can access
    if (pathname.startsWith('/account') || 
        pathname.startsWith('/orders') ||
        pathname.startsWith('/wishlist') ||
        pathname.startsWith('/checkout')) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*', 
    '/seller/:path*', 
    '/account/:path*',
    '/orders/:path*',
    '/wishlist/:path*',
    '/checkout/:path*'
  ],
};
