// Reusable Pagination Component

import React from 'react';
import { generatePageNumbers, getPaginationInfo, PaginationResult } from '@/utils/pagination';

interface PaginationProps {
  pagination: PaginationResult<any>['pagination'];
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  showSizeSelector?: boolean;
  pageSizes?: number[];
  onPageSizeChange?: (size: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({
  pagination,
  onPageChange,
  className = '',
  showInfo = true,
  showSizeSelector = true,
  pageSizes = [6, 12, 24, 48],
  onPageSizeChange,
  maxVisiblePages = 5
}: PaginationProps) {
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    itemsPerPage
  } = pagination;

  const pageNumbers = generatePageNumbers(currentPage, totalPages, maxVisiblePages);

  if (totalPages <= 1 && !showInfo) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Pagination Info */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          {getPaginationInfo(pagination)}
        </div>
      )}

      {/* Page Size Selector */}
      {showSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizes.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-gray-600">per page</span>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`
              px-3 py-2 text-sm font-medium rounded-md border transition-colors
              ${hasPrevPage
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
                : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              }
            `}
            aria-label="Previous page"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-sm text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              const isCurrentPage = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-md border transition-colors
                    ${isCurrentPage
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
                    }
                  `}
                  aria-label={`Go to page ${page}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`
              px-3 py-2 text-sm font-medium rounded-md border transition-colors
              ${hasNextPage
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
                : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              }
            `}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Simplified pagination for mobile
export function SimplePagination({
  pagination,
  onPageChange,
  className = ''
}: Pick<PaginationProps, 'pagination' | 'onPageChange' | 'className'>) {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`
          px-4 py-2 text-sm font-medium rounded-md border transition-colors
          ${hasPrevPage
            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
          }
        `}
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`
          px-4 py-2 text-sm font-medium rounded-md border transition-colors
          ${hasNextPage
            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
          }
        `}
      >
        Next
      </button>
    </div>
  );
}
