'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ARTISANS, getFeaturedArtisans, getAllSpecialties } from '@/data/artisans';
import { calculateArtisanStats } from '@/utils/artisan';
import { Artisan } from '@/models/artisan';

export default function ArtisansPage() {
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get specialties dynamically from artisan data
  const specialties = ['all', ...getAllSpecialties().map(s => s.toLowerCase())];

  // Filter artisans based on search and specialty filters
  const filteredArtisans = ARTISANS.filter(artisan => {
    const matchesSpecialty = filterSpecialty === 'all' || 
      artisan.specialties.some(specialty => specialty.toLowerCase().includes(filterSpecialty));
    const matchesSearch = searchQuery === '' ||
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSpecialty && matchesSearch;
  });

  const featuredArtisans = getFeaturedArtisans();

  // Helper function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="ri-star-fill text-amber-500"></i>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="ri-star-half-fill text-amber-500"></i>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="ri-star-line text-gray-300"></i>
      );
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our Artisans
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Discover the talented craftspeople behind every handmade treasure. Each artisan brings their unique story, 
            heritage, and passion to create exceptional pieces just for you.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Artisans */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Artisans</h2>
            <p className="text-xl text-gray-600">
              Spotlight on exceptional craftspeople making waves in the handmade community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArtisans.map((artisan) => {
              const stats = calculateArtisanStats(artisan.name);
              return (
              <Card key={artisan.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div 
                    className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${artisan.image})` }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{artisan.name}</h3>
                    <div className="flex items-center">
                      <div className="flex text-sm mr-2">
                        {renderStars(stats.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        ({stats.rating})
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    <i className="ri-map-pin-line mr-1"></i>
                    {artisan.location}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {artisan.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {artisan.bio}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{stats.products} product{stats.products !== 1 ? 's' : ''}</span>
                    <span>{stats.reviews} review{stats.reviews !== 1 ? 's' : ''}</span>
                    <span>{artisan.experience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Link href={`/products?artisan=${encodeURIComponent(artisan.name)}`} className="flex-1 mr-2">
                      <Button size="sm" className="w-full">
                        View Products
                      </Button>
                    </Link>
                    <div className="flex space-x-2">
                      {artisan.instagram && (
                        <a 
                          href={`https://instagram.com/${artisan.instagram.replace('@', '').replace('instagram.com/', '').replace('https://', '').replace('http://', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                          title={`Follow ${artisan.name} on Instagram`}
                        >
                          <i className="ri-instagram-line text-sm"></i>
                        </a>
                      )}
                      {artisan.website && (
                        <a 
                          href={artisan.website.startsWith('http') ? artisan.website : `https://${artisan.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                          title={`Visit ${artisan.name}'s website`}
                        >
                          <i className="ri-external-link-line text-sm"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
            })}
          </div>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search artisans by name, location, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label htmlFor="specialty-filter" className="text-sm font-medium text-gray-700">
                Filter by specialty:
              </label>
              <select
                id="specialty-filter"
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent capitalize"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty} className="capitalize">
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* All Artisans */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              All Artisans ({filteredArtisans.length})
            </h2>
          </div>

          {filteredArtisans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtisans.map((artisan) => {
                const stats = calculateArtisanStats(artisan.name);
                return (
                <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div 
                    className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${artisan.image})` }}
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{artisan.name}</h3>
                      <div className="flex items-center">
                        <div className="flex text-xs mr-1">
                          {renderStars(stats.rating)}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({stats.rating})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      <i className="ri-map-pin-line mr-1"></i>
                      {artisan.location}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {artisan.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {artisan.bio}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{stats.products} product{stats.products !== 1 ? 's' : ''}</span>
                      <span>{stats.reviews} review{stats.reviews !== 1 ? 's' : ''}</span>
                    </div>
                    
                    <Link href={`/products?artisan=${encodeURIComponent(artisan.name)}`}>
                      <Button size="sm" className="w-full">
                        View Products
                      </Button>
                    </Link>
                  </div>
                </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <i className="ri-search-line text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artisans found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria to find more artisans.
              </p>
              <Button 
                variant="secondary"
                onClick={() => {
                  setSearchQuery('');
                  setFilterSpecialty('all');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </section>

        {/* Become an Artisan CTA */}
        <section className="mt-16 text-center">
          <Card className="p-12 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-200">
            <div className="max-w-2xl mx-auto">
              <div className="text-4xl text-amber-600 mb-6">
                <i className="ri-palette-line"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Artisan Community</h2>
              <p className="text-xl text-gray-600 mb-8">
                Are you a talented craftsperson? Share your unique creations with our global community 
                of customers who appreciate authentic, handmade art.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="px-8">
                    <i className="ri-user-add-line mr-2"></i>
                    Apply to Become an Artisan
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="px-8">
                  <i className="ri-information-line mr-2"></i>
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
