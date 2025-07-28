'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, useUser } from '../../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export default function UserMenu() {
  const { state, logout } = useAuth();
  const user = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  // Authenticated user
  if (state.isAuthenticated && user) {
    return (
      <>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user.name}
            </span>
            <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}></i>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href="/account"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="ri-user-line mr-3 text-gray-400"></i>
                  Account Dashboard
                </Link>
                
                <Link
                  href="/account/orders"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="ri-shopping-bag-line mr-3 text-gray-400"></i>
                  Order History
                </Link>
                
                <Link
                  href="/wishlist"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="ri-heart-line mr-3 text-gray-400"></i>
                  Wishlist
                </Link>
                
                <Link
                  href="/account/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="ri-settings-line mr-3 text-gray-400"></i>
                  Account Settings
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <i className="ri-logout-box-line mr-3"></i>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  // Guest user
  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowLoginModal(true)}
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
        >
          Sign In
        </button>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Sign Up
        </button>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={switchToRegister}
      />
      
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}
