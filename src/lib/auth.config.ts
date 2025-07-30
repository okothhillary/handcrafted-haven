// /lib/auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const role = user?.role;
      const path = nextUrl.pathname;

      // Define protected routes
      const adminRoutes = ['/dashboard'];
      const sellerRoutes = ['/artworks/create'];
      const authRoutes = ['/review', '/profile', '/buy'];

      // Admin access
      if (adminRoutes.some((r) => path.startsWith(r))) {
        return user && role === 'admin';
      }

      // Seller-only access
      if (sellerRoutes.some((r) => path.startsWith(r))) {
        return user && role === 'seller';
      }

      // Authenticated user access
      if (authRoutes.some((r) => path.startsWith(r))) {
        return !!user;
      }

      // Otherwise allow public access
      return true;
    },
  },
} satisfies NextAuthConfig;


