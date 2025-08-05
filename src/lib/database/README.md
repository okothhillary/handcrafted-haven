# Database Setup for Handcrafted Haven

This directory contains all the database-related files for the Handcrafted Haven marketplace application.

## 📁 Structure

- `seed.ts` - Database seeding script with sample data
- `test-connection.ts` - Database connection and model validation test
- `migrate.ts` - Database migration utilities (if needed)

## 🗄️ Database Models

The application includes the following comprehensive database models:

### Core Models
- **User** - User accounts with authentication, profiles, and seller capabilities
- **Product** - Product catalog with variants, SEO, and artisan information
- **Category** - Hierarchical product categorization
- **Artisan** - Artisan profiles and portfolio management

### Commerce Models
- **Order** - Complete order management with payment tracking
- **Cart** - Shopping cart with guest and user support
- **Coupon** - Discount and promotion system
- **Wishlist** - User wishlists with collaboration features

## 🚀 Quick Start

### 1. Environment Setup
Make sure you have MongoDB running and set the connection string:

```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/handcrafted-haven
```

### 2. Test Database Connection
```bash
npm run tsx src/lib/database/test-connection.ts
```

### 3. Seed Database with Sample Data
```bash
npm run db:seed
```

### 4. Development Seeding
```bash
npm run db:seed:dev
```

## 📋 Available Scripts

- `npm run db:seed` - Seed database with sample data
- `npm run db:seed:dev` - Seed database in development mode
- `npm run db:migrate` - Run database migrations
- `npm run db:health` - Check database health
- `npm run db:stats` - Show database statistics
- `npm run db:cleanup` - Clean up old data
- `npm run db:optimize` - Optimize database performance
- `npm run db:backup` - Backup database

## 🔧 Features

### Authentication Integration
- Works with NextAuth.js
- Password hashing with bcryptjs
- Role-based access control (admin, seller, customer)

### E-commerce Features
- Product variants and pricing
- Shopping cart persistence
- Order management and tracking
- Coupon and discount system
- Wishlist functionality

### Artisan Marketplace
- Artisan profiles and verification
- Product-artisan relationships
- Commission tracking
- Portfolio management

### Performance Optimizations
- Comprehensive database indexing
- Virtual fields for computed values
- Optimized queries and aggregations
- Efficient data relationships

## 🛠️ TypeScript Support

All models are fully typed with TypeScript:
- Proper type annotations
- Interface definitions
- Type-safe database operations
- IntelliSense support

## 📚 Model Details

### User Model
- Authentication and profile data
- Address management
- Seller profiles with business information
- Preferences and notification settings

### Product Model
- Rich product information
- SEO optimization
- Variant support
- Inventory tracking
- Review and rating system

### Order Model
- Complete order lifecycle
- Payment integration
- Shipping and tracking
- Multi-seller support

### Cart Model
- Guest and user cart support
- Coupon application
- Real-time total calculations
- Cart persistence

## 🔄 Sample Data

The seeding script includes:
- 3 users (admin, customer, seller)
- 6 product categories
- 2 artisan profiles
- 2 sample products
- 2 promotional coupons

## 🚨 Important Notes

1. **Environment**: Make sure MongoDB is running before executing any scripts
2. **Data Loss**: Seeding will clear existing data - use with caution
3. **Production**: Never run seeding scripts in production
4. **Backup**: Always backup your database before running migrations

## 🔗 Related Files

- `/src/models/` - Individual model definitions
- `/src/types/` - TypeScript type definitions
- `/src/utils/connectDB.ts` - Database connection utility
