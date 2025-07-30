export interface Artisan {
  id: number;
  name: string;
  location: string;
  specialties: string[];
  bio: string;
  experience: string;
  image: string;
  featured: boolean;
  instagram?: string;
  website?: string;
  email?: string;
  phone?: string;
  joinedDate: string;
  status: 'active' | 'inactive' | 'featured';
  // Dynamic fields - calculated from products
  totalProducts?: number;
  averageRating?: number;
  totalReviews?: number;
  totalSales?: number;
}

export interface ArtisanProfile extends Artisan {
  // Extended profile with additional information
  story: string;
  achievements: string[];
  certifications: string[];
  techniques: string[];
  materials: string[];
  workspaceDescription: string;
  shippingRegions: string[];
  customOrdersAccepted: boolean;
  responseTime: string; // e.g., "Usually responds within 24 hours"
}

export interface ArtisanStats {
  products: number;
  reviews: number;
  rating: number;
  sales: number;
  yearsActive: number;
}

export interface ArtisanContact {
  artisanId: number;
  type: 'inquiry' | 'custom_order' | 'collaboration';
  message: string;
  customerEmail: string;
  customerName: string;
  date: string;
  status: 'pending' | 'responded' | 'completed';
}
