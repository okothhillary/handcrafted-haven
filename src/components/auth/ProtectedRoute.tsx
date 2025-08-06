'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string | string[];
  allowAdminAccess?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/signin',
  requiredRole,
  allowAdminAccess = true
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push(redirectTo);
      return;
    }

    // Check role if required
    if (requiredRole) {
      const userRole = session.user?.role;
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Check if user has required role
      const hasRequiredRole = requiredRoles.includes(userRole || '');
      
      // Allow admin access unless explicitly disabled
      const isAdminWithAccess = allowAdminAccess && userRole === 'admin';
      
      if (!hasRequiredRole && !isAdminWithAccess) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [session, status, router, redirectTo, requiredRole, allowAdminAccess]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-4 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!session) {
    return null;
  }

  // Check role authorization
  if (requiredRole && session.user?.role !== requiredRole && session.user?.role !== 'admin') {
    return null;
  }

  // Show protected content
  return <>{children}</>;
}
