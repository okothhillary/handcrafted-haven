'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSession } from 'next-auth/react';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin Dashboard', isCurrentPage: true }
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: 'ri-user-settings-line',
      href: '/admin/users',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Product Management',
      description: 'Review and manage all products',
      icon: 'ri-product-hunt-line',
      href: '/admin/products',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Order Management',
      description: 'View and manage all orders',
      icon: 'ri-shopping-cart-line',
      href: '/admin/orders',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Analytics',
      description: 'View platform analytics and reports',
      icon: 'ri-bar-chart-line',
      href: '/admin/analytics',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Settings',
      description: 'Configure platform settings',
      icon: 'ri-settings-line',
      href: '/admin/settings',
      color: 'bg-gray-50 text-gray-600',
    },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <PageLayout
        title="Admin Dashboard"
        breadcrumbs={breadcrumbs}
      >
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name}!
            </h1>
            <p className="text-primary-light">
              Here&apos;s what&apos;s happening on your platform today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <i className="ri-user-line text-2xl text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.totalUsers}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <i className="ri-store-line text-2xl text-green-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sellers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.totalSellers}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <i className="ri-product-hunt-line text-2xl text-purple-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.totalProducts}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <i className="ri-shopping-cart-line text-2xl text-orange-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.totalOrders}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminActions.map((action, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <i className={`${action.icon} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {action.description}
                      </p>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => window.location.href = action.href}
                      >
                        Access
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Users</h2>
            <Card>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading recent users...</p>
                  </div>
                ) : stats.recentUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.recentUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="ri-user-line text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600">No recent users to display</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
