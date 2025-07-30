// Sort utilities for consistent sorting across all pages and data types

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
  type?: 'string' | 'number' | 'date' | 'boolean' | 'custom';
  customCompare?: (a: any, b: any) => number;
}

export interface SortOption {
  key: string;
  label: string;
  direction: SortDirection;
  type?: SortConfig['type'];
  defaultDirection?: SortDirection;
}

// Predefined sort options for products
export const PRODUCT_SORT_OPTIONS: SortOption[] = [
  { key: 'name', label: 'Name A-Z', direction: 'asc', type: 'string' },
  { key: 'name', label: 'Name Z-A', direction: 'desc', type: 'string' },
  { key: 'price', label: 'Price: Low to High', direction: 'asc', type: 'number' },
  { key: 'price', label: 'Price: High to Low', direction: 'desc', type: 'number' },
  { key: 'rating', label: 'Highest Rated', direction: 'desc', type: 'number' },
  { key: 'rating', label: 'Lowest Rated', direction: 'asc', type: 'number' },
  { key: 'reviews', label: 'Most Reviews', direction: 'desc', type: 'number' },
  { key: 'featured', label: 'Featured First', direction: 'desc', type: 'boolean' },
  { key: 'onSale', label: 'On Sale First', direction: 'desc', type: 'boolean' },
  { key: 'artisan', label: 'Artisan A-Z', direction: 'asc', type: 'string' },
  { key: 'category', label: 'Category A-Z', direction: 'asc', type: 'string' }
];

// Predefined sort options for orders
export const ORDER_SORT_OPTIONS: SortOption[] = [
  { key: 'createdAt', label: 'Newest First', direction: 'desc', type: 'date' },
  { key: 'createdAt', label: 'Oldest First', direction: 'asc', type: 'date' },
  { key: 'total', label: 'Highest Amount', direction: 'desc', type: 'number' },
  { key: 'total', label: 'Lowest Amount', direction: 'asc', type: 'number' },
  { key: 'status', label: 'Status A-Z', direction: 'asc', type: 'string' },
  { key: 'customerName', label: 'Customer A-Z', direction: 'asc', type: 'string' }
];

// Predefined sort options for artisans
export const ARTISAN_SORT_OPTIONS: SortOption[] = [
  { key: 'name', label: 'Name A-Z', direction: 'asc', type: 'string' },
  { key: 'name', label: 'Name Z-A', direction: 'desc', type: 'string' },
  { key: 'rating', label: 'Highest Rated', direction: 'desc', type: 'number' },
  { key: 'productsCount', label: 'Most Products', direction: 'desc', type: 'number' },
  { key: 'location', label: 'Location A-Z', direction: 'asc', type: 'string' }
];

/**
 * Sort array of data by single field
 */
export function sortData<T>(data: T[], config: SortConfig): T[] {
  const { key, direction, type = 'string', customCompare } = config;
  
  return [...data].sort((a, b) => {
    if (customCompare) {
      return direction === 'desc' ? customCompare(b, a) : customCompare(a, b);
    }
    
    const aValue = getNestedValue(a, key);
    const bValue = getNestedValue(b, key);
    
    const result = compareValues(aValue, bValue, type);
    return direction === 'desc' ? -result : result;
  });
}

/**
 * Sort by multiple fields with priority
 */
export function sortDataMultiple<T>(data: T[], configs: SortConfig[]): T[] {
  return [...data].sort((a, b) => {
    for (const config of configs) {
      const { key, direction, type = 'string', customCompare } = config;
      
      let result: number;
      
      if (customCompare) {
        result = direction === 'desc' ? customCompare(b, a) : customCompare(a, b);
      } else {
        const aValue = getNestedValue(a, key);
        const bValue = getNestedValue(b, key);
        result = compareValues(aValue, bValue, type);
        result = direction === 'desc' ? -result : result;
      }
      
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });
}

/**
 * Create sort configuration from sort option
 */
export function createSortConfig(option: SortOption): SortConfig {
  return {
    key: option.key,
    direction: option.direction,
    type: option.type
  };
}

/**
 * Toggle sort direction
 */
export function toggleSortDirection(currentDirection: SortDirection): SortDirection {
  return currentDirection === 'asc' ? 'desc' : 'asc';
}

/**
 * Get sort option by key and direction
 */
export function getSortOption(
  options: SortOption[],
  key: string,
  direction: SortDirection
): SortOption | undefined {
  return options.find(option => option.key === key && option.direction === direction);
}

/**
 * Create sort URL parameter
 */
export function createSortParam(key: string, direction: SortDirection): string {
  return `${key}-${direction}`;
}

/**
 * Parse sort parameter
 */
export function parseSortParam(param: string): { key: string; direction: SortDirection } | null {
  const parts = param.split('-');
  if (parts.length >= 2) {
    const direction = parts.pop() as SortDirection;
    const key = parts.join('-');
    
    if (direction === 'asc' || direction === 'desc') {
      return { key, direction };
    }
  }
  return null;
}

/**
 * Get default sort for data type
 */
export function getDefaultSort(dataType: 'products' | 'orders' | 'artisans'): SortConfig {
  switch (dataType) {
    case 'products':
      return { key: 'name', direction: 'asc', type: 'string' };
    case 'orders':
      return { key: 'createdAt', direction: 'desc', type: 'date' };
    case 'artisans':
      return { key: 'name', direction: 'asc', type: 'string' };
    default:
      return { key: 'id', direction: 'asc', type: 'string' };
  }
}

/**
 * Apply smart sorting for search results
 */
export function applySmartsort<T>(
  data: T[],
  searchTerm?: string,
  primarySort?: SortConfig
): T[] {
  if (!searchTerm) {
    return primarySort ? sortData(data, primarySort) : data;
  }
  
  // Create relevance scores for search results
  const scoredData = data.map(item => ({
    item,
    relevanceScore: calculateRelevanceScore(item, searchTerm)
  }));
  
  // Sort by relevance first, then by primary sort if scores are equal
  return scoredData
    .sort((a, b) => {
      const relevanceDiff = b.relevanceScore - a.relevanceScore;
      
      if (relevanceDiff !== 0) {
        return relevanceDiff;
      }
      
      // If relevance scores are equal, apply primary sort
      if (primarySort) {
        const aValue = getNestedValue(a.item, primarySort.key);
        const bValue = getNestedValue(b.item, primarySort.key);
        const result = compareValues(aValue, bValue, primarySort.type);
        return primarySort.direction === 'desc' ? -result : result;
      }
      
      return 0;
    })
    .map(scored => scored.item);
}

/**
 * Get sort indicators for UI
 */
export function getSortIndicator(
  currentSort: SortConfig | undefined,
  columnKey: string
): 'asc' | 'desc' | 'none' {
  if (!currentSort || currentSort.key !== columnKey) {
    return 'none';
  }
  return currentSort.direction;
}

/**
 * Create next sort configuration for column click
 */
export function getNextSort(
  currentSort: SortConfig | undefined,
  columnKey: string,
  defaultDirection: SortDirection = 'asc'
): SortConfig {
  if (!currentSort || currentSort.key !== columnKey) {
    return { key: columnKey, direction: defaultDirection };
  }
  
  return {
    key: columnKey,
    direction: toggleSortDirection(currentSort.direction)
  };
}

// Helper functions
function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((current, prop) => current?.[prop], obj);
}

function compareValues(a: any, b: any, type: SortConfig['type']): number {
  // Handle null/undefined values
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
  if (b === null || b === undefined) return 1;
  
  switch (type) {
    case 'number':
      return Number(a) - Number(b);
      
    case 'date':
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
      
    case 'boolean':
      return Number(b) - Number(a); // true values first
      
    case 'string':
    default:
      return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: 'base'
      });
  }
}

function calculateRelevanceScore(item: any, searchTerm: string): number {
  const term = searchTerm.toLowerCase();
  let score = 0;
  
  // Define searchable fields with weights
  const searchFields = [
    { key: 'name', weight: 10 },
    { key: 'title', weight: 10 },
    { key: 'description', weight: 5 },
    { key: 'category', weight: 3 },
    { key: 'artisan', weight: 3 },
    { key: 'materials', weight: 2 },
    { key: 'tags', weight: 2 }
  ];
  
  searchFields.forEach(({ key, weight }) => {
    const value = getNestedValue(item, key);
    if (value) {
      const text = Array.isArray(value) ? value.join(' ') : String(value);
      const lowerText = text.toLowerCase();
      
      // Exact match gets highest score
      if (lowerText === term) {
        score += weight * 10;
      }
      // Starts with search term
      else if (lowerText.startsWith(term)) {
        score += weight * 5;
      }
      // Contains search term
      else if (lowerText.includes(term)) {
        score += weight * 2;
      }
      // Word boundaries match
      else if (new RegExp(`\\b${term}\\b`).test(lowerText)) {
        score += weight * 3;
      }
    }
  });
  
  return score;
}
