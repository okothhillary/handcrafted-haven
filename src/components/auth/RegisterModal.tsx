'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register, state } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate terms acceptance
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }
    
    try {
      await register(formData.email, formData.password, formData.name, formData.role);
      onClose();
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
      setAcceptedTerms(false);
      router.refresh(); // Refresh to update UI
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    setAcceptedTerms(false);
    setError('');
  };

  const passwordsMatch = formData.password === formData.confirmPassword || formData.confirmPassword === '';
  const isFormValid = formData.name && formData.email && formData.password && 
                     formData.confirmPassword && passwordsMatch && acceptedTerms && formData.role;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Account">
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

        {/* Name Field */}
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="register-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={state.isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="register-email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={state.isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="Enter your email"
          />
        </div>

        {/* Role Selection Field */}
        <div>
          <label htmlFor="register-role" className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <select
            id="register-role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={state.isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="user">Customer - I want to buy handcrafted items</option>
            <option value="seller">Seller - I want to sell my handcrafted items</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            You can change your account type later in your profile settings
          </p>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="register-password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={state.isLoading}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Create a password"
              minLength={6}
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
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="register-confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={state.isLoading}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                !passwordsMatch ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={state.isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
            >
              <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
            </button>
          </div>
          {!passwordsMatch && formData.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="accept-terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            disabled={state.isLoading}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:cursor-not-allowed"
          />
          <label htmlFor="accept-terms" className="ml-3 text-sm text-gray-600">
            I agree to the{' '}
            <button type="button" className="text-primary hover:text-primary-dark underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-primary hover:text-primary-dark underline">
              Privacy Policy
            </button>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={state.isLoading || !isFormValid}
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </Button>

        {/* Switch to Login */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={state.isLoading}
              className="text-primary hover:text-primary-dark font-medium underline disabled:cursor-not-allowed"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}
