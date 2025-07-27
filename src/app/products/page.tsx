'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { SelectDropdown } from '@/components/ui/Dropdown';
import Link from 'next/link';
import { useCartActions } from '@/contexts/CartContext';

interface Product {
  id: number;
  name: string;
  artisan: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  onSale?: boolean;
  featured?: boolean;
  description: string;
  materials: string[];
}

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const { addItem } = useCartActions();

  // Expanded product data following team 13 patterns
  const products: Product[] = [
    {
      id: 1,
      name: "Handwoven Ceramic Bowl",
      artisan: "Maria Rodriguez",
      price: 45,
      originalPrice: 60,
      rating: 4.8,
      reviews: 23,
      image: "/api/placeholder/400/400",
      category: "pottery",
      onSale: true,
      featured: true,
      description: "A beautiful handwoven ceramic bowl perfect for serving or as a decorative piece.",
      materials: ["Ceramic", "Natural Glaze"]
    },
    {
      id: 2,
      name: "Macrame Wall Hanging",
      artisan: "Sarah Chen",
      price: 78,
      rating: 4.9,
      reviews: 31,
      image: "/api/placeholder/400/400",
      category: "textiles",
      featured: true,
      description: "Intricate macrame wall hanging that adds bohemian charm to any space.",
      materials: ["Cotton Cord", "Wooden Ring"]
    },
    {
      id: 3,
      name: "Wooden Cutting Board",
      artisan: "James Wilson",
      price: 35,
      rating: 4.7,
      reviews: 18,
      image: "/api/placeholder/400/400",
      category: "woodwork",
      description: "Durable hardwood cutting board with natural grain patterns.",
      materials: ["Maple Wood", "Food-Safe Finish"]
    },
    {
      id: 4,
      name: "Silver Wire Wrapped Pendant",
      artisan: "Elena Popov",
      price: 52,
      originalPrice: 68,
      rating: 5.0,
      reviews: 12,
      image: "/api/placeholder/400/400",
      category: "jewelry",
      onSale: true,
      description: "Elegant silver wire wrapped pendant with natural stone centerpiece.",
      materials: ["Sterling Silver", "Natural Stone"]
    },
    {
      id: 5,
      name: "Quilted Table Runner",
      artisan: "Rose Thompson",
      price: 89,
      rating: 4.6,
      reviews: 15,
      image: "/api/placeholder/400/400",
      category: "textiles",
      description: "Beautifully quilted table runner with geometric patterns.",
      materials: ["Cotton Fabric", "Cotton Batting"]
    },
    {
      id: 6,
      name: "Hand-Carved Wooden Spoons Set",
      artisan: "Michael Oak",
      price: 28,
      rating: 4.8,
      reviews: 42,
      image: "/api/placeholder/400/400",
      category: "woodwork",
      description: "Set of three hand-carved wooden spoons for cooking and serving.",
      materials: ["Cherry Wood", "Natural Oil Finish"]
    },
    {
      id: 7,
      name: "Ceramic Planter with Drainage",
      artisan: "Lisa Park",
      price: 65,
      originalPrice: 85,
      rating: 4.4,
      reviews: 28,
      image: "/api/placeholder/400/400",
      category: "pottery",
      onSale: true,
      description: "Modern ceramic planter with built-in drainage system.",
      materials: ["Stoneware Clay", "Matte Glaze"]
    },
    {
      id: 8,
      name: "Handmade Leather Wallet",
      artisan: "David Craft",
      price: 95,
      rating: 4.9,
      reviews: 37,
      image: "/api/placeholder/400/400",
      category: "leather",
      featured: true,
      description: "Premium handcrafted leather wallet with multiple card slots.",
      materials: ["Full Grain Leather", "Waxed Thread"]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pottery', label: 'Pottery & Ceramics' },
    { value: 'textiles', label: 'Textiles & Fiber' },
    { value: 'woodwork', label: 'Woodworking' },
    { value: 'jewelry', label: 'Jewelry & Metalwork' },
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

  // Filter and sort logic
  const filteredProducts = products
    .filter(product => {
      if (filterCategory !== 'all' && product.category !== filterCategory) return false;
      
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
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover unique handcrafted items from talented artisans around the world
            </p>
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
                    <div 
                      className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
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
                    <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 text-gray-600 rounded-full hover:bg-white hover:text-red-500 transition-colors">
                      <i className="ri-heart-line"></i>
                    </button>
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
