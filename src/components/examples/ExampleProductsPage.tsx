// Example usage of the pagination, filter, and sort utilities
// This can be used as a reference for implementing in actual pages

import React, { useState } from 'react';
import { useDataTable } from '@/utils/useDataTable';
import { PRODUCT_SORT_OPTIONS } from '@/utils/sorting';
import { PRODUCTS } from '@/data/products';
import { Pagination } from '@/components/ui/Pagination';
import { SortSelect } from '@/components/ui/Sort';
import { FilterPanel, MobileFilterModal } from '@/components/ui/Filters';

export default function ExampleProductsPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const {
    paginatedData,
    filteredData,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    sortConfig,
    sortBy,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    hasFilters,
    reset
  } = useDataTable({
    data: PRODUCTS,
    initialPageSize: 12,
    dataType: 'products',
    searchFields: ['name', 'description', 'artisan', 'category', 'materials']
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-600">
          Discover unique handcrafted items from talented artisans
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            data={PRODUCTS}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Controls */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {hasFilters && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </button>

                {/* Sort */}
                <SortSelect
                  options={PRODUCT_SORT_OPTIONS}
                  currentSort={sortConfig}
                  onSortChange={sortBy}
                  className="min-w-[200px]"
                />

                {/* Reset */}
                {(hasFilters || searchTerm || sortConfig) && (
                  <button
                    onClick={reset}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Reset all
                  </button>
                )}
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing {paginatedData.pagination.startIndex}-{paginatedData.pagination.endIndex} of {paginatedData.pagination.totalItems} products
                {(hasFilters || searchTerm) && (
                  <span> (filtered from {PRODUCTS.length} total)</span>
                )}
              </div>
              
              {(hasFilters || searchTerm) && (
                <div className="text-blue-600">
                  {hasFilters && <span>Filters applied</span>}
                  {hasFilters && searchTerm && <span> • </span>}
                  {searchTerm && <span>Search: "{searchTerm}"</span>}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedData.data.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {product.artisan}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current">
                        <path d="M12 2l2.4 7.4h7.6l-6 4.3 2.3 7.3-6.3-4.6-6.3 4.6 2.3-7.3-6-4.3h7.6z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Featured
                      </span>
                    )}
                    {product.onSale && (
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        Sale
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {paginatedData.data.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3M4 13h3m0 0V9a2 2 0 012-2h4a2 2 0 012 2v4M7 13h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
              <div className="mt-6">
                <button
                  onClick={reset}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              pagination={paginatedData.pagination}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
              className="mt-8"
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      >
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          data={PRODUCTS}
          onToggle={() => setIsMobileFilterOpen(false)}
        />
      </MobileFilterModal>
    </div>
  );
}
