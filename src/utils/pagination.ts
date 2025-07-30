// Pagination utilities for consistent pagination across all pages

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startIndex: number;
    endIndex: number;
  };
}

/**
 * Paginate any array of data
 */
export function paginateData<T>(
  data: T[],
  page: number = 1,
  limit: number = 6
): PaginationResult<T> {
  const currentPage = Math.max(1, page);
  const itemsPerPage = Math.max(1, limit);
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1, // 1-based for display
      endIndex: Math.min(endIndex, totalItems)
    }
  };
}

/**
 * Generate page numbers array for pagination UI
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | '...')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const pages: (number | '...')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);
  
  // Always show first page
  pages.push(1);
  
  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);
  
  // Adjust range if we're near the beginning or end
  if (currentPage <= halfVisible + 1) {
    end = Math.min(totalPages - 1, maxVisible - 1);
  }
  
  if (currentPage >= totalPages - halfVisible) {
    start = Math.max(2, totalPages - maxVisible + 2);
  }
  
  // Add ellipsis if there's a gap after first page
  if (start > 2) {
    pages.push('...');
  }
  
  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  // Add ellipsis if there's a gap before last page
  if (end < totalPages - 1) {
    pages.push('...');
  }
  
  // Always show last page (if more than 1 page)
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
}

/**
 * Calculate pagination info text
 */
export function getPaginationInfo(pagination: PaginationResult<any>['pagination']): string {
  const { startIndex, endIndex, totalItems } = pagination;
  
  if (totalItems === 0) {
    return 'No items found';
  }
  
  if (totalItems === 1) {
    return 'Showing 1 item';
  }
  
  return `Showing ${startIndex}-${endIndex} of ${totalItems} items`;
}

/**
 * Get pagination metadata for SEO
 */
export function getPaginationMeta(
  currentPage: number,
  totalPages: number,
  baseUrl: string
) {
  const meta: { [key: string]: string } = {};
  
  if (currentPage > 1) {
    meta.prev = `${baseUrl}?page=${currentPage - 1}`;
  }
  
  if (currentPage < totalPages) {
    meta.next = `${baseUrl}?page=${currentPage + 1}`;
  }
  
  if (totalPages > 1) {
    meta.first = `${baseUrl}?page=1`;
    meta.last = `${baseUrl}?page=${totalPages}`;
  }
  
  return meta;
}

/**
 * Validate and normalize page number
 */
export function validatePageNumber(
  page: string | number | undefined,
  totalPages: number
): number {
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page || 1;
  
  if (isNaN(pageNum) || pageNum < 1) {
    return 1;
  }
  
  return Math.min(pageNum, totalPages);
}

/**
 * Create pagination URL with preserved query parameters
 */
export function createPaginationUrl(
  baseUrl: string,
  page: number,
  existingParams: Record<string, string | string[]> = {}
): string {
  const url = new URL(baseUrl, window.location.origin);
  
  // Add existing parameters
  Object.entries(existingParams).forEach(([key, value]) => {
    if (key !== 'page') { // Don't duplicate page param
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, value);
      }
    }
  });
  
  // Add page parameter
  if (page > 1) {
    url.searchParams.set('page', page.toString());
  } else {
    url.searchParams.delete('page'); // Clean URL for first page
  }
  
  return url.pathname + url.search;
}
