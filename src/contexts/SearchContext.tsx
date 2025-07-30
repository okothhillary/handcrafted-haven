'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { PRODUCTS, getProducts, searchProducts, getProductsByCategory, getFeaturedProducts } from '@/data/products';

// Types
export interface SearchFilters {
  categories: string[];
  priceRange: { min: number; max: number };
  rating: number;
  availability: 'all' | 'in-stock' | 'on-sale';
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'rating';
}

export interface SearchResult {
  id: string;
  name: string;
  artisan: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  onSale?: boolean;
  featured?: boolean;
  description: string;
  materials: string[];
  inStock: boolean;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  suggestions: string[];
  filters: SearchFilters;
  isLoading: boolean;
  recentSearches: string[];
  totalResults: number;
  currentPage: number;
  hasNextPage: boolean;
}

// Actions
type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: { results: SearchResult[]; total: number; hasNextPage: boolean } }
  | { type: 'SET_SUGGESTIONS'; payload: string[] }
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'ADD_RECENT_SEARCH'; payload: string }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_PAGE'; payload: number };

// Initial state
const initialFilters: SearchFilters = {
  categories: [],
  priceRange: { min: 0, max: 1000 },
  rating: 0,
  availability: 'all',
  sortBy: 'relevance',
};

const initialState: SearchState = {
  query: '',
  results: [],
  suggestions: [],
  filters: initialFilters,
  isLoading: false,
  recentSearches: [],
  totalResults: 0,
  currentPage: 1,
  hasNextPage: false,
};

// Utility function to convert Product to SearchResult
const convertToSearchResult = (product: any): SearchResult => ({
  id: product.id.toString(),
  name: product.name,
  artisan: product.artisan,
  price: product.price,
  originalPrice: product.originalPrice,
  rating: product.rating,
  reviews: product.reviews,
  image: product.image,
  category: product.category,
  onSale: product.onSale || false,
  featured: product.featured || false,
  description: product.description,
  materials: product.materials,
  inStock: product.inStock !== false,
});

// Convert all products to SearchResult format
const getAllSearchResults = (): SearchResult[] => {
  return PRODUCTS.map(convertToSearchResult);
};

// Reducer
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload.results,
        totalResults: action.payload.total,
        hasNextPage: action.payload.hasNextPage,
        isLoading: false,
      };
    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'ADD_RECENT_SEARCH':
      const newRecentSearches = [
        action.payload,
        ...state.recentSearches.filter(s => s !== action.payload)
      ].slice(0, 10); // Keep only last 10 searches
      return {
        ...state,
        recentSearches: newRecentSearches,
      };
    case 'CLEAR_SEARCH':
      return {
        ...state,
        query: '',
        results: [],
        suggestions: [],
        totalResults: 0,
        currentPage: 1,
        hasNextPage: false,
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
}

// Context
const SearchContext = createContext<{
  state: SearchState;
  search: (query: string, filters?: Partial<SearchFilters>) => Promise<void>;
  getSuggestions: (query: string) => Promise<void>;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearSearch: () => void;
  loadMore: () => Promise<void>;
} | null>(null);

// Storage key
const STORAGE_KEY = 'handcrafted_haven_recent_searches';

// Helper functions
const saveRecentSearches = (searches: string[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    }
  } catch (error) {
    console.error('Failed to save recent searches:', error);
  }
};

const loadRecentSearches = (): string[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to load recent searches:', error);
    return [];
  }
};

// Mock search function
const performSearch = async (
  query: string, 
  filters: SearchFilters, 
  page: number = 1
): Promise<{ results: SearchResult[]; total: number; hasNextPage: boolean }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredProducts = getAllSearchResults();

  // Apply text search
  if (query.trim()) {
    const searchLower = query.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.artisan.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.materials.some((material: string) => material.toLowerCase().includes(searchLower))
    );
  }

  // Apply category filter
  if (filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filters.categories.includes(product.category)
    );
  }

  // Apply price range filter
  filteredProducts = filteredProducts.filter(product =>
    product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
  );

  // Apply rating filter
  if (filters.rating > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.rating >= filters.rating
    );
  }

  // Apply availability filter
  if (filters.availability === 'in-stock') {
    filteredProducts = filteredProducts.filter(product => product.inStock);
  } else if (filters.availability === 'on-sale') {
    filteredProducts = filteredProducts.filter(product => product.onSale);
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      // For demo, just reverse the array
      filteredProducts.reverse();
      break;
    case 'relevance':
    default:
      // Keep original order for relevance
      break;
  }

  const pageSize = 12;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = filteredProducts.slice(startIndex, endIndex);

  return {
    results: paginatedResults,
    total: filteredProducts.length,
    hasNextPage: endIndex < filteredProducts.length,
  };
};

// Mock suggestions function
const getSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  const suggestions = [
    'ceramic bowl',
    'leather wallet',
    'wooden cutting board',
    'glass vase',
    'knitted scarf',
    'woven basket',
    'pottery',
    'handmade jewelry',
    'artisan crafts',
    'sustainable goods',
  ];

  return suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};

// Provider component
interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [state, dispatch] = useReducer(searchReducer, {
    ...initialState,
    recentSearches: loadRecentSearches(),
  });

  // Save recent searches when they change
  useEffect(() => {
    saveRecentSearches(state.recentSearches);
  }, [state.recentSearches]);

  const search = async (query: string, filters?: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'SET_LOADING', payload: true });

    if (filters) {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    }

    const finalFilters = filters ? { ...state.filters, ...filters } : state.filters;

    try {
      const result = await performSearch(query, finalFilters, 1);
      dispatch({ type: 'SET_RESULTS', payload: result });
      dispatch({ type: 'SET_PAGE', payload: 1 });

      if (query.trim()) {
        dispatch({ type: 'ADD_RECENT_SEARCH', payload: query.trim() });
      }
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getSuggestionsHandler = async (query: string) => {
    try {
      const suggestions = await getSuggestions(query);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const updateFilters = (filters: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    if (state.query) {
      search(state.query, filters);
    }
  };

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
  };

  const loadMore = async () => {
    if (!state.hasNextPage || state.isLoading) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const nextPage = state.currentPage + 1;
      const result = await performSearch(state.query, state.filters, nextPage);
      
      dispatch({ 
        type: 'SET_RESULTS', 
        payload: {
          results: [...state.results, ...result.results],
          total: result.total,
          hasNextPage: result.hasNextPage,
        }
      });
      dispatch({ type: 'SET_PAGE', payload: nextPage });
    } catch (error) {
      console.error('Load more failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    state,
    search,
    getSuggestions: getSuggestionsHandler,
    updateFilters,
    clearSearch,
    loadMore,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

// Hook for using search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
