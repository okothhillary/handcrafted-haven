'use client';

import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useDataTable } from '@/utils/useDataTable';
import { PRODUCT_SORT_OPTIONS } from '@/utils/sorting';
import { PRODUCTS } from '@/data/products';
import { Pagination } from '@/components/ui/Pagination';
import { SortSelect } from '@/components/ui/Sort';

export default function UtilsDemoPage() {
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
    initialPageSize: 6,
    dataType: 'products',
    searchFields: ['name', 'description', 'artisan', 'category', 'materials']
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Utils Demo', isCurrentPage: true }
  ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title="Pagination, Filter & Sort Utils Demo"
    >
      <div className="space-y-6">
        {/* Demo Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Demo Controls</h2>
          
          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, artisan, category..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              {['pottery', 'textiles', 'woodwork', 'glasswork', 'jewelry', 'metalwork'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    const currentCategories = filters.categories || [];
                    const categories = currentCategories.includes(category)
                      ? currentCategories.filter((c: string) => c !== category)
                      : [...currentCategories, category];
                    setFilters({ ...filters, categories });
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.categories?.includes(category)
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort Products</label>
            <SortSelect
              options={PRODUCT_SORT_OPTIONS}
              currentSort={sortConfig}
              onSortChange={sortBy}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="secondary" onClick={reset}>
              Reset All Filters
            </Button>
            <div className="text-sm text-gray-600 flex items-center">
              Has filters: {hasFilters ? '✅ Yes' : '❌ No'}
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-600">{PRODUCTS.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{paginatedData.data.length}</div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{totalPages}</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredData.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button variant="secondary" onClick={reset}>
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.data.map((product: any) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">by {product.artisan}</p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        ⭐ {product.rating} ({product.reviews} reviews)
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 space-y-4">
                <div className="text-center text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} products
                </div>
                <Pagination
                  pagination={{
                    currentPage,
                    totalPages,
                    itemsPerPage: pageSize,
                    totalItems: filteredData.length,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1,
                    startIndex: (currentPage - 1) * pageSize + 1,
                    endIndex: Math.min(currentPage * pageSize, filteredData.length)
                  }}
                  onPageChange={goToPage}
                  onPageSizeChange={setPageSize}
                  pageSizes={[3, 6, 9, 12]}
                  showSizeSelector={true}
                />
              </div>
            )}
          </>
        )}

        {/* Developer Info */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">🔧 Developer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Current State:</strong>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>Search Term: "{searchTerm || 'None'}"</li>
                <li>Active Categories: {filters.categories?.length || 0}</li>
                <li>Sort: {sortConfig ? `${sortConfig.key} (${sortConfig.direction})` : 'None'}</li>
                <li>Page Size: {pageSize}</li>
              </ul>
            </div>
            <div>
              <strong>Utilities Used:</strong>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>✅ useDataTable hook</li>
                <li>✅ Pagination component</li>
                <li>✅ SortSelect component</li>
                <li>✅ Category filtering</li>
                <li>✅ Search functionality</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
