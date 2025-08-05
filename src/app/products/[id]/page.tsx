'use client';

import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { useCartActions } from '@/contexts/CartContext';
import WishlistIcon from '@/components/wishlist/WishlistIcon';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { ReviewForm, ReviewDisplay, ReviewSummary } from '@/components/ui/Reviews';
import { PRODUCTS, getProductById } from '@/data/products';

// Sample reviews data
const sampleReviews = [
  // Reviews for Ceramic Bowl (ID 1)
  {
    id: "1",
    productId: 1,
    userId: "user1",
    userName: "Sarah Johnson",
    rating: 5,
    title: "Absolutely Beautiful!",
    content: "This bowl exceeded my expectations. The craftsmanship is incredible and it's become the centerpiece of my dining table. Maria's work is truly exceptional.",
    photos: [],
    date: new Date("2024-01-15"),
    verified: true,
    helpful: 12
  },
  {
    id: "2",
    productId: 1,
    userId: "user2",
    userName: "Michael Chen",
    rating: 5,
    title: "Perfect for serving",
    content: "Great size for salads and pasta. The natural glaze has such a lovely finish. Fast shipping and careful packaging too.",
    photos: [],
    date: new Date("2024-01-10"),
    verified: true,
    helpful: 8
  },
  {
    id: "3",
    productId: 1,
    userId: "user3",
    userName: "Elena Vasquez",
    rating: 4,
    title: "Beautiful but smaller than expected",
    content: "Love the artistry and quality, though it's a bit smaller than I imagined. Still very happy with the purchase!",
    photos: [],
    date: new Date("2024-01-05"),
    verified: true,
    helpful: 5
  },
  // Reviews for Macrame Wall Hanging (ID 2)
  {
    id: "4",
    productId: 2,
    userId: "user4",
    userName: "Jennifer Smith",
    rating: 5,
    title: "Stunning wall art!",
    content: "Sarah's macrame work is absolutely gorgeous. It's the perfect size for my living room and the quality is outstanding.",
    photos: [],
    date: new Date("2024-01-20"),
    verified: true,
    helpful: 15
  },
  {
    id: "5",
    productId: 2,
    userId: "user5",
    userName: "David Wilson",
    rating: 4,
    title: "Great craftsmanship",
    content: "Beautiful piece that adds a boho touch to our bedroom. Well-made and shipped carefully.",
    photos: [],
    date: new Date("2024-01-12"),
    verified: true,
    helpful: 9
  },
  // Reviews for Glass Art Vase (ID 5)
  {
    id: "6",
    productId: 5,
    userId: "user6",
    userName: "Amanda Taylor",
    rating: 5,
    title: "Gorgeous vase!",
    content: "Emma's glass work is amazing. The colors are even more beautiful in person. Perfect for my dining room table.",
    photos: [],
    date: new Date("2024-01-18"),
    verified: true,
    helpful: 11
  },
  // Reviews for Knitted Wool Scarf (ID 6)
  {
    id: "7",
    productId: 6,
    userId: "user7",
    userName: "Lisa Brown",
    rating: 4,
    title: "So soft and warm",
    content: "Beautiful scarf with traditional patterns. The wool quality is excellent and it's very comfortable to wear.",
    photos: [],
    date: new Date("2024-01-14"),
    verified: true,
    helpful: 7
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id ? parseInt(params.id as string) : 1;
  const { addItem } = useCartActions();
  
  // Get product from centralized data source
  const product = getProductById(productId) || PRODUCTS[0];
  const productReviews = sampleReviews.filter(review => review.productId === product.id);

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
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={`${product.name} by ${product.artisan}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onLoad={() => {
                    console.log(`✅ Main image loaded successfully: ${product.name} - ${product.images[0]}`);
                  }}
                  onError={(e) => {
                    console.log(`❌ Main image failed to load: ${product.name} - ${product.images[0]}`);
                    // Fallback to gradient background if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, idx) => (
                <Card key={idx} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="relative w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} view ${idx + 2}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onLoad={() => {
                        console.log(`✅ Thumbnail ${idx + 2} loaded successfully: ${product.name} - ${image}`);
                      }}
                      onError={(e) => {
                        console.log(`❌ Thumbnail ${idx + 2} failed to load: ${product.name} - ${image}`);
                        // Fallback to gradient background if image fails
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
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

        {/* Reviews Section */}
        <section className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <ReviewSummary
                  reviews={productReviews}
                  averageRating={product.rating}
                  totalReviews={productReviews.length}
                />
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <ReviewForm
                    productId={product.id}
                    onSubmit={(review) => {
                      console.log('Review submitted:', review);
                      // In a real app, this would send to an API
                    }}
                    onCancel={() => {
                      console.log('Review cancelled');
                      // In a real app, this would hide the form
                    }}
                  />
                </div>
              </Card>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Reviews ({productReviews.length})
                </h2>
                <div className="flex items-center space-x-4">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>

              {productReviews.length > 0 ? (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <ReviewDisplay
                      key={review.id}
                      review={review}
                      onHelpful={(reviewId: string) => console.log('Marked helpful:', reviewId)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <i className="ri-chat-3-line text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to share your thoughts about this product!</p>
                  <Button>Write First Review</Button>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
