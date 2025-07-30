# 🎨 Handcrafted Haven

A modern e-commerce platform showcasing handcrafted artisan products from around the world. Built with Next.js 15, React 19, and TypeScript for a premium shopping experience.

## 🌟 Live Demo

🚀 **Production Site**: [handcrafted-haven-git-individual-olwal-olwalgeorges-projects.vercel.app](https://handcrafted-haven-git-individual-olwal-olwalgeorges-projects.vercel.app)

## 👥 Team Members

- **George Olwal** - Full-stack Developer
- **Hillary Okoth** - Frontend Developer  
- **Emmanuel Ekenedo** - Backend Developer
- **Malcolm Nigel** - UI/UX Designer

## ✨ Features

### 🏠 **Homepage**
- Hero section with compelling calls-to-action
- Featured product showcases with real product images
- Category browsing with visual previews
- Customer testimonials and reviews
- Newsletter signup integration

### 👨‍🎨 **Artisan Profiles**
- Detailed artisan biographies and specialties
- Professional profile photography
- Product portfolios and ratings
- Geographic location mapping
- Social media integration

### 🛍️ **E-commerce Functionality**
- Advanced product filtering and search
- Shopping cart with persistent state
- Wishlist management
- User account system
- Order tracking and history

### 📱 **User Experience**
- Fully responsive design (mobile-first)
- Progressive Web App (PWA) support
- SEO optimized with proper meta tags
- Fast loading with Next.js optimization
- Accessibility compliant (WCAG 2.1)

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.1 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: RemixIcon
- **Deployment**: Vercel
- **Image Optimization**: Next.js Image component
- **PWA**: Custom manifest and service worker

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/olwalgeorge/handcrafted-haven.git
cd handcrafted-haven

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Homepage
│   ├── artisans/          # Artisan profiles
│   ├── products/          # Product catalog
│   ├── shop/              # Shopping interface
│   ├── account/           # User account management
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   └── auth/              # Authentication components
├── contexts/              # React Context providers
├── models/                # TypeScript interfaces
├── types/                 # Type definitions
└── utils/                 # Utility functions

public/
├── images/                # Optimized images
│   ├── products/          # Product photography
│   ├── artisans/          # Artisan portraits
│   ├── categories/        # Category images
│   └── hero/              # Hero section images
└── icons/                 # PWA icons and favicons
```

## 🎨 Design System

### Color Palette
- **Primary**: Amber/Orange gradient (`amber-600` to `orange-500`)
- **Secondary**: Warm earth tones
- **Accent**: Deep browns and gold highlights
- **Neutral**: Modern grays for typography

### Typography
- **Headings**: System font stack optimized for readability
- **Body**: Clean, accessible typography
- **Special**: Custom font loading for brand elements

## 🔧 Key Components

### Navigation
- Responsive header with mobile menu
- Search integration
- Cart and wishlist indicators
- User account dropdown

### Product Display
- High-quality image galleries
- Star rating systems
- Price display with currency formatting
- Add to cart/wishlist functionality

### Forms
- Contact forms with validation
- User registration/login
- Newsletter subscription
- Product reviews and ratings

## 🌐 SEO & Performance

- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Meta Tags**: Dynamic meta descriptions and titles
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Auto-generated XML sitemap
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Automatic route-based splitting

## 📱 Progressive Web App

- **Offline Support**: Service worker for offline browsing
- **Install Prompt**: Add to home screen functionality  
- **Push Notifications**: Order updates and promotions
- **App Shell**: Fast loading app architecture

## 🔒 Security Features

- **Input Validation**: Client and server-side validation
- **CSRF Protection**: Cross-site request forgery prevention
- **Content Security Policy**: XSS attack prevention
- **Environment Variables**: Secure configuration management

## 🚢 Deployment

The application is deployed on Vercel with:
- **Automatic deployments** from the main branch
- **Preview deployments** for pull requests  
- **Environment variables** for secure configuration
- **Custom domain** support
- **SSL/TLS** encryption

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build verification
npm run build
```

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the excellent framework
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first styling
- **Our Artisan Partners** for inspiring authentic craftsmanship

---

**Built with ❤️ by Team Handcrafted Haven**
