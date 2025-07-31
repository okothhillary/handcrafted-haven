// Reusable Sort Component

import React from 'react';
import { SortConfig, SortDirection, SortOption } from '@/utils/sorting';

interface SortSelectProps {
  options: SortOption[];
  currentSort: SortConfig | undefined;
  onSortChange: (key: string, direction: SortDirection) => void;
  className?: string;
  placeholder?: string;
}

export function SortSelect({
  options,
  currentSort,
  onSortChange,
  className = '',
  placeholder = 'Sort by...'
}: SortSelectProps) {
  const currentValue = currentSort 
    ? `${currentSort.key}-${currentSort.direction}`
    : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    const [key, direction] = value.split('-');
    onSortChange(key, direction as SortDirection);
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className={`
        border border-gray-300 rounded-md px-3 py-2 text-sm bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${className}
      `}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => {
        const value = `${option.key}-${option.direction}`;
        return (
          <option key={value} value={value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
}

interface SortButtonProps {
  label: string;
  sortKey: string;
  currentSort: SortConfig | undefined;
  onSortChange: (key: string, direction: SortDirection) => void;
  className?: string;
}

export function SortButton({
  label,
  sortKey,
  currentSort,
  onSortChange,
  className = ''
}: SortButtonProps) {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : 'none';

  const handleClick = () => {
    const newDirection: SortDirection = 
      !isActive || direction === 'desc' ? 'asc' : 'desc';
    onSortChange(sortKey, newDirection);
  };

  const getSortIcon = () => {
    if (!isActive) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (direction === 'asc') {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md
        border border-gray-300 bg-white hover:bg-gray-50 transition-colors
        ${isActive ? 'border-blue-500 text-blue-600' : 'text-gray-700'}
        ${className}
      `}
    >
      {label}
      {getSortIcon()}
    </button>
  );
}

interface TableHeaderProps {
  label: string;
  sortKey?: string;
  currentSort: SortConfig | undefined;
  onSortChange?: (key: string, direction: SortDirection) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function TableHeader({
  label,
  sortKey,
  currentSort,
  onSortChange,
  className = '',
  align = 'left'
}: TableHeaderProps) {
  const isSortable = sortKey && onSortChange;
  const isActive = currentSort?.key === sortKey;
  const direction = isActive && currentSort ? currentSort.direction : 'none';

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const handleClick = () => {
    if (!isSortable) return;
    
    const newDirection: SortDirection = 
      !isActive || direction === 'desc' ? 'asc' : 'desc';
    onSortChange(sortKey, newDirection);
  };

  const getSortIcon = () => {
    if (!isSortable) return null;

    if (!isActive) {
      return (
        <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (direction === 'asc') {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (isSortable) {
    return (
      <th
        className={`
          px-4 py-3 bg-gray-50 ${alignmentClasses[align]} text-xs font-medium text-gray-500 
          uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors
          group select-none ${className}
        `}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          {label}
          {getSortIcon()}
        </div>
      </th>
    );
  }

  return (
    <th
      className={`
        px-4 py-3 bg-gray-50 ${alignmentClasses[align]} text-xs font-medium text-gray-500 
        uppercase tracking-wider ${className}
      `}
    >
      {label}
    </th>
  );
}
