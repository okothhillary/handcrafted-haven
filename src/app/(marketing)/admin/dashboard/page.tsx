'use client';
import { useAuth } from '@/app/hooks/useAuth';

export default function AdminPage() {
  const { session, status } = useAuth({ requiredRole: 'admin' });

  if (status === 'loading') return <p>Loading...</p>;

  return <h1>Welcome, {session?.user?.name} (Admin)</h1>;
}
