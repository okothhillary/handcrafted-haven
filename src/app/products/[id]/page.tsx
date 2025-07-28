'use client';

import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { useCartActions } from '@/contexts/CartContext';
import WishlistIcon from '@/components/wishlist/WishlistIcon';
import WishlistButton from '@/components/wishlist/WishlistButton';

// Sample product data (in a real app, this would come from an API)
const sampleProducts = [
  {
    id: 1,
    name: "Handwoven Ceramic Bowl",
    artisan: "Maria Rodriguez",
    price: 45,
    originalPrice: 60,
    rating: 4.8,
    reviews: 23,
    images: ["/api/placeholder/600/600", "/api/placeholder/600/600", "/api/placeholder/600/600"],
    category: "pottery",
    onSale: true,
    description: "A beautiful handwoven ceramic bowl perfect for serving or as a decorative piece. Each piece is individually crafted using traditional techniques passed down through generations.",
    materials: ["Ceramic", "Natural Glaze"],
    dimensions: "8\" diameter x 3\" height",
    careInstructions: "Hand wash only. Not microwave safe.",
    story: "Maria Rodriguez has been crafting pottery for over 20 years in her studio in Oaxaca, Mexico. Each piece reflects her deep connection to traditional Mexican ceramics while incorporating modern design elements."
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id ? parseInt(params.id as string) : 1;
  const { addItem } = useCartActions();
  
  // In a real app, you'd fetch this data based on the ID
  const product = sampleProducts.find(p => p.id === productId) || sampleProducts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div 
                className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${product.images[0]})` }}
              />
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, idx) => (
                <Card key={idx} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div 
                    className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.onSale && (
              <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                <i className="ri-fire-line mr-1"></i>
                On Sale
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">by {product.artisan}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'}`}></i>
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.onSale && (
                <span className="text-lg text-green-600 font-semibold">
                  Save ${product.originalPrice! - product.price}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                <p className="text-gray-600 text-sm">{product.dimensions}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full py-4 text-lg"
                onClick={() => addItem({
                  id: product.id,
                  name: product.name,
                  artisan: product.artisan,
                  price: product.price,
                  image: product.images[0],
                  materials: product.materials
                })}
              >
                <i className="ri-shopping-cart-line mr-2"></i>
                Add to Cart
              </Button>
              
              <div className="flex gap-4">
                <WishlistButton
                  product={{
                    id: product.id.toString(),
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.images[0],
                    artisan: product.artisan,
                    rating: product.rating,
                    category: product.category,
                  }}
                  className="flex-1"
                />
                <Button variant="secondary" className="flex-1">
                  <i className="ri-share-line mr-2"></i>
                  Share
                </Button>
              </div>
            </div>

            <Card className="p-6 bg-amber-50 border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">Artisan Story</h4>
              <p className="text-amber-800 text-sm leading-relaxed">{product.story}</p>
            </Card>

            <div className="text-sm text-gray-600">
              <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
              <p>{product.careInstructions}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">Related products feature coming soon!</p>
            <div className="mt-4">
              <Link href="/products">
                <Button variant="secondary">Browse All Products</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
