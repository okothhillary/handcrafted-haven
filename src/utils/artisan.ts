// Artisan utilities for dynamic data processing and calculations
import { Artisan, ArtisanStats } from '@/models/artisan';
import { ARTISANS, getArtisanById, getArtisanByName } from '@/data/artisans';
import { PRODUCTS, getProductsByArtisan } from '@/data/products';

/**
 * Calculate dynamic statistics for an artisan based on their products
 */
export const calculateArtisanStats = (artisanIdentifier: string | number): ArtisanStats => {
  // Find artisan by ID or name
  const artisan = typeof artisanIdentifier === 'number' 
    ? getArtisanById(artisanIdentifier)
    : getArtisanByName(artisanIdentifier);

  if (!artisan) {
    return {
      products: 0,
      reviews: 0,
      rating: 0,
      sales: 0,
      yearsActive: 0
    };
  }

  // Get all products by this artisan
  const artisanProducts = getProductsByArtisan(artisan.name);
  
  const totalProducts = artisanProducts.length;
  const totalReviews = artisanProducts.reduce((sum, product) => sum + product.reviews, 0);
  
  // Calculate weighted average rating
  const totalRatingPoints = artisanProducts.reduce((sum, product) => 
    sum + (product.rating * product.reviews), 0
  );
  const averageRating = totalReviews > 0 
    ? Math.round((totalRatingPoints / totalReviews) * 10) / 10 
    : 0;

  // Calculate estimated sales (reviews * average multiplier)
  const estimatedSales = Math.round(totalReviews * 1.5); // Assume 1.5 sales per review

  // Calculate years active from join date
  const joinDate = new Date(artisan.joinedDate);
  const now = new Date();
  const yearsActive = Math.max(1, Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)));

  return {
    products: totalProducts,
    reviews: totalReviews,
    rating: averageRating,
    sales: estimatedSales,
    yearsActive
  };
};

/**
 * Get artisan with dynamically calculated stats
 */
export const getArtisanWithStats = (artisanIdentifier: string | number): (Artisan & ArtisanStats) | null => {
  const artisan = typeof artisanIdentifier === 'number' 
    ? getArtisanById(artisanIdentifier)
    : getArtisanByName(artisanIdentifier);

  if (!artisan) return null;

  const stats = calculateArtisanStats(artisanIdentifier);
  
  return {
    ...artisan,
    ...stats
  };
};

/**
 * Get all artisans with their dynamic stats
 */
export const getAllArtisansWithStats = (): (Artisan & ArtisanStats)[] => {
  return ARTISANS.map(artisan => {
    const stats = calculateArtisanStats(artisan.id);
    return {
      ...artisan,
      ...stats
    };
  });
};

/**
 * Get top-performing artisans based on various criteria
 */
export interface TopArtisansOptions {
  sortBy: 'rating' | 'products' | 'reviews' | 'sales';
  limit?: number;
  featured?: boolean;
}

export const getTopArtisans = (options: TopArtisansOptions): (Artisan & ArtisanStats)[] => {
  let artisans = getAllArtisansWithStats();

  // Filter by featured status if specified
  if (options.featured !== undefined) {
    artisans = artisans.filter(artisan => artisan.featured === options.featured);
  }

  // Sort based on criteria
  artisans.sort((a, b) => {
    switch (options.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'products':
        return b.products - a.products;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'sales':
        return b.sales - a.sales;
      default:
        return 0;
    }
  });

  // Apply limit if specified
  if (options.limit) {
    artisans = artisans.slice(0, options.limit);
  }

  return artisans;
};

/**
 * Get artisan performance metrics
 */
export interface ArtisanMetrics {
  totalArtisans: number;
  featuredArtisans: number;
  activeArtisans: number;
  averageRating: number;
  totalProducts: number;
  totalReviews: number;
  specialtyDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
}

export const getArtisanMetrics = (): ArtisanMetrics => {
  const allArtisansWithStats = getAllArtisansWithStats();
  
  const totalArtisans = allArtisansWithStats.length;
  const featuredArtisans = allArtisansWithStats.filter(a => a.featured).length;
  const activeArtisans = allArtisansWithStats.filter(a => a.status === 'active' || a.status === 'featured').length;
  
  const totalProducts = allArtisansWithStats.reduce((sum, a) => sum + a.products, 0);
  const totalReviews = allArtisansWithStats.reduce((sum, a) => sum + a.reviews, 0);
  const averageRating = totalReviews > 0 
    ? allArtisansWithStats.reduce((sum, a) => sum + (a.rating * a.reviews), 0) / totalReviews
    : 0;

  // Calculate specialty distribution
  const specialtyDistribution: Record<string, number> = {};
  allArtisansWithStats.forEach(artisan => {
    artisan.specialties.forEach(specialty => {
      specialtyDistribution[specialty] = (specialtyDistribution[specialty] || 0) + 1;
    });
  });

  // Calculate location distribution (by country)
  const locationDistribution: Record<string, number> = {};
  allArtisansWithStats.forEach(artisan => {
    const country = artisan.location.split(',').pop()?.trim() || 'Unknown';
    locationDistribution[country] = (locationDistribution[country] || 0) + 1;
  });

  return {
    totalArtisans,
    featuredArtisans,
    activeArtisans,
    averageRating: Math.round(averageRating * 10) / 10,
    totalProducts,
    totalReviews,
    specialtyDistribution,
    locationDistribution
  };
};

/**
 * Filter artisans with advanced options
 */
export interface ArtisanFilterOptions {
  specialty?: string;
  location?: string;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'featured';
  minRating?: number;
  minProducts?: number;
  searchQuery?: string;
}

export const filterArtisans = (options: ArtisanFilterOptions): (Artisan & ArtisanStats)[] => {
  let artisans = getAllArtisansWithStats();

  if (options.specialty) {
    artisans = artisans.filter(artisan =>
      artisan.specialties.some(s => s.toLowerCase().includes(options.specialty!.toLowerCase()))
    );
  }

  if (options.location) {
    artisans = artisans.filter(artisan =>
      artisan.location.toLowerCase().includes(options.location!.toLowerCase())
    );
  }

  if (options.featured !== undefined) {
    artisans = artisans.filter(artisan => artisan.featured === options.featured);
  }

  if (options.status) {
    artisans = artisans.filter(artisan => artisan.status === options.status);
  }

  if (options.minRating !== undefined) {
    artisans = artisans.filter(artisan => artisan.rating >= options.minRating!);
  }

  if (options.minProducts !== undefined) {
    artisans = artisans.filter(artisan => artisan.products >= options.minProducts!);
  }

  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    artisans = artisans.filter(artisan =>
      artisan.name.toLowerCase().includes(query) ||
      artisan.location.toLowerCase().includes(query) ||
      artisan.bio.toLowerCase().includes(query) ||
      artisan.specialties.some(s => s.toLowerCase().includes(query))
    );
  }

  return artisans;
};

/**
 * Sort artisans by various criteria
 */
export type ArtisanSortOption = 
  | 'name-asc' | 'name-desc'
  | 'rating-asc' | 'rating-desc'
  | 'products-asc' | 'products-desc'
  | 'reviews-asc' | 'reviews-desc'
  | 'joined-asc' | 'joined-desc'
  | 'location-asc' | 'location-desc';

export const sortArtisans = (artisans: (Artisan & ArtisanStats)[], sortBy: ArtisanSortOption): (Artisan & ArtisanStats)[] => {
  const sorted = [...artisans];
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating-asc':
      return sorted.sort((a, b) => a.rating - b.rating);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'products-asc':
      return sorted.sort((a, b) => a.products - b.products);
    case 'products-desc':
      return sorted.sort((a, b) => b.products - a.products);
    case 'reviews-asc':
      return sorted.sort((a, b) => a.reviews - b.reviews);
    case 'reviews-desc':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'joined-asc':
      return sorted.sort((a, b) => new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime());
    case 'joined-desc':
      return sorted.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
    case 'location-asc':
      return sorted.sort((a, b) => a.location.localeCompare(b.location));
    case 'location-desc':
      return sorted.sort((a, b) => b.location.localeCompare(a.location));
    default:
      return sorted;
  }
};
