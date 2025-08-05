'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSession } from 'next-auth/react';

export default function AccountPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Account Dashboard', isCurrentPage: true }
  ];

  const quickActions = [
    {
      title: 'Order History',
      description: 'View your past orders and track current ones',
      icon: 'ri-shopping-bag-line',
      href: '/account/orders',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Wishlist',
      description: 'View and manage your saved items',
      icon: 'ri-heart-line',
      href: '/wishlist',
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      icon: 'ri-settings-line',
      href: '/account/settings',
      color: 'bg-gray-50 text-gray-600',
    },
    {
      title: 'Browse Products',
      description: 'Discover new handcrafted items',
      icon: 'ri-search-line',
      href: '/products',
      color: 'bg-green-50 text-green-600',
    },
  ];

  const recentActivity = [
    {
      type: 'order',
      title: 'Order #1234 delivered',
      description: 'Handwoven Ceramic Bowl and 2 other items',
      date: '2 days ago',
      icon: 'ri-check-line',
      color: 'text-green-600',
    },
    {
      type: 'wishlist',
      title: 'Added to wishlist',
      description: 'Artisan Leather Wallet',
      date: '1 week ago',
      icon: 'ri-heart-line',
      color: 'text-red-600',
    },
    {
      type: 'review',
      title: 'Review submitted',
      description: '5-star review for Handwoven Ceramic Bowl',
      date: '1 week ago',
      icon: 'ri-star-line',
      color: 'text-yellow-600',
    },
  ];

  return (
    <ProtectedRoute>
      <PageLayout 
        title="Account Dashboard"
        breadcrumbs={breadcrumbs}
        showBreadcrumbs={true}
      >
        <div className="space-y-8">
          {/* Welcome Section */}
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user?.name || 'User'}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-gray-600">
                  Role: {user?.role || 'user'} • Email: {user?.email}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${action.color}`}>
                        <i className={`${action.icon} text-xl`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Account Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Stats */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">12</div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">8</div>
                  <p className="text-sm text-gray-600">Wishlist Items</p>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24</div>
                  <p className="text-sm text-gray-600">Items Reviewed</p>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`mt-1 ${activity.color}`}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <Link href="/account/orders" className="text-sm text-primary hover:text-primary-dark">
                      View all activity →
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recommended Actions */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
                <p className="text-gray-600 mt-1">
                  Add more information to your profile to get personalized recommendations
                </p>
              </div>
              <Link href="/account/settings">
                <Button variant="secondary">
                  Update Profile
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
