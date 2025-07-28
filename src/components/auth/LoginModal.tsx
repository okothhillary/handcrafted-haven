'use client';

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login, state, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    if (!state.error) {
      onClose();
      setFormData({ email: '', password: '' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (state.error) {
      clearError();
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ email: '', password: '' });
    clearError();
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'password123',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Demo Account Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-error-warning-line text-red-600 mr-2"></i>
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="login-email"
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
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="login-password"
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

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary-dark underline"
            disabled={state.isLoading}
          >
            Forgot your password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={state.isLoading || !formData.email || !formData.password}
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

        {/* Switch to Register */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={state.isLoading}
              className="text-primary hover:text-primary-dark font-medium underline disabled:cursor-not-allowed"
            >
              Create one here
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}
