'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/ui/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ children, redirectTo = '/' }: AuthGuardProps) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [state.isLoading, state.isAuthenticated, router, redirectTo]);

  // Show loading while checking authentication
  if (state.isLoading) {
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
  if (!state.isAuthenticated) {
    return null;
  }

  // Show protected content
  return <>{children}</>;
}
