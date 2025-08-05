'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  image?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  
  const state: AuthState = {
    user: session?.user ? {
      id: session.user.email || '',
      email: session.user.email || '',
      name: session.user.name || '',
      role: session.user.role,
      image: session.user.image || undefined,
    } : null,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    error: null,
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto login after successful registration
      await login(email, password);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const clearError = () => {
    // No-op for NextAuth implementation
  };

  const value = {
    state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  );
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Convenience hooks
export function useUser() {
  const { state } = useAuth();
  return state.user;
}

export function useIsAuthenticated() {
  const { state } = useAuth();
  return state.isAuthenticated;
}
