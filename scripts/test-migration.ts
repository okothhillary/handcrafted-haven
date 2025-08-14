#!/usr/bin/env tsx

/**
 * Product Migration Test Script
 * 
 * This script shows what would be migrated without requiring MongoDB
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { PRODUCTS } from '../src/data/products';
import mongoose from 'mongoose';

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

async function testMigration() {
  console.log('🧪 Testing Product Migration (Dry Run)...');
  console.log(`📊 Found ${PRODUCTS.length} products to migrate\n`);

  const mapping = [];

  for (const staticProduct of PRODUCTS) {
    const mockObjectId = new mongoose.Types.ObjectId();
    
    console.log(`📦 ${staticProduct.name}`);
    console.log(`   Static ID: ${staticProduct.id}`);
    console.log(`   MongoDB ID: ${mockObjectId.toString()}`);
    console.log(`   Category: ${staticProduct.category}`);
    console.log(`   Price: $${staticProduct.price}`);
    console.log(`   Rating: ${staticProduct.rating} (${staticProduct.reviews} reviews)`);
    console.log('');

    mapping.push({
      staticId: staticProduct.id,
      mongoId: mockObjectId.toString(),
      name: staticProduct.name,
      category: staticProduct.category,
      price: staticProduct.price
    });
  }

  // Save mapping to file
  const fs = await import('fs');
  await fs.promises.writeFile(
    'product-migration-preview.json', 
    JSON.stringify(mapping, null, 2), 
    'utf8'
  );

  console.log('✅ Migration preview completed!');
  console.log(`📄 Mapping preview saved to: product-migration-preview.json`);
  console.log('\n🗺️  Static ID -> MongoDB ObjectId Mapping:');
  mapping.forEach(({ staticId, mongoId, name }) => {
    console.log(`   ${staticId} -> ${mongoId} (${name})`);
  });

  console.log('\n💡 To run actual migration:');
  console.log('1. Make sure MongoDB is running (local or Atlas)');
  console.log('2. Run: npm run migrate:products');
}

// Run the test
testMigration().catch(console.error);
