// Reusable Filter Components

import React, { useState } from 'react';
import { ProductFilters, getFilterOptions, getPriceRange, RangeFilter } from '@/utils/filters';

interface FilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  data: any[];
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  data,
  className = '',
  isOpen = true,
  onToggle
}: FilterPanelProps) {
  const categoryOptions = getFilterOptions(data, 'category');
  const artisanOptions = getFilterOptions(data, 'artisan');
  const materialOptions = getFilterOptions(data, 'materials', (materials) => materials || []);
  const priceRange = getPriceRange(data);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined);
    }
    return value !== undefined && value !== null && value !== '';
  });

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Clear all
            </button>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className={`p-4 space-y-6 ${!isOpen ? 'hidden lg:block' : ''}`}>
        {/* Categories */}
        {categoryOptions.length > 0 && (
          <FilterSection title="Categories">
            <CheckboxGroup
              options={categoryOptions}
              selected={filters.categories || []}
              onChange={(values) => updateFilter('categories', values)}
            />
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range">
          <PriceRangeFilter
            min={priceRange.min || 0}
            max={priceRange.max || 100}
            value={filters.priceRange || {}}
            onChange={(range) => updateFilter('priceRange', range)}
          />
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Minimum Rating">
          <RatingFilter
            value={filters.rating}
            onChange={(rating) => updateFilter('rating', rating)}
          />
        </FilterSection>

        {/* Artisans */}
        {artisanOptions.length > 0 && (
          <FilterSection title="Artisans">
            <CheckboxGroup
              options={artisanOptions}
              selected={filters.artisan || []}
              onChange={(values) => updateFilter('artisan', values)}
              maxVisible={5}
            />
          </FilterSection>
        )}

        {/* Materials */}
        {materialOptions.length > 0 && (
          <FilterSection title="Materials">
            <CheckboxGroup
              options={materialOptions}
              selected={filters.materials || []}
              onChange={(values) => updateFilter('materials', values)}
              maxVisible={5}
            />
          </FilterSection>
        )}

        {/* Product Status */}
        <FilterSection title="Availability">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock || false}
                onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.onSale || false}
                onChange={(e) => updateFilter('onSale', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">On Sale</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => updateFilter('featured', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      {children}
    </div>
  );
}

interface CheckboxGroupProps {
  options: Array<{ value: any; label: string; count: number }>;
  selected: any[];
  onChange: (values: any[]) => void;
  maxVisible?: number;
}

function CheckboxGroup({ options, selected, onChange, maxVisible = 10 }: CheckboxGroupProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  const handleChange = (value: any, checked: boolean) => {
    if (checked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter(v => v !== value));
    }
  };

  return (
    <div className="space-y-2">
      {visibleOptions.map((option) => (
        <label key={option.value} className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </div>
          <span className="text-xs text-gray-500">({option.count})</span>
        </label>
      ))}
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showAll ? 'Show less' : `Show ${options.length - maxVisible} more`}
        </button>
      )}
    </div>
  );
}

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: RangeFilter;
  onChange: (range: RangeFilter) => void;
}

function PriceRangeFilter({ min, max, value, onChange }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(value.min?.toString() || '');
  const [localMax, setLocalMax] = useState(value.max?.toString() || '');

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalMin(val);
    
    const numVal = val === '' ? undefined : Number(val);
    if (numVal === undefined || !isNaN(numVal)) {
      onChange({ ...value, min: numVal });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalMax(val);
    
    const numVal = val === '' ? undefined : Number(val);
    if (numVal === undefined || !isNaN(numVal)) {
      onChange({ ...value, max: numVal });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={min.toString()}
          value={localMin}
          onChange={handleMinChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500">to</span>
        <input
          type="number"
          placeholder={max.toString()}
          value={localMax}
          onChange={handleMaxChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="text-xs text-gray-500">
        Range: ${min} - ${max}
      </div>
    </div>
  );
}

interface RatingFilterProps {
  value?: number;
  onChange: (rating: number | undefined) => void;
}

function RatingFilter({ value, onChange }: RatingFilterProps) {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-2">
      <label className="flex items-center">
        <input
          type="radio"
          name="rating"
          checked={value === undefined}
          onChange={() => onChange(undefined)}
          className="text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Any rating</span>
      </label>
      
      {ratings.map((rating) => (
        <label key={rating} className="flex items-center">
          <input
            type="radio"
            name="rating"
            checked={value === rating}
            onChange={() => onChange(rating)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-700">& up</span>
          </span>
        </label>
      ))}
    </div>
  );
}

// Mobile Filter Modal
interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileFilterModal({ isOpen, onClose, children }: MobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
