# 🎨 Centralized Artisan Data System

## Overview

The artisan data system has been completely redesigned to be **centralized**, **dynamic**, and **scalable**. This new system provides a single source of truth for all artisan data across the application while enabling dynamic calculations and flexible data relationships.

## 🗂️ File Structure

```
src/
├── models/
│   └── artisan.ts              # TypeScript interfaces and types
├── data/
│   └── artisans.ts             # Centralized artisan data and basic utilities
├── utils/
│   └── artisan.ts              # Advanced utilities and dynamic calculations
└── components/examples/
    └── ExampleArtisanUsage.tsx # Comprehensive usage examples
```

## 📋 Data Architecture

### Core Models (`src/models/artisan.ts`)

#### `Artisan` Interface
```typescript
interface Artisan {
  id: number;                    // Unique identifier
  name: string;                  // Full name
  location: string;              // Geographic location
  specialties: string[];         // Array of craft specialties
  bio: string;                   // Biography/description
  experience: string;            // Years of experience
  image: string;                 // Profile image URL
  featured: boolean;             // Featured status
  instagram?: string;            // Instagram handle
  website?: string;              // Website URL
  email?: string;                // Contact email
  phone?: string;                // Phone number
  joinedDate: string;            // Date joined platform
  status: 'active' | 'inactive' | 'featured'; // Current status
  
  // Dynamic fields (calculated from products)
  totalProducts?: number;
  averageRating?: number;
  totalReviews?: number;
  totalSales?: number;
}
```

#### `ArtisanProfile` Interface
Extended profile with additional information for detailed pages.

#### `ArtisanStats` Interface
```typescript
interface ArtisanStats {
  products: number;     // Total products count
  reviews: number;      // Total reviews count
  rating: number;       // Average rating
  sales: number;        // Estimated sales
  yearsActive: number;  // Years since joining
}
```

### Data Layer (`src/data/artisans.ts`)

#### Core Data
- **`ARTISANS`**: Complete artisan database array
- **`ARTISAN_PROFILES`**: Extended profiles with additional details

#### Basic Utilities
- `getArtisanById(id)` - Find artisan by ID
- `getArtisanByName(name)` - Find artisan by name
- `getFeaturedArtisans()` - Get featured artisans
- `getArtisansBySpecialty(specialty)` - Filter by specialty
- `getAllSpecialties()` - Get unique specialties list

### Dynamic Utilities (`src/utils/artisan.ts`)

#### Statistics & Analytics
- **`calculateArtisanStats(identifier)`** - Calculate dynamic stats from product data
- **`getArtisanWithStats(identifier)`** - Get artisan with calculated stats
- **`getAllArtisansWithStats()`** - Get all artisans with stats
- **`getArtisanMetrics()`** - Get system-wide metrics

#### Filtering & Sorting
- **`filterArtisans(options)`** - Advanced filtering with multiple criteria
- **`sortArtisans(artisans, sortBy)`** - Sort by various criteria
- **`getTopArtisans(options)`** - Get top performers

## 🔄 Product-Artisan Relationships

### Updated Product Interface
```typescript
interface Product {
  // ... other fields
  artisan: string;        // Artisan name (backward compatibility)
  artisanId?: number;     // Reference to artisan ID (new relational field)
}
```

### Product Utilities
- `getProductsByArtisan(name)` - Get products by artisan name
- `getProductsByArtisanId(id)` - Get products by artisan ID

## 🚀 Usage Examples

### Basic Usage
```typescript
import { ARTISANS, getFeaturedArtisans } from '@/data/artisans';
import { calculateArtisanStats } from '@/utils/artisan';

// Get all artisans
const allArtisans = ARTISANS;

// Get featured artisans
const featured = getFeaturedArtisans();

// Get artisan with dynamic stats
const stats = calculateArtisanStats(1); // by ID
const stats2 = calculateArtisanStats("Maria Rodriguez"); // by name
```

### Advanced Filtering
```typescript
import { filterArtisans, sortArtisans } from '@/utils/artisan';

// Filter artisans
const filtered = filterArtisans({
  specialty: 'Pottery',
  location: 'Mexico',
  featured: true,
  minRating: 4.5,
  searchQuery: 'traditional'
});

// Sort results
const sorted = sortArtisans(filtered, 'rating-desc');
```

### Analytics & Metrics
```typescript
import { getArtisanMetrics, getTopArtisans } from '@/utils/artisan';

// Get system metrics
const metrics = getArtisanMetrics();
console.log(metrics.totalArtisans);
console.log(metrics.specialtyDistribution);

// Get top performers
const topRated = getTopArtisans({ 
  sortBy: 'rating', 
  limit: 5 
});
```

### Component Integration
```typescript
import { getAllArtisansWithStats } from '@/utils/artisan';

function ArtisanList() {
  const artisans = getAllArtisansWithStats();
  
  return (
    <div>
      {artisans.map(artisan => (
        <div key={artisan.id}>
          <h3>{artisan.name}</h3>
          <p>Products: {artisan.products}</p>
          <p>Rating: {artisan.rating}</p>
          <p>Reviews: {artisan.reviews}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Key Benefits

### 1. **Centralized Data Management**
- Single source of truth for artisan data
- Consistent data structure across the application
- Easy to maintain and update

### 2. **Dynamic Calculations**
- Statistics calculated in real-time from product data
- No need to manually update artisan stats
- Always accurate and up-to-date

### 3. **Flexible Relationships**
- Both name-based and ID-based product-artisan relationships
- Backward compatibility maintained
- Forward-compatible for database integration

### 4. **Rich Filtering & Sorting**
- Multiple filter criteria support
- Various sorting options
- Advanced search capabilities

### 5. **Analytics & Insights**
- System-wide metrics
- Top performer identification
- Distribution analysis

### 6. **Type Safety**
- Full TypeScript support
- Compile-time error checking
- IntelliSense support

## 📊 Available Data

### Current Artisans (11 total)
1. **Maria Rodriguez** (Mexico) - Pottery, Ceramics
2. **Sarah Chen** (USA) - Textiles, Macrame
3. **James Wilson** (USA) - Woodworking, Furniture
4. **Elena Popov** (Czech Republic) - Jewelry, Metalwork
5. **Hiroshi Tanaka** (Japan) - Ceramics, Tea Items
6. **Amara Okonkwo** (Nigeria) - Textiles, Weaving
7. **Thomas Mueller** (Germany) - Metalwork, Blacksmithing
8. **Anna Kowalski** (Poland) - Jewelry, Goldsmithing
9. **Lisa Johnson** (Scotland) - Textiles, Knitting
10. **Lisa Martinez** (USA) - Textiles, Southwestern Crafts
11. **Fatima Al-Zahra** (Morocco) - Textiles, Embroidery

### Specialties Coverage
- **Pottery & Ceramics**: 3 artisans
- **Textiles & Fiber Arts**: 5 artisans
- **Woodworking**: 1 artisan
- **Jewelry & Metalwork**: 3 artisans
- **Traditional Crafts**: Various specialties

## 🔮 Future Enhancements

### Database Integration Ready
- Structure designed for easy MongoDB/database integration
- ID-based relationships for referential integrity
- Extensible for additional fields and relationships

### API Integration
- Ready for REST/GraphQL API implementation
- Structured for server-side rendering
- Caching-friendly design

### Advanced Features
- Review system integration
- Commission request system
- Social media integration
- Location-based services

## 🛠️ Migration Guide

### For Existing Components
1. **Import the new utilities**:
   ```typescript
   import { ARTISANS } from '@/data/artisans';
   import { calculateArtisanStats } from '@/utils/artisan';
   ```

2. **Replace hardcoded data**:
   ```typescript
   // Old
   const artisans = [/* hardcoded array */];
   
   // New
   const artisans = ARTISANS;
   ```

3. **Use dynamic stats**:
   ```typescript
   // Old
   const stats = { products: 23, rating: 4.9 }; // hardcoded
   
   // New
   const stats = calculateArtisanStats(artisan.id);
   ```

### Benefits of Migration
- ✅ Eliminates data duplication
- ✅ Ensures data consistency
- ✅ Enables dynamic calculations
- ✅ Improves maintainability
- ✅ Prepares for database integration

## 📚 Additional Resources

- **Live Demo**: See `ExampleArtisanUsage.tsx` for comprehensive examples
- **Type Definitions**: Refer to `src/models/artisan.ts`
- **Utility Functions**: Explore `src/utils/artisan.ts`
- **Data Source**: Check `src/data/artisans.ts`

---

This centralized artisan data system provides a robust foundation for the Handcrafted Haven platform, enabling dynamic, scalable, and maintainable artisan data management throughout the application.
