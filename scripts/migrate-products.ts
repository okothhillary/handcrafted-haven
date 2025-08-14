#!/usr/bin/env tsx

/**
 * Product Migration Script
 * 
 * This script migrates static product data from src/data/products.ts
 * to MongoDB with proper ObjectIds and database structure.
 * 
 * Usage:
 *   npm run migrate:products
 *   or
 *   npx tsx scripts/migrate-products.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { connectDB } from '../src/utils/connectDB';
import { Product } from '../src/models/product';
import { PRODUCTS } from '../src/data/products';
import mongoose from 'mongoose';

async function migrateProducts() {
  try {
    console.log('🚀 Starting product migration...');
    
    // Debug environment variables
    console.log('🔍 Environment check:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'Set ✅' : 'Not set ❌'}`);
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in environment variables');
      console.error('💡 Make sure you have .env.local file with MONGODB_URI=mongodb://localhost:27017/handcrafted-haven');
      process.exit(1);
    }
    
    // Connect to database with timeout
    console.log('🔌 Connecting to MongoDB...');
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing products (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    // Convert static products to MongoDB documents
    const migratedProducts = [];
    
    for (const staticProduct of PRODUCTS) {
      try {
        console.log(`📦 Migrating: ${staticProduct.name}`);
        
        // Create new product document with proper structure
        const productData = {
          name: staticProduct.name,
          description: staticProduct.description,
          shortDescription: staticProduct.description.substring(0, 200) + '...',
          price: staticProduct.price,
          compareAtPrice: staticProduct.originalPrice,
          images: staticProduct.images,
          primaryImage: staticProduct.images[0],
          stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
          sku: `HH-${staticProduct.id.toString().padStart(4, '0')}`,
          
          // Create a temporary category ObjectId (you'll need to create categories first)
          category: new mongoose.Types.ObjectId(),
          
          // Create a temporary seller ObjectId (you'll need to create users first)
          seller: new mongoose.Types.ObjectId(),
          
          status: 'active',
          isFeatured: staticProduct.featured || false,
          
          materials: staticProduct.materials,
          origin: 'Handcrafted', // Default origin
          
          handmadeDetails: {
            story: staticProduct.story || 'A beautiful handcrafted piece made with care and attention to detail.',
            timeToMake: '1-2 weeks',
            skillLevel: 'intermediate'
          },
          
          shipping: {
            weight: 1, // Default weight in pounds
            dimensions: {
              length: 10,
              width: 8,
              height: 4
            },
            shippingClass: 'standard',
            processingTime: 3
          },
          
          seo: {
            metaTitle: staticProduct.name,
            metaDescription: staticProduct.description.substring(0, 160),
            keywords: [staticProduct.category, 'handmade', 'artisan', ...staticProduct.materials.map(m => m.toLowerCase())],
            slug: staticProduct.name.toLowerCase()
              .replace(/[^a-z0-9 -]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-') + `-${Date.now()}`
          },
          
          // Initialize empty reviews (they'll be added separately)
          reviews: [],
          averageRating: staticProduct.rating,
          totalReviews: staticProduct.reviews,
          
          // Set rating distribution based on average rating
          ratingDistribution: generateRatingDistribution(staticProduct.rating, staticProduct.reviews),
          
          views: Math.floor(Math.random() * 1000) + 100, // Random views
          purchases: Math.floor(staticProduct.reviews * 1.5), // Estimate purchases
          
          publishedAt: new Date()
        };

        const product = new Product(productData);
        const savedProduct = await product.save();
        migratedProducts.push({
          staticId: staticProduct.id,
          mongoId: savedProduct._id.toString(),
          name: savedProduct.name
        });
        
        console.log(`✅ Migrated: ${staticProduct.name} -> ${savedProduct._id}`);
        
      } catch (error) {
        console.error(`❌ Failed to migrate ${staticProduct.name}:`, error);
      }
    }

    // Create mapping file for reference
    const mappingContent = JSON.stringify(migratedProducts, null, 2);
    const fs = await import('fs');
    await fs.promises.writeFile(
      'product-migration-mapping.json', 
      mappingContent, 
      'utf8'
    );
    
    console.log('\n🎉 Migration completed!');
    console.log(`📊 Total products migrated: ${migratedProducts.length}/${PRODUCTS.length}`);
    console.log('📄 Mapping saved to: product-migration-mapping.json');
    console.log('\n📋 Next steps:');
    console.log('1. Create categories and update product category references');
    console.log('2. Create user accounts and update product seller references');
    console.log('3. Update your frontend to use MongoDB ObjectIds');
    console.log('4. Test the review system with real ObjectIds');
    
    // Display the mapping for easy reference
    console.log('\n🗺️  Static ID -> MongoDB ObjectId Mapping:');
    migratedProducts.forEach(({ staticId, mongoId, name }) => {
      console.log(`   ${staticId} -> ${mongoId} (${name})`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

/**
 * Generate realistic rating distribution based on average rating
 */
function generateRatingDistribution(avgRating: number, totalReviews: number) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  if (totalReviews === 0) return distribution;
  
  // Distribute reviews based on average rating
  if (avgRating >= 4.5) {
    distribution[5] = Math.ceil(totalReviews * 0.7);
    distribution[4] = Math.ceil(totalReviews * 0.25);
    distribution[3] = Math.ceil(totalReviews * 0.05);
  } else if (avgRating >= 4.0) {
    distribution[5] = Math.ceil(totalReviews * 0.5);
    distribution[4] = Math.ceil(totalReviews * 0.35);
    distribution[3] = Math.ceil(totalReviews * 0.15);
  } else if (avgRating >= 3.5) {
    distribution[4] = Math.ceil(totalReviews * 0.4);
    distribution[3] = Math.ceil(totalReviews * 0.4);
    distribution[2] = Math.ceil(totalReviews * 0.2);
  } else {
    distribution[3] = Math.ceil(totalReviews * 0.4);
    distribution[2] = Math.ceil(totalReviews * 0.4);
    distribution[1] = Math.ceil(totalReviews * 0.2);
  }
  
  return distribution;
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateProducts().catch(console.error);
}

export { migrateProducts };
