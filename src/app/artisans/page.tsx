'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface Artisan {
  id: number;
  name: string;
  location: string;
  specialties: string[];
  bio: string;
  experience: string;
  image: string;
  products: number;
  rating: number;
  reviews: number;
  featured: boolean;
  instagram?: string;
  website?: string;
}

export default function ArtisansPage() {
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const artisans: Artisan[] = [
    {
      id: 1,
      name: "Maria Rodriguez",
      location: "Oaxaca, Mexico",
      specialties: ["Pottery", "Ceramics"],
      bio: "Maria has been crafting pottery for over 20 years using traditional techniques passed down through generations. Her work reflects the rich cultural heritage of Oaxaca while incorporating modern design elements.",
      experience: "20+ years",
      image: "/api/placeholder/300/300",
      products: 23,
      rating: 4.9,
      reviews: 89,
      featured: true,
      instagram: "@maria_pottery",
      website: "maria-ceramics.com"
    },
    {
      id: 2,
      name: "Sarah Chen",
      location: "Portland, Oregon, USA",
      specialties: ["Textiles", "Macrame"],
      bio: "Sarah specializes in contemporary macrame and fiber arts. She combines traditional knotting techniques with modern design aesthetics to create unique wall hangings and home decor pieces.",
      experience: "8 years",
      image: "/api/placeholder/300/300",
      products: 15,
      rating: 4.8,
      reviews: 67,
      featured: true,
      instagram: "@sarah_fiber_art"
    },
    {
      id: 3,
      name: "James Wilson",
      location: "Vermont, USA",
      specialties: ["Woodworking", "Furniture"],
      bio: "James is a master woodworker who creates functional art pieces from sustainably sourced hardwoods. Each piece showcases the natural beauty of wood grain while serving practical purposes.",
      experience: "15+ years",
      image: "/api/placeholder/300/300",
      products: 31,
      rating: 4.9,
      reviews: 124,
      featured: true,
      website: "wilson-woodworks.com"
    },
    {
      id: 4,
      name: "Elena Popov",
      location: "Prague, Czech Republic",
      specialties: ["Jewelry", "Metalwork"],
      bio: "Elena creates intricate wire-wrapped jewelry using traditional European techniques. Her pieces often feature natural stones and crystals, each telling its own unique story.",
      experience: "12 years",
      image: "/api/placeholder/300/300",
      products: 18,
      rating: 5.0,
      reviews: 43,
      featured: false,
      instagram: "@elena_wirework"
    },
    {
      id: 5,
      name: "Hiroshi Tanaka",
      location: "Kyoto, Japan",
      specialties: ["Ceramics", "Pottery"],
      bio: "Hiroshi is a master of traditional Japanese pottery techniques, specializing in tea ceremony items. His work embodies the principles of wabi-sabi and the beauty of imperfection.",
      experience: "25+ years",
      image: "/api/placeholder/300/300",
      products: 27,
      rating: 4.9,
      reviews: 156,
      featured: true
    },
    {
      id: 6,
      name: "Amara Okonkwo",
      location: "Lagos, Nigeria",
      specialties: ["Textiles", "Weaving"],
      bio: "Amara creates vibrant textile art inspired by traditional Nigerian patterns and colors. Her work celebrates African heritage while addressing contemporary themes through fabric.",
      experience: "10 years",
      image: "/api/placeholder/300/300",
      products: 22,
      rating: 4.7,
      reviews: 78,
      featured: false,
      instagram: "@amara_textiles"
    }
  ];

  const specialties = ['all', 'pottery', 'textiles', 'woodworking', 'jewelry', 'ceramics', 'metalwork', 'weaving'];

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSpecialty = filterSpecialty === 'all' || 
      artisan.specialties.some(specialty => specialty.toLowerCase().includes(filterSpecialty));
    const matchesSearch = searchQuery === '' ||
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSpecialty && matchesSearch;
  });

  const featuredArtisans = artisans.filter(artisan => artisan.featured);

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
            {featuredArtisans.map((artisan) => (
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
                    <div className="flex items-center text-amber-500">
                      <i className="ri-star-fill text-sm mr-1"></i>
                      <span className="text-sm font-medium">{artisan.rating}</span>
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
                    <span>{artisan.products} products</span>
                    <span>{artisan.reviews} reviews</span>
                    <span>{artisan.experience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button size="sm" className="flex-1 mr-2">
                      View Profile
                    </Button>
                    <div className="flex space-x-2">
                      {artisan.instagram && (
                        <button className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                          <i className="ri-instagram-line text-sm"></i>
                        </button>
                      )}
                      {artisan.website && (
                        <button className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                          <i className="ri-external-link-line text-sm"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
              {filteredArtisans.map((artisan) => (
                <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div 
                    className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${artisan.image})` }}
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{artisan.name}</h3>
                      <div className="flex items-center text-amber-500">
                        <i className="ri-star-fill text-sm mr-1"></i>
                        <span className="text-sm">{artisan.rating}</span>
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
                      <span>{artisan.products} products</span>
                      <span>{artisan.reviews} reviews</span>
                    </div>
                    
                    <Button size="sm" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
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
