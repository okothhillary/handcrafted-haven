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

    if (
      (pathname.startsWith('/admin') && role !== 'admin') ||
      (pathname.startsWith('/seller') && !['seller', 'admin'].includes(role)) ||
      (pathname.startsWith('/review') && !['user', 'seller', 'admin'].includes(role))
    ) {
      return NextResponse.redirect(new URL('/api/(auth)/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/api/(auth)/signin',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*', '/review/:path*'],
};
