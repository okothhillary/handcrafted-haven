// Filter utilities for consistent filtering across products, orders, and other data

export interface FilterConfig {
  key: string;
  value: any;
  operator?: 'equals' | 'includes' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'range' | 'in';
  caseSensitive?: boolean;
}

export interface RangeFilter {
  min?: number;
  max?: number;
}

export interface ProductFilters {
  categories?: string[];
  priceRange?: RangeFilter;
  rating?: number;
  artisan?: string[];
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  materials?: string[];
  search?: string;
}

export interface OrderFilters {
  status?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  priceRange?: RangeFilter;
  search?: string;
}

/**
 * Apply filters to any array of data
 */
export function applyFilters<T>(data: T[], filters: FilterConfig[]): T[] {
  if (!filters.length) return data;
  
  return data.filter(item => {
    return filters.every(filter => {
      const itemValue = getNestedValue(item, filter.key);
      return matchesFilter(itemValue, filter);
    });
  });
}

/**
 * Apply product-specific filters
 */
export function applyProductFilters(data: any[], filters: ProductFilters): any[] {
  return data.filter(product => {
    // Category filter
    if (filters.categories?.length) {
      if (!filters.categories.includes(product.category)) {
        return false;
      }
    }
    
    // Price range filter
    if (filters.priceRange) {
      const price = product.price;
      if (filters.priceRange.min !== undefined && price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== undefined && price > filters.priceRange.max) {
        return false;
      }
    }
    
    // Rating filter
    if (filters.rating !== undefined && product.rating < filters.rating) {
      return false;
    }
    
    // Artisan filter
    if (filters.artisan?.length) {
      if (!filters.artisan.includes(product.artisan)) {
        return false;
      }
    }
    
    // Stock filter
    if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
      return false;
    }
    
    // Sale filter
    if (filters.onSale !== undefined && Boolean(product.onSale) !== filters.onSale) {
      return false;
    }
    
    // Featured filter
    if (filters.featured !== undefined && Boolean(product.featured) !== filters.featured) {
      return false;
    }
    
    // Materials filter
    if (filters.materials?.length) {
      const productMaterials = product.materials || [];
      const hasMatchingMaterial = filters.materials.some(material =>
        productMaterials.some((pm: string) =>
          pm.toLowerCase().includes(material.toLowerCase())
        )
      );
      if (!hasMatchingMaterial) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        product.name,
        product.description,
        product.artisan,
        product.category,
        ...(product.materials || [])
      ].filter(Boolean);
      
      const matchesSearch = searchableFields.some(field =>
        field.toLowerCase().includes(searchTerm)
      );
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Apply order-specific filters
 */
export function applyOrderFilters(data: any[], filters: OrderFilters): any[] {
  return data.filter(order => {
    // Status filter
    if (filters.status?.length) {
      if (!filters.status.includes(order.status)) {
        return false;
      }
    }
    
    // Date range filter
    if (filters.dateRange) {
      const orderDate = new Date(order.createdAt || order.date);
      
      if (filters.dateRange.start && orderDate < filters.dateRange.start) {
        return false;
      }
      
      if (filters.dateRange.end && orderDate > filters.dateRange.end) {
        return false;
      }
    }
    
    // Price range filter
    if (filters.priceRange) {
      const total = order.total || order.totalAmount;
      
      if (filters.priceRange.min !== undefined && total < filters.priceRange.min) {
        return false;
      }
      
      if (filters.priceRange.max !== undefined && total > filters.priceRange.max) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        order.id,
        order.customerName,
        order.customerEmail,
        ...(order.items?.map((item: any) => item.name) || [])
      ].filter(Boolean);
      
      const matchesSearch = searchableFields.some(field =>
        String(field).toLowerCase().includes(searchTerm)
      );
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Get unique values for filter options
 */
export function getFilterOptions<T>(
  data: T[],
  key: string,
  transform?: (value: any) => any
): Array<{ value: any; label: string; count: number }> {
  const counts = new Map<any, number>();
  
  data.forEach(item => {
    const value = getNestedValue(item, key);
    if (value !== undefined && value !== null) {
      const processedValue = transform ? transform(value) : value;
      
      if (Array.isArray(processedValue)) {
        processedValue.forEach(v => {
          counts.set(v, (counts.get(v) || 0) + 1);
        });
      } else {
        counts.set(processedValue, (counts.get(processedValue) || 0) + 1);
      }
    }
  });
  
  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: String(value),
      count
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get price range from data
 */
export function getPriceRange(data: any[], priceKey: string = 'price'): RangeFilter {
  if (!data.length) return { min: 0, max: 100 };
  
  const prices = data
    .map(item => getNestedValue(item, priceKey))
    .filter(price => typeof price === 'number' && !isNaN(price));
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Create filter summary text
 */
export function getFilterSummary(filters: ProductFilters): string {
  const parts: string[] = [];
  
  if (filters.categories?.length) {
    parts.push(`${filters.categories.length} categories`);
  }
  
  if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) {
    const min = filters.priceRange.min ?? 0;
    const max = filters.priceRange.max ?? '∞';
    parts.push(`$${min} - $${max}`);
  }
  
  if (filters.rating !== undefined) {
    parts.push(`${filters.rating}+ stars`);
  }
  
  if (filters.artisan?.length) {
    parts.push(`${filters.artisan.length} artisans`);
  }
  
  if (filters.inStock) {
    parts.push('in stock');
  }
  
  if (filters.onSale) {
    parts.push('on sale');
  }
  
  if (filters.featured) {
    parts.push('featured');
  }
  
  if (filters.search) {
    parts.push(`"${filters.search}"`);
  }
  
  return parts.length ? parts.join(', ') : 'All products';
}

/**
 * Clear all filters
 */
export function clearFilters(): ProductFilters {
  return {};
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: ProductFilters): boolean {
  return Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined);
    }
    return value !== undefined && value !== null && value !== '';
  });
}

// Helper functions
function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((current, prop) => current?.[prop], obj);
}

function matchesFilter(value: any, filter: FilterConfig): boolean {
  const { value: filterValue, operator = 'equals', caseSensitive = false } = filter;
  
  if (value === undefined || value === null) return false;
  
  // Normalize for case sensitivity
  const normalizeValue = (val: any) => {
    if (typeof val === 'string' && !caseSensitive) {
      return val.toLowerCase();
    }
    return val;
  };
  
  const normalizedValue = normalizeValue(value);
  const normalizedFilterValue = normalizeValue(filterValue);
  
  switch (operator) {
    case 'equals':
      return normalizedValue === normalizedFilterValue;
      
    case 'includes':
      return String(normalizedValue).includes(String(normalizedFilterValue));
      
    case 'startsWith':
      return String(normalizedValue).startsWith(String(normalizedFilterValue));
      
    case 'endsWith':
      return String(normalizedValue).endsWith(String(normalizedFilterValue));
      
    case 'gt':
      return Number(value) > Number(filterValue);
      
    case 'gte':
      return Number(value) >= Number(filterValue);
      
    case 'lt':
      return Number(value) < Number(filterValue);
      
    case 'lte':
      return Number(value) <= Number(filterValue);
      
    case 'range':
      const num = Number(value);
      const { min, max } = filterValue as RangeFilter;
      return (min === undefined || num >= min) && (max === undefined || num <= max);
      
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(normalizedValue);
      
    default:
      return normalizedValue === normalizedFilterValue;
  }
}
