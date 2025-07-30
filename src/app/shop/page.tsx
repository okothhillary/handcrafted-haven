'use client';

import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useSearch } from '@/contexts/SearchContext';
import { useCartActions } from '@/contexts/CartContext';
import WishlistIcon from '@/components/wishlist/WishlistIcon';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';

export default function ShopPage() {
  const { state, search, updateFilters } = useSearch();
  const { addItem } = useCartActions();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Load all products when the shop page loads
    if (state.results.length === 0 && !state.isLoading) {
      search(''); // Empty search to show all products
    }
  }, []);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Shop', isCurrentPage: true }
  ];

  const handleCategoryToggle = (category: string) => {
    const categories = state.filters.categories.includes(category)
      ? state.filters.categories.filter(c => c !== category)
      : [...state.filters.categories, category];
    updateFilters({ categories });
  };

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
    { id: 'pottery', name: 'Pottery', count: 24 },
    { id: 'leather', name: 'Leather Goods', count: 18 },
    { id: 'textiles', name: 'Textiles', count: 32 },
    { id: 'woodwork', name: 'Woodwork', count: 15 },
    { id: 'glasswork', name: 'Glasswork', count: 12 },
    { id: 'jewelry', name: 'Jewelry', count: 28 },
  ];

  return (
    <PageLayout 
      title="Shop Handcrafted Treasures"
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={true}
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Unique Handcrafted Items
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our curated collection of handmade treasures from talented artisans around the world. 
            Each piece tells a story and supports independent creators.
          </p>
          <div className="max-w-lg mx-auto">
            <SearchBar />
          </div>
        </div>

        {/* Category Quick Links */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  state.filters.categories.includes(category.id)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">
                  {category.id === 'pottery' && '🏺'}
                  {category.id === 'leather' && '👜'}
                  {category.id === 'textiles' && '🧶'}
                  {category.id === 'woodwork' && '🪵'}
                  {category.id === 'glasswork' && '🍷'}
                  {category.id === 'jewelry' && '💎'}
                </div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">{category.count} items</div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            {state.totalResults > 0 ? (
              <p className="text-gray-600">
                Showing {state.results.length} of {state.totalResults} products
              </p>
            ) : (
              <p className="text-gray-600">Loading products...</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-grid-line"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-list-unordered"></i>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={state.filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>

            {/* Filters Toggle */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <i className="ri-filter-line mr-2"></i>
              Filters
              {(state.filters.categories.length > 0 || state.filters.rating > 0 || state.filters.availability !== 'all') && (
                <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {state.filters.categories.length + (state.filters.rating > 0 ? 1 : 0) + (state.filters.availability !== 'all' ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters
              filters={state.filters}
              onFiltersChange={updateFilters}
              onCategoryToggle={handleCategoryToggle}
            />
          </div>

          {/* Products Grid/List */}
          <div className="lg:col-span-3">
            {state.isLoading && state.results.length === 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className={`bg-gray-200 rounded-t-lg ${viewMode === 'grid' ? 'h-48' : 'h-32'}`}></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : state.results.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {state.results.map((product) => (
                    <Card key={product.id} className={`group cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
                      <div className={`relative ${viewMode === 'list' ? 'w-32 flex-shrink-0' : ''}`}>
                        <Link href={`/products/${product.id}`}>
                          <div className={`relative overflow-hidden ${
                            viewMode === 'grid' ? 'w-full h-48' : 'w-32 h-32'
                          } bg-gradient-to-br from-gray-100 to-gray-200 ${
                            viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg rounded-t-none'
                          }`}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className={`w-full h-full object-cover group-hover:opacity-90 transition-opacity`}
                              onLoad={() => {
                                console.log(`✅ Image loaded successfully: ${product.name} - ${product.image}`);
                              }}
                              onError={(e) => {
                                console.log(`❌ Image failed to load: ${product.name} - ${product.image}`);
                                // Fallback to gradient background if image fails
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </Link>
                        
                        {product.onSale && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Sale
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2">
                          <WishlistIcon 
                            product={{
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              originalPrice: product.originalPrice,
                              image: product.image,
                              artisan: product.artisan,
                              rating: product.rating,
                              category: product.category,
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 mb-2">by {product.artisan}</p>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={i} 
                                className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-sm`}
                              ></i>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                        
                        <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between mb-4'}`}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          {!product.inStock && (
                            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                          )}
                        </div>

                        {viewMode === 'grid' && (
                          <Button
                            onClick={() => handleAddToCart(product)}
                            variant="primary"
                            className="w-full"
                            size="sm"
                            disabled={!product.inStock}
                          >
                            <i className="ri-shopping-cart-line mr-2"></i>
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                        )}
                        
                        {viewMode === 'list' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              variant="primary"
                              size="sm"
                              disabled={!product.inStock}
                              className="flex-1"
                            >
                              <i className="ri-shopping-cart-line mr-2"></i>
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                {state.hasNextPage && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={() => search(state.query)}
                      variant="secondary"
                      size="lg"
                      disabled={state.isLoading}
                    >
                      {state.isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2"></div>
                          Loading...
                        </div>
                      ) : (
                        'Load More Products'
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <i className="ri-store-line text-6xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-600 mb-8">
                  Try adjusting your filters or search for something else.
                </p>
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-gray-500">Popular searches:</span>
                    {['pottery', 'handmade', 'artisan', 'unique'].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => search(suggestion)}
                        className="text-sm text-primary hover:text-primary-dark underline"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <Button 
                    variant="primary"
                    onClick={() => {
                      updateFilters({
                        categories: [],
                        priceRange: { min: 0, max: 1000 },
                        rating: 0,
                        availability: 'all',
                        sortBy: 'relevance'
                      });
                      search('');
                    }}
                  >
                    View All Products
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
