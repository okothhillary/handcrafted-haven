'use client';

import React from 'react';
import { SearchFilters } from '@/contexts/SearchContext';

interface SearchFiltersComponentProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onCategoryToggle: (category: string) => void;
}

const categories = [
  { id: 'pottery', name: 'Pottery', icon: 'ri-bowl-line' },
  { id: 'leather', name: 'Leather', icon: 'ri-handbag-line' },
  { id: 'textiles', name: 'Textiles', icon: 'ri-shirt-line' },
  { id: 'woodwork', name: 'Woodwork', icon: 'ri-tree-line' },
  { id: 'glasswork', name: 'Glasswork', icon: 'ri-glass-line' },
  { id: 'jewelry', name: 'Jewelry', icon: 'ri-gem-line' },
];

export default function SearchFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onCategoryToggle 
}: SearchFiltersComponentProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => onFiltersChange({
            categories: [],
            priceRange: { min: 0, max: 1000 },
            rating: 0,
            availability: 'all',
            sortBy: 'relevance'
          })}
          className="text-sm text-primary hover:text-primary-dark"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => onCategoryToggle(category.id)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <i className={`${category.icon} ml-3 mr-2 text-gray-500 group-hover:text-primary`}></i>
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={filters.priceRange.min || ''}
                onChange={(e) => onFiltersChange({
                  priceRange: {
                    ...filters.priceRange,
                    min: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={filters.priceRange.max || ''}
                onChange={(e) => onFiltersChange({
                  priceRange: {
                    ...filters.priceRange,
                    max: parseInt(e.target.value) || 1000
                  }
                })}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Quick Price Ranges */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Under $25', min: 0, max: 25 },
              { label: '$25-$50', min: 25, max: 50 },
              { label: '$50-$100', min: 50, max: 100 },
              { label: '$100+', min: 100, max: 1000 }
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => onFiltersChange({
                  priceRange: { min: range.min, max: range.max }
                })}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.priceRange.min === range.min && filters.priceRange.max === range.max
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => onFiltersChange({ rating })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <div className="ml-3 flex items-center">
                <div className="flex text-amber-400">
                  {Array.from({ length: rating }).map((_, i) => (
                    <i key={i} className="ri-star-fill text-sm"></i>
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <i key={i} className="ri-star-line text-sm text-gray-300"></i>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">& up</span>
              </div>
            </label>
          ))}
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === 0}
              onChange={() => onFiltersChange({ rating: 0 })}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">All ratings</span>
          </label>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All items', icon: 'ri-list-check' },
            { value: 'in-stock', label: 'In stock', icon: 'ri-checkbox-circle-line' },
            { value: 'on-sale', label: 'On sale', icon: 'ri-price-tag-3-line' }
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === option.value}
                onChange={() => onFiltersChange({ availability: option.value as any })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <i className={`${option.icon} ml-3 mr-2 text-gray-500 group-hover:text-primary`}></i>
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Applied Filters */}
      {(filters.categories.length > 0 || filters.rating > 0 || filters.availability !== 'all' || filters.priceRange.min > 0 || filters.priceRange.max < 1000) && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Applied Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(category => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
              >
                {categories.find(c => c.id === category)?.name}
                <button
                  onClick={() => onCategoryToggle(category)}
                  className="ml-2 hover:text-primary-dark"
                >
                  <i className="ri-close-line"></i>
                </button>
              </span>
            ))}
            
            {filters.rating > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                {filters.rating}+ stars
                <button
                  onClick={() => onFiltersChange({ rating: 0 })}
                  className="ml-2 hover:text-primary-dark"
                >
                  <i className="ri-close-line"></i>
                </button>
              </span>
            )}
            
            {(filters.priceRange.min > 0 || filters.priceRange.max < 1000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                ${filters.priceRange.min}-${filters.priceRange.max}
                <button
                  onClick={() => onFiltersChange({ priceRange: { min: 0, max: 1000 } })}
                  className="ml-2 hover:text-primary-dark"
                >
                  <i className="ri-close-line"></i>
                </button>
              </span>
            )}
            
            {filters.availability !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                {filters.availability === 'in-stock' ? 'In stock' : 'On sale'}
                <button
                  onClick={() => onFiltersChange({ availability: 'all' })}
                  className="ml-2 hover:text-primary-dark"
                >
                  <i className="ri-close-line"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
