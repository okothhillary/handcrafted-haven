'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';

export default function UnauthorizedPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Unauthorized', isCurrentPage: true }
  ];

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
            <p className="text-gray-600 mb-8">
              You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an error.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="primary">
                  <i className="ri-home-line mr-2"></i>
                  Go Home
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary">
                  <i className="ri-customer-service-line mr-2"></i>
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
