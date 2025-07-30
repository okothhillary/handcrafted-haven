'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getArtisanById, getArtisanProfile } from '@/data/artisans';
import { getProductsByArtisanId } from '@/data/products';
import { getArtisanWithStats } from '@/utils/artisan';
import { Artisan, ArtisanStats } from '@/models/artisan';

export default function ArtisanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artisan, setArtisan] = useState<(Artisan & ArtisanStats) | null>(null);
  const [artisanProducts, setArtisanProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) {
      router.push('/artisans');
      return;
    }

    const artisanId = parseInt(params.id as string);
    
    if (isNaN(artisanId)) {
      router.push('/artisans');
      return;
    }

    // Get artisan with dynamic stats
    const artisanWithStats = getArtisanWithStats(artisanId);
    if (!artisanWithStats) {
      router.push('/artisans');
      return;
    }

    // Get artisan products
    const products = getProductsByArtisanId(artisanId);
    
    setArtisan(artisanWithStats);
    setArtisanProducts(products);
    setLoading(false);
  }, [params?.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artisan profile...</p>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artisan Not Found</h1>
          <p className="text-gray-600 mb-6">The artisan you're looking for doesn't exist.</p>
          <Link href="/artisans">
            <Button>Back to Artisans</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill text-amber-500"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill text-amber-500"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line text-gray-300"></i>);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/artisans" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Artisans
          </Link>
        </div>
      </div>

      {/* Artisan Profile Header */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Artisan Image */}
            <div className="mb-8 lg:mb-0">
              <div 
                className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${artisan.image})` }}
              />
            </div>

            {/* Artisan Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{artisan.name}</h1>
                {artisan.featured && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured Artisan
                  </span>
                )}
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <i className="ri-map-pin-line mr-2"></i>
                <span>{artisan.location}</span>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex text-lg mr-2">
                  {renderStars(artisan.rating)}
                </div>
                <span className="text-lg font-semibold text-gray-900 mr-2">
                  {artisan.rating}
                </span>
                <span className="text-gray-600">
                  ({artisan.reviews} reviews)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{artisan.products}</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{artisan.reviews}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{artisan.experience}</div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {artisan.specialties.map((specialty, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {artisan.bio}
              </p>

              {/* Contact Links */}
              <div className="flex flex-wrap gap-4">
                {artisan.website && (
                  <a 
                    href={artisan.website.startsWith('http') ? artisan.website : `https://${artisan.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    Visit Website
                  </a>
                )}
                {artisan.instagram && (
                  <a 
                    href={`https://instagram.com/${artisan.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                  >
                    <i className="ri-instagram-line mr-2"></i>
                    Follow on Instagram
                  </a>
                )}
                {artisan.email && (
                  <a 
                    href={`mailto:${artisan.email}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <i className="ri-mail-line mr-2"></i>
                    Send Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Products by {artisan.name} ({artisanProducts.length})
            </h2>
            <Link href={`/products?artisan=${encodeURIComponent(artisan.name)}`}>
              <Button variant="secondary">View All Products</Button>
            </Link>
          </div>

          {artisanProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisanProducts.slice(0, 6).map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-yellow-400 text-sm"></i>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                        {product.category}
                      </span>
                      {product.featured && (
                        <span className="inline-block ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Featured
                        </span>
                      )}
                      {product.onSale && (
                        <span className="inline-block ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Sale
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="ri-shopping-bag-line text-6xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600">
                {artisan.name} hasn't added any products to the marketplace yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
