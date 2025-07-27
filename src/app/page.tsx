'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  // Sample data following team 13 patterns
  const featuredProducts = [
    {
      id: 1,
      name: "Handwoven Ceramic Bowl",
      artisan: "Maria Rodriguez",
      price: 45,
      originalPrice: 60,
      rating: 4.8,
      reviews: 23,
      image: "/api/placeholder/400/400",
      onSale: true
    },
    {
      id: 2,
      name: "Macrame Wall Hanging",
      artisan: "Sarah Chen",
      price: 78,
      rating: 4.9,
      reviews: 31,
      image: "/api/placeholder/400/400"
    },
    {
      id: 3,
      name: "Wooden Cutting Board",
      artisan: "James Wilson",
      price: 35,
      rating: 4.7,
      reviews: 18,
      image: "/api/placeholder/400/400"
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
      onSale: true
    }
  ];

  const categories = [
    {
      name: "Pottery & Ceramics",
      count: 156,
      image: "/api/placeholder/300/200",
      href: "/products/pottery"
    },
    {
      name: "Textiles & Fiber",
      count: 234,
      image: "/api/placeholder/300/200",
      href: "/products/textiles"
    },
    {
      name: "Woodworking",
      count: 187,
      image: "/api/placeholder/300/200",
      href: "/products/woodwork"
    },
    {
      name: "Jewelry & Metalwork",
      count: 298,
      image: "/api/placeholder/300/200",
      href: "/products/jewelry"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Following team 13 hero patterns */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative text-center text-gray-900 max-w-4xl px-4 z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Unique
            <span className="block text-amber-600">Handcrafted Treasures</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Support talented artisans and find one-of-a-kind handmade items that tell a story
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="px-8 py-4 text-lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/artisans">
              <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
                Meet Artisans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Following team 13 category patterns */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of handmade items across various crafts and traditions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <div className="group cursor-pointer">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">{category.count} items</p>
                    </div>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Following team 13 product grid patterns */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional handmade items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300">
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="px-4 py-2 text-sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Following team 13 value proposition patterns */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Handcrafted Haven</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're more than just a marketplace - we're a community supporting artisans and sustainable craftsmanship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full mx-auto mb-6">
                <i className="ri-hand-heart-line text-2xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Authentic Handmade</h3>
              <p className="text-gray-600">
                Every item is genuinely handcrafted by skilled artisans, ensuring uniqueness and quality in every piece.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full mx-auto mb-6">
                <i className="ri-earth-line text-2xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sustainable Impact</h3>
              <p className="text-gray-600">
                Support eco-friendly practices and reduce environmental impact through conscious consumption of handmade goods.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full mx-auto mb-6">
                <i className="ri-community-line text-2xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Artisan Community</h3>
              <p className="text-gray-600">
                Connect directly with makers, learn their stories, and support local craftspeople around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Following team 13 newsletter patterns */}
      <section className="py-20 bg-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Stay Connected</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get updates on new artisans, featured products, and exclusive offers
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <Button type="submit" className="px-8 py-4 rounded-full whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Development Progress Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              🎉 Phase 3.1: Homepage Implementation Complete
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-green-600 mb-2">✅ Hero Section</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Compelling brand messaging</li>
                  <li>• Call-to-action buttons</li>
                  <li>• Responsive design</li>
                  <li>• Team 13 pattern integration</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-green-600 mb-2">✅ Content Sections</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Category showcase with navigation</li>
                  <li>• Featured products grid</li>
                  <li>• Value proposition messaging</li>
                  <li>• Newsletter signup form</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Ready for Phase 3.2:</strong> Featured Products Section enhancement with backend integration
              </p>
              <div className="mt-2">
                <Link href="/components-demo">
                  <Button variant="secondary" size="sm">
                    View Component Demo
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
