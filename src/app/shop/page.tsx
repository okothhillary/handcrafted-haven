'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useCartActions } from '@/contexts/CartContext';
import WishlistIcon from '@/components/wishlist/WishlistIcon';
import SearchBar from '@/components/search/SearchBar';
import { useDataTable } from '@/utils/useDataTable';
import { PRODUCT_SORT_OPTIONS } from '@/utils/sorting';
import { PRODUCTS } from '@/data/products';
import { Pagination } from '@/components/ui/Pagination';
import { SortSelect } from '@/components/ui/Sort';

export default function ShopPage() {
  const { addItem } = useCartActions();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Shop', isCurrentPage: true }
  ];

  const handleAddToCart = (product: any) => {
    addItem({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      artisan: product.artisan,
      materials: product.materials,
    });
  };

  const categories = [
    { id: 'pottery', name: 'Pottery', count: PRODUCTS.filter(p => p.category === 'pottery').length },
    { id: 'textiles', name: 'Textiles', count: PRODUCTS.filter(p => p.category === 'textiles').length },
    { id: 'woodwork', name: 'Woodwork', count: PRODUCTS.filter(p => p.category === 'woodwork').length },
    { id: 'glasswork', name: 'Glasswork', count: PRODUCTS.filter(p => p.category === 'glasswork').length },
    { id: 'jewelry', name: 'Jewelry', count: PRODUCTS.filter(p => p.category === 'jewelry').length },
    { id: 'metalwork', name: 'Metalwork', count: PRODUCTS.filter(p => p.category === 'metalwork').length },
  ];

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const categories = currentCategories.includes(category)
      ? currentCategories.filter((c: string) => c !== category)
      : [...currentCategories, category];
    setFilters({ ...filters, categories });
  };

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title="Shop Handcrafted Items"
    >
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Categories - Desktop */}
        <div className="lg:col-span-1 hidden lg:block">
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category.id) || false}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-amber-700">
                      {category.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">
                      ({category.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Results Summary and Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-sm text-gray-600">
              {filteredData.length > 0 ? (
                <span>
                  Showing {paginatedData.data.length} of {filteredData.length} products
                </span>
              ) : (
                <span>No products found</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'list'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Sort Dropdown */}
              <SortSelect
                options={PRODUCT_SORT_OPTIONS}
                currentSort={sortConfig}
                onSortChange={sortBy}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />

              {hasFilters && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {(filters.categories?.length || 0) + 
                   (filters.rating ? 1 : 0) + 
                   (filters.availability && filters.availability !== 'all' ? 1 : 0)}
                </span>
              )}
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-4m-4 0h-4m-4 0H4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button 
                variant="secondary" 
                onClick={reset}
                className="mt-4"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedData.data.map((product: any) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <WishlistIcon product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            artisan: product.artisan,
                            rating: product.rating,
                            category: product.category,
                          }} />
                        </div>
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-700 cursor-pointer mb-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">by {product.artisan}</p>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-amber-600">
                            ${product.price}
                          </span>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedData.data.map((product: any) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex">
                        <div className="relative w-32 h-24 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Link href={`/products/${product.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-700 cursor-pointer mb-1">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-600 mb-2">by {product.artisan}</p>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <WishlistIcon product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                artisan: product.artisan,
                                rating: product.rating,
                                category: product.category,
                              }} />
                              <span className="text-xl font-bold text-amber-600">
                                ${product.price}
                              </span>
                              <Button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
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
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
