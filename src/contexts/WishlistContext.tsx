'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface WishlistItem {
  productId: string;
  addedAt: Date;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    artisan: string;
    rating: number;
    category: string;
  };
}

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

// Actions
type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

// Initial state
const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

// Reducer
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
      };
    case 'ADD_ITEM':
      // Don't add if item already exists
      if (state.items.some(item => item.productId === action.payload.productId)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
      };
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
}

// Context
const WishlistContext = createContext<{
  state: WishlistState;
  addToWishlist: (product: WishlistItem['product']) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
} | null>(null);

// Storage key
const STORAGE_KEY = 'handcrafted_haven_wishlist';

// Helper functions
const saveWishlistToStorage = (items: WishlistItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save wishlist to storage:', error);
  }
};

const loadWishlistFromStorage = (): WishlistItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const items = JSON.parse(stored);
      // Ensure dates are properly parsed
      return items.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load wishlist from storage:', error);
  }
  return [];
};

// Provider component
interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from storage on mount
  useEffect(() => {
    const savedItems = loadWishlistFromStorage();
    dispatch({ type: 'LOAD_WISHLIST', payload: savedItems });
  }, []);

  // Save to storage whenever items change
  useEffect(() => {
    if (!state.isLoading) {
      saveWishlistToStorage(state.items);
    }
  }, [state.items, state.isLoading]);

  const addToWishlist = (product: WishlistItem['product']) => {
    const wishlistItem: WishlistItem = {
      productId: product.id,
      addedAt: new Date(),
      product,
    };
    dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const getWishlistCount = (): number => {
    return state.items.length;
  };

  const value = {
    state,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Hook for using wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

// Convenience hooks
export function useWishlistItems() {
  const { state } = useWishlist();
  return state.items;
}

export function useWishlistActions() {
  const { addToWishlist, removeFromWishlist, isInWishlist, clearWishlist } = useWishlist();
  return { addToWishlist, removeFromWishlist, isInWishlist, clearWishlist };
}
