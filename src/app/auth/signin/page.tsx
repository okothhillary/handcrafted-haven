'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';

export default function SignInPage() {
  const { login, state } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/account';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Sign In', isCurrentPage: true }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
      router.push(callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'password123',
    });
  };

  return (
    <PageLayout
      title="Sign In to Your Account"
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>

            {/* Demo Account Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-600 mt-0.5 mr-2"></i>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Demo Account Available</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Try our demo account with email: demo@example.com, password: password123
                  </p>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="text-xs text-blue-600 underline hover:text-blue-800 mt-1"
                  >
                    Fill demo credentials
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line text-red-600 mr-2"></i>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={state.isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={state.isLoading}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={state.isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                  >
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/signup"
                    className="text-primary hover:text-primary-dark font-medium underline"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
