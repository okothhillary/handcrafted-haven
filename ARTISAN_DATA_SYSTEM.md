# Handcrafted Haven - Artisan Data System

## 🎨 System Overview

The Handcrafted Haven artisan data system is a comprehensive, TypeScript-based solution for managing artisan profiles, their specialties, products, and dynamic statistics. The system is designed to support a growing marketplace of skilled craftspeople from around the world.

### 📊 Current Statistics
- **13 Professional Artisans** with complete profiles
- **25+ Specialized Craft Categories** (Pottery, Textiles, Woodworking, Jewelry, etc.)
- **Global Reach**: Artisans from North America, Europe, Asia, and Africa
- **Professional Images**: High-quality artisan portraits and workshop photos
- **Dynamic Statistics**: Real-time calculation of products, reviews, ratings, and sales

## 🏗️ Technical Architecture

### 1. **Data Models** (`src/models/artisan.ts`)

#### Core Artisan Interface
```typescript
interface Artisan {
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
```

#### Extended Artisan Profile
```typescript
interface ArtisanProfile extends Artisan {
  story: string;
  achievements: string[];
  certifications: string[];
  techniques: string[];
  materials: string[];
  workspaceDescription: string;
  shippingRegions: string[];
  customOrdersAccepted: boolean;
  responseTime: string;
}
```

### 2. **Data Source** (`src/data/artisans.ts`)

#### Centralized Artisan Database
- **Single Source of Truth**: All artisan data centralized
- **13 Professional Profiles**: Complete artisan information
- **Rich Metadata**: Detailed biographies, specialties, and contact info
- **Status Management**: Featured vs. active artisan categorization

#### Current Artisans:
1. **Maria Rodriguez** (Oaxaca, Mexico) - Pottery & Ceramics
2. **Sarah Chen** (Portland, Oregon) - Textiles & Macrame
3. **James Wilson** (Vermont, USA) - Woodworking & Furniture
4. **Anna Kowalski** (Krakow, Poland) - Traditional Embroidery
5. **Hiroshi Tanaka** (Kyoto, Japan) - Bamboo & Traditional Crafts
6. **Isabella Torres** (Barcelona, Spain) - Jewelry & Metalwork
7. **Elena Popov** (Sofia, Bulgaria) - Weaving & Textiles
8. **Lisa Johnson** (Austin, Texas) - Leather & Accessories
9. **Thomas Mueller** (Munich, Germany) - Glass & Art Glass
10. **Amara Okonkwo** (Lagos, Nigeria) - Beadwork & Jewelry
11. **Fatima Al-Zahra** (Marrakech, Morocco) - Embroidery & Silk
12. **Emma Davis** (Seattle, Washington) - Glasswork & Blown Glass
13. **Robert Brown** (Asheville, North Carolina) - Wood Carving & Sculpture

### 3. **Utility Functions** (`src/utils/artisan.ts`)

#### Core Functions
```typescript
// Basic retrieval
getArtisanById(id: number): Artisan | undefined
getArtisanByName(name: string): Artisan | undefined

// Filtering and search
getArtisansBySpecialty(specialty: string): Artisan[]
getFeaturedArtisans(): Artisan[]
getActiveArtisans(): Artisan[]
getArtisansByLocation(location: string): Artisan[]
searchArtisans(query: string): Artisan[]

// Dynamic statistics
calculateArtisanStats(artisanIdentifier: string | number): ArtisanStats
getArtisanWithStats(artisanIdentifier: string | number): (Artisan & ArtisanStats) | null
getAllArtisansWithStats(): (Artisan & ArtisanStats)[]
```

#### Advanced Features
- **Dynamic Statistics Calculation**: Real-time computation from product data
- **Full-Text Search**: Search across names, locations, bios, and specialties
- **Performance Analytics**: Top artisans by rating, products, reviews, sales
- **Geographic Filtering**: Location-based artisan discovery

## 📸 Image Management

### Image Structure
```
public/images/artisans/
├── maria-rodriguez.jpg
├── sarah-chen.jpg
├── james-wilson.jpg
├── anna-kowalski.jpg
├── hiroshi-tanaka.jpg
├── isabella-torres.jpg
├── elena-popov.jpg
├── lisa-johnson.jpg
├── thomas-mueller.jpg
├── amara-okonkwo.jpg
├── fatima-al-zahra.jpg
├── emma-davis.jpg
└── robert-brown.jpg
```

### Image Standards
- **Format**: High-quality JPEG
- **Resolution**: Professional portraits
- **Naming**: Lowercase, hyphenated format matching artisan names
- **Content**: Professional artisan photos showing personality and craft context

## 🔄 Dynamic Statistics System

### Real-Time Calculations
The system dynamically calculates artisan statistics from product data:

#### Statistics Computed:
- **Total Products**: Count of products created by artisan
- **Average Rating**: Weighted average from all product reviews
- **Total Reviews**: Sum of all product reviews
- **Estimated Sales**: Calculated multiplier based on review engagement
- **Years Active**: Calculated from join date

#### Implementation:
```typescript
const calculateArtisanStats = (artisanIdentifier: string | number): ArtisanStats => {
  const artisan = getArtisanById(artisanIdentifier);
  const artisanProducts = getProductsByArtisan(artisan.name);
  
  // Calculate comprehensive statistics
  return {
    products: artisanProducts.length,
    reviews: artisanProducts.reduce((sum, product) => sum + product.reviews, 0),
    rating: calculateWeightedRating(artisanProducts),
    sales: estimateSalesFromReviews(artisanProducts),
    yearsActive: calculateYearsFromJoinDate(artisan.joinedDate)
  };
};
```

## 🗃️ Database Integration (Future)

### MongoDB Schema Design
```javascript
const artisanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  specialties: [{ type: String, required: true }],
  bio: { type: String, required: true },
  experience: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  contact: {
    instagram: String,
    website: String,
    email: String,
    phone: String
  },
  joinedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'featured'], 
    default: 'active' 
  },
  // Dynamic fields updated by scheduled jobs
  stats: {
    totalProducts: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});
```

### API Endpoints (Ready for Implementation)
```typescript
// GET /api/artisans - Get all artisans with optional filtering
// GET /api/artisans/:id - Get specific artisan with stats
// GET /api/artisans/featured - Get featured artisans
// GET /api/artisans/search?q=query - Search artisans
// GET /api/artisans/:id/products - Get artisan's products
// POST /api/artisans - Create new artisan (admin)
// PUT /api/artisans/:id - Update artisan (admin)
// DELETE /api/artisans/:id - Soft delete artisan (admin)
```

## 🎯 Current Features

### ✅ Implemented
- **Complete Artisan Profiles**: 13 professional artisans with full details
- **TypeScript Type Safety**: Comprehensive interfaces and type checking
- **Dynamic Statistics**: Real-time calculation from product data
- **Search & Filtering**: Full-text search and specialty filtering
- **Professional Images**: High-quality artisan portraits
- **Geographic Diversity**: Global artisan representation
- **Contact Information**: Social media, websites, email integration
- **Featured Artisan System**: Promotion and highlighting capability

### 🔄 Integration Points
- **Product Catalog**: Seamless linking between artisans and their products
- **Review System**: Artisan ratings calculated from product reviews
- **E-commerce Flow**: Artisan information in checkout and order processes
- **SEO Optimization**: Rich artisan profiles for search engine visibility

## 🛠️ Usage Examples

### Basic Artisan Retrieval
```typescript
import { getArtisanById, getFeaturedArtisans } from '@/data/artisans';

// Get specific artisan
const maria = getArtisanById(1);
console.log(maria?.name); // "Maria Rodriguez"

// Get featured artisans
const featured = getFeaturedArtisans();
console.log(`${featured.length} featured artisans`);
```

### Dynamic Statistics
```typescript
import { getArtisanWithStats, calculateArtisanStats } from '@/utils/artisan';

// Get artisan with live statistics
const artisanWithStats = getArtisanWithStats(1);
console.log(`${artisanWithStats?.name} has ${artisanWithStats?.products} products`);

// Calculate just the stats
const stats = calculateArtisanStats("Maria Rodriguez");
console.log(`Average rating: ${stats.rating}/5.0`);
```

### Search and Filtering
```typescript
import { searchArtisans, getArtisansBySpecialty } from '@/data/artisans';

// Search artisans
const potters = searchArtisans("pottery");
const textileArtisans = getArtisansBySpecialty("Textiles");

// Geographic filtering
const mexicanArtisans = getArtisansByLocation("Mexico");
```

## 🚀 Future Development

### Phase 1: Database Migration
- **MongoDB Integration**: Migrate from JSON to database
- **API Implementation**: RESTful endpoints for all operations
- **Admin Dashboard**: CRUD operations for artisan management

### Phase 2: Enhanced Features
- **Artisan Applications**: Online application system for new artisans
- **Portfolio Management**: Dynamic portfolio updates by artisans
- **Advanced Analytics**: Revenue tracking, performance metrics
- **Communication System**: Direct messaging between customers and artisans

### Phase 3: Community Features
- **Artisan Stories**: Blog-style posts from artisans
- **Workshop Booking**: Schedule visits to artisan workshops
- **Collaboration Tools**: Artisan-to-artisan project collaboration
- **Certification System**: Skill verification and craft authenticity

## 📝 Data Quality Standards

### Artisan Profile Requirements
- **Complete Information**: All required fields populated
- **Professional Images**: High-quality, representative photos
- **Authentic Biographies**: Detailed, personal craft stories
- **Accurate Specialties**: Correctly categorized craft types
- **Current Contact Info**: Valid social media and website links

### Image Guidelines
- **Professional Quality**: Clear, well-lit artisan portraits
- **Consistent Naming**: Lowercase, hyphenated format
- **Appropriate Content**: Focus on artisan and craft context
- **Optimized Size**: Web-optimized for fast loading

## 🔍 Quality Assurance

### Data Validation
- **TypeScript Interfaces**: Compile-time type checking
- **Required Fields**: All essential information present
- **Consistent Formatting**: Standardized data entry
- **Link Verification**: Valid URLs for websites and social media

### Testing Coverage
- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: Statistics calculation efficiency
- **E2E Tests**: Complete user workflow testing

---

**Last Updated**: July 31, 2025  
**Version**: 2.1.0  
**Maintainer**: Development Team  
**Status**: Production Ready