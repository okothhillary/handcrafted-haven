'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseAuthOptions {
  requiredRole?: string; // Optional: Check for role (e.g., 'admin')
  redirectTo?: string;   // Optional: Customize redirect path
}

export function useAuth({ requiredRole, redirectTo = '/auth/login' }: UseAuthOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo);
    } else if (
      status === 'authenticated' &&
      requiredRole &&
      session?.user?.role !== requiredRole
    ) {
      router.push('/unauthorized'); // or a "403 Forbidden" page
    }
  }, [status, session, requiredRole, redirectTo, router]);

  return { session, status };
}
