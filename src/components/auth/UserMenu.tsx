'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    signOut({ callbackUrl: '/' });
    setIsDropdownOpen(false);
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  // Authenticated user
  if (session?.user) {
    return (
      <>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                {(session.user.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {session.user.name}
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
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
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
    <div className="flex items-center space-x-2">
      <button
        onClick={handleSignIn}
        className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
      >
        Sign In
      </button>
      <button
        onClick={handleSignUp}
        className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
      >
        Sign Up
      </button>
    </div>
  );
}
