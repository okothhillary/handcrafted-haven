'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function SearchContent() {
  const searchParams = useSearchParams();
  const { state, search, updateFilters } = useSearch();
  const { addItem } = useCartActions();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams?.get('q') || '';

  useEffect(() => {
    if (query && query !== state.query) {
      search(query);
    }
  }, [query]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Search Results', isCurrentPage: true }
  ];

  const handleFilterChange = (filterKey: keyof typeof state.filters, value: any) => {
    updateFilters({ [filterKey]: value });
  };

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

  return (
    <PageLayout 
      title={`Search Results${query ? ` for "${query}"` : ''}`}
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={true}
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SearchBar autoFocus={!query} />
        </div>

        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            {state.totalResults > 0 ? (
              <p className="text-gray-600">
                Found {state.totalResults} result{state.totalResults !== 1 ? 's' : ''}
                {query && <span> for "<strong>{query}</strong>"</span>}
              </p>
            ) : query ? (
              <p className="text-gray-600">No results found for "<strong>{query}</strong>"</p>
            ) : null}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={state.filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>

            {/* Filters Toggle */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <i className="ri-filter-line mr-2"></i>
              Filters
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

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {state.isLoading && state.results.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.results.map((product) => (
                    <Card key={product.id} className="group cursor-pointer">
                      <div className="relative">
                        <Link href={`/products/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
                          />
                        </Link>
                        
                        {product.onSale && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Sale
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4">
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
                      
                      <div className="p-4">
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
                        
                        <div className="flex items-center justify-between mb-4">
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
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                {state.hasNextPage && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={() => {}}
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
            ) : query ? (
              <div className="text-center py-16">
                <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                <p className="text-gray-600 mb-8">
                  We couldn't find any products matching "<strong>{query}</strong>". 
                  Try adjusting your search terms or filters.
                </p>
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-gray-500">Try searching for:</span>
                    {['pottery', 'handmade', 'artisan', 'crafts'].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => search(suggestion)}
                        className="text-sm text-primary hover:text-primary-dark underline"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <Link href="/products">
                    <Button variant="primary">Browse All Products</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start your search</h2>
                <p className="text-gray-600 mb-8">
                  Use the search bar above to find handcrafted items from talented artisans.
                </p>
                <Link href="/products">
                  <Button variant="primary">Browse All Products</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
