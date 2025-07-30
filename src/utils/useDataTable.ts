// Combined hook for pagination, filtering, and sorting functionality

import { useState, useMemo, useCallback } from 'react';
import { paginateData, PaginationResult, validatePageNumber } from './pagination';
import { applyProductFilters, applyOrderFilters, ProductFilters, OrderFilters, hasActiveFilters } from './filters';
import { sortData, applySmartsort, SortConfig, SortDirection, getDefaultSort } from './sorting';

export interface UseDataTableConfig<T> {
  data: T[];
  initialPageSize?: number;
  initialSort?: SortConfig;
  dataType?: 'products' | 'orders' | 'artisans' | 'custom';
  searchFields?: string[];
}

export interface UseDataTableResult<T> {
  // Data
  paginatedData: PaginationResult<T>;
  filteredData: T[];
  totalItems: number;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  
  // Sorting
  sortConfig: SortConfig | undefined;
  setSortConfig: (config: SortConfig) => void;
  sortBy: (key: string, direction?: SortDirection) => void;
  clearSort: () => void;
  
  // Filtering
  filters: any;
  setFilters: (filters: any) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  hasFilters: boolean;
  
  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  
  // Combined actions
  reset: () => void;
  refresh: () => void;
}

export function useDataTable<T = any>(config: UseDataTableConfig<T>): UseDataTableResult<T> {
  const {
    data = [],
    initialPageSize = 12,
    initialSort,
    dataType = 'custom',
    searchFields = []
  } = config;
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(
    initialSort || (dataType !== 'custom' ? getDefaultSort(dataType) : undefined)
  );
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Apply filters and search
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply filters based on data type
    if (dataType === 'products' && hasActiveFilters(filters as ProductFilters)) {
      result = applyProductFilters(result, filters as ProductFilters);
    } else if (dataType === 'orders' && hasActiveFilters(filters as OrderFilters)) {
      result = applyOrderFilters(result, filters as OrderFilters);
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        const searchableFields = searchFields.length > 0 ? searchFields : getDefaultSearchFields(item);
        
        return searchableFields.some(field => {
          const value = getNestedValue(item, field);
          if (value === null || value === undefined) return false;
          
          const searchableText = Array.isArray(value) 
            ? value.join(' ').toLowerCase()
            : String(value).toLowerCase();
          
          return searchableText.includes(term);
        });
      });
    }
    
    return result;
  }, [data, filters, searchTerm, dataType, searchFields]);
  
  // Apply sorting
  const sortedData = useMemo(() => {
    if (searchTerm.trim() && sortConfig) {
      return applySmartsort(filteredData, searchTerm, sortConfig);
    } else if (sortConfig) {
      return sortData(filteredData, sortConfig);
    }
    return filteredData;
  }, [filteredData, sortConfig, searchTerm]);
  
  // Apply pagination
  const paginatedData = useMemo(() => {
    const validPage = validatePageNumber(currentPage, Math.ceil(sortedData.length / pageSize));
    return paginateData(sortedData, validPage, pageSize);
  }, [sortedData, currentPage, pageSize]);
  
  // Pagination actions
  const goToPage = useCallback((page: number) => {
    const maxPage = Math.ceil(sortedData.length / pageSize);
    const validPage = validatePageNumber(page, maxPage);
    setCurrentPage(validPage);
  }, [sortedData.length, pageSize]);
  
  const nextPage = useCallback(() => {
    if (paginatedData.pagination.hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, paginatedData.pagination.hasNextPage, goToPage]);
  
  const prevPage = useCallback(() => {
    if (paginatedData.pagination.hasPrevPage) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, paginatedData.pagination.hasPrevPage, goToPage]);
  
  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  }, []);
  
  // Sorting actions
  const sortBy = useCallback((key: string, direction?: SortDirection) => {
    const newDirection = direction || 
      (sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc');
    
    setSortConfig({
      key,
      direction: newDirection,
      type: inferSortType(data, key)
    });
    setCurrentPage(1); // Reset to first page
  }, [sortConfig, data]);
  
  const clearSort = useCallback(() => {
    setSortConfig(undefined);
  }, []);
  
  // Filter actions
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);
  
  // Search actions
  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page
  }, []);
  
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);
  
  // Combined actions
  const reset = useCallback(() => {
    setCurrentPage(1);
    setPageSize(initialPageSize);
    setSortConfig(initialSort || (dataType !== 'custom' ? getDefaultSort(dataType) : undefined));
    setFilters({});
    setSearchTerm('');
  }, [initialPageSize, initialSort, dataType]);
  
  const refresh = useCallback(() => {
    // This can be extended to refetch data if needed
    setCurrentPage(1);
  }, []);
  
  // Computed values
  const hasFilters = useMemo(() => {
    if (dataType === 'products') {
      return hasActiveFilters(filters as ProductFilters);
    } else if (dataType === 'orders') {
      return hasActiveFilters(filters as OrderFilters);
    }
    return Object.keys(filters).some(key => {
      const value = filters[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    });
  }, [filters, dataType]);
  
  return {
    // Data
    paginatedData,
    filteredData: sortedData,
    totalItems: data.length,
    
    // Pagination
    currentPage: paginatedData.pagination.currentPage,
    pageSize,
    totalPages: paginatedData.pagination.totalPages,
    hasNextPage: paginatedData.pagination.hasNextPage,
    hasPrevPage: paginatedData.pagination.hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    setPageSize: handleSetPageSize,
    
    // Sorting
    sortConfig,
    setSortConfig,
    sortBy,
    clearSort,
    
    // Filtering
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasFilters,
    
    // Search
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    clearSearch,
    
    // Combined actions
    reset,
    refresh
  };
}

// Helper functions
function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((current, prop) => current?.[prop], obj);
}

function getDefaultSearchFields(item: any): string[] {
  const commonFields = ['name', 'title', 'description', 'category', 'type'];
  return commonFields.filter(field => getNestedValue(item, field) !== undefined);
}

function inferSortType(data: any[], key: string): SortConfig['type'] {
  if (data.length === 0) return 'string';
  
  const sampleValue = getNestedValue(data[0], key);
  
  if (typeof sampleValue === 'number') return 'number';
  if (typeof sampleValue === 'boolean') return 'boolean';
  if (sampleValue instanceof Date) return 'date';
  if (typeof sampleValue === 'string' && !isNaN(Date.parse(sampleValue))) return 'date';
  
  return 'string';
}

// Export commonly used configurations
export const DEFAULT_PAGE_SIZES = [6, 12, 24, 48];

export const COMMON_SORT_OPTIONS = {
  products: [
    { key: 'name', label: 'Name', direction: 'asc' as SortDirection },
    { key: 'price', label: 'Price', direction: 'asc' as SortDirection },
    { key: 'rating', label: 'Rating', direction: 'desc' as SortDirection },
    { key: 'reviews', label: 'Reviews', direction: 'desc' as SortDirection }
  ],
  orders: [
    { key: 'createdAt', label: 'Date', direction: 'desc' as SortDirection },
    { key: 'total', label: 'Amount', direction: 'desc' as SortDirection },
    { key: 'status', label: 'Status', direction: 'asc' as SortDirection }
  ]
};
