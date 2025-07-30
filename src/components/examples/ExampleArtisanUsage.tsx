// Example usage of the centralized artisan data system
// This demonstrates various ways to use the artisan utilities

import React, { useState, useEffect } from 'react';
import { 
  getAllArtisansWithStats, 
  getTopArtisans, 
  getArtisanMetrics, 
  filterArtisans,
  sortArtisans,
  ArtisanFilterOptions,
  ArtisanSortOption 
} from '@/utils/artisan';
import { getFeaturedArtisans, getAllSpecialties } from '@/data/artisans';
import { Artisan, ArtisanStats } from '@/models/artisan';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ExampleArtisanUsage() {
  const [artisans, setArtisans] = useState<(Artisan & ArtisanStats)[]>([]);
  const [filteredArtisans, setFilteredArtisans] = useState<(Artisan & ArtisanStats)[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter and sort options
  const [filterOptions, setFilterOptions] = useState<ArtisanFilterOptions>({
    specialty: '',
    location: '',
    featured: undefined,
    minRating: undefined,
    searchQuery: ''
  });
  const [sortOption, setSortOption] = useState<ArtisanSortOption>('rating-desc');

  useEffect(() => {
    // Load initial data
    const allArtisans = getAllArtisansWithStats();
    const systemMetrics = getArtisanMetrics();
    
    setArtisans(allArtisans);
    setMetrics(systemMetrics);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply filters and sorting when options change
    let filtered = filterArtisans(filterOptions);
    filtered = sortArtisans(filtered, sortOption);
    setFilteredArtisans(filtered);
  }, [filterOptions, sortOption]);

  const handleFilterChange = (key: keyof ArtisanFilterOptions, value: any) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading artisan data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Artisan Data System Demo
      </h1>

      {/* System Metrics */}
      {metrics && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {metrics.totalArtisans}
              </div>
              <div className="text-gray-600">Total Artisans</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {metrics.featuredArtisans}
              </div>
              <div className="text-gray-600">Featured Artisans</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {metrics.totalProducts}
              </div>
              <div className="text-gray-600">Total Products</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {metrics.averageRating}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </Card>
          </div>

          {/* Specialty Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Specialties Distribution
              </h3>
              <div className="space-y-2">
                {Object.entries(metrics.specialtyDistribution).map(([specialty, count]) => (
                  <div key={specialty} className="flex justify-between items-center">
                    <span className="text-gray-700">{specialty}</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                      {count as number}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location Distribution
              </h3>
              <div className="space-y-2">
                {Object.entries(metrics.locationDistribution).map(([location, count]) => (
                  <div key={location} className="flex justify-between items-center">
                    <span className="text-gray-700">{location}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {count as number}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Top Performers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Performing Artisans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['rating', 'products', 'reviews', 'sales'].map((criteria) => {
            const topArtisans = getTopArtisans({ 
              sortBy: criteria as any, 
              limit: 3 
            });
            
            return (
              <Card key={criteria} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                  Top by {criteria}
                </h3>
                <div className="space-y-3">
                  {topArtisans.map((artisan, index) => (
                    <div key={artisan.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {artisan.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {criteria === 'rating' && `${artisan.rating} stars`}
                          {criteria === 'products' && `${artisan.products} products`}
                          {criteria === 'reviews' && `${artisan.reviews} reviews`}
                          {criteria === 'sales' && `${artisan.sales} sales`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Filters and Search */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Filter & Search Artisans</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filterOptions.searchQuery || ''}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                placeholder="Search artisans..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                value={filterOptions.specialty || ''}
                onChange={(e) => handleFilterChange('specialty', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Specialties</option>
                {getAllSpecialties().map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterOptions.featured === undefined ? '' : filterOptions.featured ? 'featured' : 'regular'}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('featured', value === '' ? undefined : value === 'featured');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Artisans</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as ArtisanSortOption)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="products-desc">Most Products</option>
                <option value="products-asc">Least Products</option>
                <option value="reviews-desc">Most Reviews</option>
                <option value="reviews-asc">Least Reviews</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="joined-desc">Newest</option>
                <option value="joined-asc">Oldest</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredArtisans.length} of {artisans.length} artisans
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setFilterOptions({
                  specialty: '',
                  location: '',
                  featured: undefined,
                  minRating: undefined,
                  searchQuery: ''
                });
                setSortOption('rating-desc');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Card>
      </section>

      {/* Filtered Results */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Artisan Results ({filteredArtisans.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${artisan.image})` }}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{artisan.name}</h3>
                  {artisan.featured && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <i className="ri-map-pin-line mr-1"></i>
                  {artisan.location}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {artisan.specialties.slice(0, 2).map((specialty, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {specialty}
                    </span>
                  ))}
                  {artisan.specialties.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{artisan.specialties.length - 2} more
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                  <div>
                    <div className="font-semibold text-amber-600">{artisan.products}</div>
                    <div className="text-gray-500 text-xs">Products</div>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-600">{artisan.reviews}</div>
                    <div className="text-gray-500 text-xs">Reviews</div>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-600">{artisan.rating}</div>
                    <div className="text-gray-500 text-xs">Rating</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {artisan.experience}
                  </div>
                  <div className="flex gap-2">
                    {artisan.instagram && (
                      <a 
                        href={`https://instagram.com/${artisan.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
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
                      >
                        <i className="ri-external-link-line text-sm"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredArtisans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <i className="ri-user-search-line text-6xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Artisans Found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
