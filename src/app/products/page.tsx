'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { SelectDropdown } from '@/components/ui/Dropdown';
import Link from 'next/link';
import { useCartActions } from '@/contexts/CartContext';
import WishlistIcon from '@/components/wishlist/WishlistIcon';
import { PRODUCTS, type Product } from '@/data/products';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterArtisan, setFilterArtisan] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const { addItem } = useCartActions();

  // Handle URL parameters for artisan filtering
  useEffect(() => {
    const artisanParam = searchParams?.get('artisan');
    if (artisanParam) {
      setFilterArtisan(artisanParam);
    }
  }, [searchParams]);

  // Use centralized product data
  const products = PRODUCTS;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pottery', label: 'Pottery & Ceramics' },
    { value: 'textiles', label: 'Textiles & Fiber' },
    { value: 'woodwork', label: 'Woodworking' },
    { value: 'jewelry', label: 'Jewelry & Metalwork' },
    { value: 'metalwork', label: 'Metalwork' },
    { value: 'leather', label: 'Leather Goods' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: '$100+' }
  ];

  // Generate artisan filter options from products
  const uniqueArtisans = Array.from(new Set(products.map(product => product.artisan)));
  const artisanOptions = [
    { value: 'all', label: 'All Artisans' },
    ...uniqueArtisans.map(artisan => ({ value: artisan, label: artisan }))
  ];

  // Filter and sort logic
  const filteredProducts = products
    .filter(product => {
      if (filterCategory !== 'all' && product.category !== filterCategory) return false;
      if (filterArtisan !== 'all' && product.artisan !== filterArtisan) return false;
      
      if (priceRange !== 'all') {
        const [min, max] = priceRange.includes('+') 
          ? [parseInt(priceRange), Infinity]
          : priceRange.split('-').map(Number);
        if (product.price < min || product.price > max) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {filterArtisan !== 'all' ? `Products by ${filterArtisan}` : 'Our Products'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {filterArtisan !== 'all' 
                ? `Discover unique handcrafted items by ${filterArtisan}`
                : 'Discover unique handcrafted items from talented artisans around the world'
              }
            </p>
            {filterArtisan !== 'all' && (
              <div className="mt-4">
                <Link href="/artisans" className="inline-flex items-center text-amber-600 hover:text-amber-700">
                  <i className="ri-arrow-left-line mr-1"></i>
                  Back to All Artisans
                </Link>
              </div>
            )}
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <SelectDropdown
                value={filterCategory}
                onChange={setFilterCategory}
                options={categories}
                placeholder="Category"
                className="min-w-48"
              />
              <SelectDropdown
                value={filterArtisan}
                onChange={setFilterArtisan}
                options={artisanOptions}
                placeholder="Artisan"
                className="min-w-48"
              />
              <SelectDropdown
                value={priceRange}
                onChange={setPriceRange}
                options={priceRanges}
                placeholder="Price Range"
                className="min-w-48"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products found
              </span>
              <SelectDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                placeholder="Sort by"
                className="min-w-48"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                <Link href={`/products/${product.id}`}>
                  <div className="relative overflow-hidden">
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                    {product.onSale && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sale
                      </div>
                    )}
                    {product.featured && !product.onSale && (
                      <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <WishlistIcon 
                        product={{
                          id: product.id.toString(),
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
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-3">by {product.artisan}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex text-amber-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-sm`}></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {product.materials.slice(0, 2).map((material, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                
                <div className="px-6 pb-6">
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => addItem({
                      id: product.id,
                      name: product.name,
                      artisan: product.artisan,
                      price: product.price,
                      image: product.image,
                      materials: product.materials
                    })}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-search-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setFilterCategory('all');
                  setFilterArtisan('all');
                  setPriceRange('all');
                  setSortBy('featured');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Load More Section */}
      {filteredProducts.length > 0 && (
        <section className="py-12 text-center">
          <Button variant="secondary" size="lg" className="px-12">
            Load More Products
          </Button>
        </section>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    </div>}>
      <ProductsContent />
    </Suspense>
  );
}
