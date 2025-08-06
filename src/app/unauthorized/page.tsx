'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
  const { data: session } = useSession();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Unauthorized', isCurrentPage: true }
  ];

  const getRedirectPath = () => {
    if (!session?.user?.role) return '/auth/signin';
    
    switch (session.user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'seller':
        return '/artisan/profile';
      case 'user':
      default:
        return '/account';
    }
  };

  const getRoleName = () => {
    switch (session?.user?.role) {
      case 'admin':
        return 'Administrator';
      case 'seller':
        return 'Seller/Artisan';
      case 'user':
      default:
        return 'Customer';
    }
  };

  return (
    <PageLayout
      title="Access Denied"
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <div className="text-center p-8">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <i className="ri-shield-cross-line text-2xl text-red-600"></i>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to access this page.
            </p>

            {session && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Signed in as:</p>
                <p className="font-semibold text-gray-900">{session.user.name}</p>
                <p className="text-sm text-gray-500">{session.user.email}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {getRoleName()}
                </span>
              </div>
            )}

            <p className="text-gray-600 mb-8">
              {session 
                ? 'This page requires different permissions than your current account level.'
                : 'Please contact an administrator if you believe this is an error.'
              }
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link href={getRedirectPath()}>
                  <Button variant="primary">
                    <i className="ri-dashboard-line mr-2"></i>
                    Go to My Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="primary">
                    <i className="ri-login-line mr-2"></i>
                    Sign In
                  </Button>
                </Link>
              )}
              <Link href="/">
                <Button variant="secondary">
                  <i className="ri-home-line mr-2"></i>
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
