# Frontend Architecture Specification

## 🏗️ System Architecture Overview

### Component Hierarchy Design
```
src/
├── app/                          # Next.js App Router Structure
│   ├── (routes)/
│   │   ├── page.tsx             # Homepage with product showcase
│   │   ├── shop/                # E-commerce functionality
│   │   │   ├── page.tsx         # Product catalog with filters
│   │   │   ├── [id]/            # Individual product pages
│   │   │   └── components/      # Shop-specific components
│   │   ├── artisans/            # Craftsperson profiles
│   │   ├── about/               # Company information
│   │   │   ├── page.tsx         # Main about page
│   │   │   └── components/      # About page sections
│   │   └── contact/             # Customer support
│   ├── globals.css              # Global styling
│   └── layout.tsx               # Root application layout
├── components/                   # Reusable UI components
│   ├── Header.tsx               # Navigation component
│   ├── Footer.tsx               # Site footer
│   └── ui/                      # Base UI components
└── lib/                         # Utility functions
```

## 🎨 Design System Implementation

### Typography Configuration
```typescript
// Font Integration Strategy
import { Geist, Geist_Mono, Pacifico } from "next/font/google";

const brandFont = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-brand',
});

const contentFont = Geist({
  variable: "--font-content",
  subsets: ["latin"],
});
```

### Color Palette System
```css
/* Artisan-Inspired Color Scheme */
:root {
  --color-primary-amber: #d97706;
  --color-secondary-warm: #92400e;
  --color-accent-gold: #f59e0b;
  --color-neutral-warm: #78716c;
  --color-background: #fefefe;
}
```

## 📱 Responsive Design Framework

### Tailwind CSS Configuration
```javascript
// Enhanced Tailwind Configuration
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'brand': ['var(--font-brand)'],
        'content': ['var(--font-content)']
      }
    }
  }
}
```

### Mobile-First Approach
- **Navigation**: Collapsible menu system with smooth animations
- **Product Grid**: Adaptive layout (1→2→3→4 columns)
- **Images**: Responsive with proper aspect ratio maintenance
- **Typography**: Fluid scaling across device breakpoints

## 🛒 E-commerce Feature Set

### Product Showcase Implementation
```typescript
interface ProductCard {
  id: number;
  name: string;
  artisan: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
}

const FeaturedProducts: ProductCard[] = [
  {
    name: "Handwoven Ceramic Bowl",
    artisan: "Maria Rodriguez", 
    price: 45,
    originalPrice: 60,
    rating: 4.8,
    reviews: 23
  }
  // Additional products...
];
```

### Interactive Shopping Features
- **Product Filtering**: Category, price range, artisan selection
- **Search Functionality**: Real-time product discovery
- **Shopping Cart**: Persistent state with local storage
- **Wishlist Management**: User preference tracking

## 🗺️ Third-Party Integration Strategy

### Google Maps Integration
```typescript
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Artisan Location Discovery
const ArtisanMap = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={10}
        center={defaultCenter}
      >
        {artisanLocations.map(location => (
          <Marker key={location.id} position={location.coordinates} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};
```

### Data Visualization Components
```typescript
import { BarChart, LineChart, PieChart } from 'recharts';

// Sales Analytics Dashboard
const SalesVisualization = ({ data }) => {
  return (
    <div className="dashboard-container">
      <BarChart width={400} height={300} data={salesData}>
        {/* Chart configuration */}
      </BarChart>
    </div>
  );
};
```

## 📄 Page Structure Specifications

### Homepage Layout
```typescript
export default function Homepage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <ArtisanHighlight />
      <TestimonialSection />
      <NewsletterSignup />
    </main>
  );
}
```

### Product Catalog Architecture
```typescript
export default function ShopPage() {
  return (
    <div className="shop-container">
      <ShopFilters />
      <ShopSearch />
      <ProductGrid />
      <Pagination />
    </div>
  );
}
```

### About Page Content Strategy
```typescript
export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      <OurMission />
      <TeamSection />
      <ValuesSection />
      <CommunityImpact />
    </main>
  );
}
```

## 🔧 Development Environment Setup

### Package Configuration
```json
{
  "name": "handcrafted-haven-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "cross-env NODE_ENV=development next dev -H 0.0.0.0 -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.3.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@react-google-maps/api": "^2.19.3",
    "recharts": "^3.0.2"
  }
}
```

### Environment Variables
```bash
# Development Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
GOOGLE_MAPS_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 Performance Optimization Strategy

### Image Optimization
- Next.js Image component for automatic optimization
- WebP format conversion for better compression
- Lazy loading implementation for improved page speed
- Responsive image sizing based on viewport

### Code Splitting
- Route-based code splitting with Next.js App Router
- Component-level lazy loading for heavy features
- Bundle analysis for optimization opportunities
- Tree shaking for unused code elimination

### SEO Implementation
```typescript
// Metadata Configuration
export const metadata: Metadata = {
  title: "Handcrafted Haven - Artisan Marketplace",
  description: "Discover unique handcrafted goods from talented artisans worldwide",
  keywords: "handcrafted, artisan, marketplace, unique gifts",
  openGraph: {
    title: "Handcrafted Haven",
    description: "Supporting artisans through beautiful craftsmanship",
    images: ["/og-image.jpg"]
  }
};
```

## 🔌 Backend Integration Points

### API Communication Layer
```typescript
// API Service Architecture
class ApiService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;
  
  async getProducts(filters?: ProductFilters) {
    return fetch(`${this.baseURL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  async getUserProfile(userId: string) {
    return fetch(`${this.baseURL}/users/${userId}`);
  }
}
```

### State Management Strategy
- React Context for global state (cart, user authentication)
- Local component state for UI interactions
- Server state synchronization with SWR or React Query
- Persistent storage for user preferences

---

This architecture ensures scalable, maintainable frontend development while leveraging modern React/Next.js best practices for e-commerce applications.
