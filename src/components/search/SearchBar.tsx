'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({ 
  placeholder = "Search for handmade items...", 
  className = '',
  showSuggestions = true,
  autoFocus = false
}: SearchBarProps) {
  const router = useRouter();
  const { state, search, getSuggestions, clearSearch } = useSearch();
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedSuggestion(-1);

    if (value.trim() && showSuggestions) {
      getSuggestions(value);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      performSearch(inputValue.trim());
    }
  };

  // Perform search and navigate
  const performSearch = (query: string) => {
    search(query);
    setShowDropdown(false);
    setSelectedSuggestion(-1);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    performSearch(suggestion);
  };

  // Handle recent search click
  const handleRecentSearchClick = (recentSearch: string) => {
    setInputValue(recentSearch);
    performSearch(recentSearch);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const totalItems = state.suggestions.length + state.recentSearches.length + 
      (state.suggestions.length > 0 && state.recentSearches.length > 0 ? 1 : 0); // +1 for divider

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          if (selectedSuggestion < state.suggestions.length) {
            handleSuggestionClick(state.suggestions[selectedSuggestion]);
          } else {
            const recentIndex = selectedSuggestion - state.suggestions.length - 
              (state.suggestions.length > 0 ? 1 : 0);
            if (recentIndex >= 0 && recentIndex < state.recentSearches.length) {
              handleRecentSearchClick(state.recentSearches[recentIndex]);
            }
          }
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clear search
  const handleClear = () => {
    setInputValue('');
    clearSearch();
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim() && showSuggestions) {
                setShowDropdown(true);
              }
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <i className="ri-search-line text-gray-400 text-lg"></i>
          </div>

          {/* Clear Button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          )}

          {/* Loading Indicator */}
          {state.isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {state.suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Suggestions
              </div>
              {state.suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                    selectedSuggestion === index ? 'bg-gray-50' : ''
                  }`}
                >
                  <i className="ri-search-line text-gray-400 mr-3"></i>
                  <span className="text-gray-900">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          {state.suggestions.length > 0 && state.recentSearches.length > 0 && (
            <div className="border-t border-gray-100"></div>
          )}

          {/* Recent Searches */}
          {state.recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Recent Searches
              </div>
              {state.recentSearches.slice(0, 5).map((recentSearch, index) => {
                const adjustedIndex = state.suggestions.length + 
                  (state.suggestions.length > 0 ? 1 : 0) + index;
                return (
                  <button
                    key={recentSearch}
                    onClick={() => handleRecentSearchClick(recentSearch)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                      selectedSuggestion === adjustedIndex ? 'bg-gray-50' : ''
                    }`}
                  >
                    <i className="ri-time-line text-gray-400 mr-3"></i>
                    <span className="text-gray-900">{recentSearch}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {state.suggestions.length === 0 && state.recentSearches.length === 0 && inputValue.trim() && (
            <div className="py-8 text-center text-gray-500">
              <i className="ri-search-line text-2xl mb-2"></i>
              <p>No suggestions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
