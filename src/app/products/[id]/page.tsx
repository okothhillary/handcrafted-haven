'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { useCartActions } from '@/contexts/CartContext';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { ReviewForm, ReviewDisplay, ReviewSummary, Review } from '@/components/ui/Reviews';
import { PRODUCTS, getProductById } from '@/data/products';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id ? parseInt(params.id as string) : 1;
  const { addItem } = useCartActions();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  
  // Get product from centralized data source
  const product = getProductById(productId) || PRODUCTS[0];

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const response = await fetch(`/api/products/${productId}/review`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
          setReviewStats({
            averageRating: data.averageRating || 0,
            totalReviews: data.totalReviews || 0,
            ratingDistribution: data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          });
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Handle review submission
  const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    try {
      const response = await fetch(`/api/products/${productId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: reviewData.userId,
          rating: reviewData.rating,
          comment: reviewData.content,
          verified: reviewData.verified
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setReviewStats({
          averageRating: data.averageRating || 0,
          totalReviews: data.totalReviews || 0,
          ratingDistribution: data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const productReviews = reviews;

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
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={product.images[0]}
                  alt={`${product.name} by ${product.artisan}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  onLoad={() => {
                    console.log(`✅ Main image loaded successfully: ${product.name} - ${product.images[0]}`);
                  }}
                  onError={() => {
                    console.log(`❌ Main image failed to load: ${product.name} - ${product.images[0]}`);
                  }}
                  priority
                />
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, idx) => (
                <Card key={idx} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="relative w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} view ${idx + 2}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-110"
                      onLoadingComplete={() => {
                        console.log(`✅ Thumbnail ${idx + 2} loaded successfully: ${product.name} - ${image}`);
                      }}
                      onError={() => {
                        console.log(`❌ Thumbnail ${idx + 2} failed to load: ${product.name} - ${image}`);
                        // Fallback logic can be handled here if needed
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
                  <i key={i} className={`ri-star-${i < Math.floor(reviewStats.averageRating || product.rating) ? 'fill' : 'line'}`}></i>
                ))}
              </div>
              <span className="text-gray-600">({reviewStats.totalReviews || 0} reviews)</span>
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
                {isLoadingReviews ? (
                  <div className="text-center py-6">
                    <i className="ri-loader-4-line animate-spin text-2xl text-gray-400"></i>
                    <p className="text-gray-600 mt-2">Loading reviews...</p>
                  </div>
                ) : (
                  <ReviewSummary
                    reviews={productReviews}
                    averageRating={reviewStats.averageRating}
                    totalReviews={reviewStats.totalReviews}
                  />
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <ReviewForm
                    productId={product.id}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => {
                      console.log('Review cancelled');
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

              {isLoadingReviews ? (
                <div className="text-center py-12">
                  <i className="ri-loader-4-line animate-spin text-3xl text-gray-400"></i>
                  <p className="text-gray-600 mt-4">Loading reviews...</p>
                </div>
              ) : productReviews.length > 0 ? (
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
