'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
  preferences: {
    notifications: boolean;
    marketing: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
} | null>(null);

// Storage keys
const STORAGE_KEY = 'handcrafted_haven_auth';

// Mock user database (in a real app, this would be an API)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar: '/api/placeholder/150/150',
    joinedAt: new Date('2024-01-15'),
    preferences: {
      notifications: true,
      marketing: false,
      theme: 'light',
    },
  },
];

// Helper functions
const saveUserToStorage = (user: User) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to storage:', error);
  }
};

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      // Ensure dates are properly parsed
      if (user.joinedAt) {
        user.joinedAt = new Date(user.joinedAt);
      }
      return user;
    }
  } catch (error) {
    console.error('Failed to load user from storage:', error);
  }
  return null;
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove user from storage:', error);
  }
};

// Mock authentication functions (in a real app, these would be API calls)
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check credentials
  const user = mockUsers.find(u => u.email === email);
  if (!user || password !== 'password123') {
    throw new Error('Invalid email or password');
  }
  
  return user;
};

const mockRegister = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Check if user already exists
  if (mockUsers.find(u => u.email === email)) {
    throw new Error('An account with this email already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    joinedAt: new Date(),
    preferences: {
      notifications: true,
      marketing: false,
      theme: 'light',
    },
  };
  
  // Add to mock database
  mockUsers.push(newUser);
  
  return newUser;
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from storage on mount
  useEffect(() => {
    const savedUser = loadUserFromStorage();
    if (savedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: savedUser });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const user = await mockLogin(email, password);
      saveUserToStorage(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const user = await mockRegister(email, password, name);
      saveUserToStorage(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  };

  const logout = () => {
    removeUserFromStorage();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      saveUserToStorage(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
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
