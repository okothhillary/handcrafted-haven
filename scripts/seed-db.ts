#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * This script seeds the MongoDB database with initial data for the Handcrafted Haven application.
 * 
 * Usage:
 *   npm run seed
 *   or
 *   npx tsx scripts/seed-db.ts
 * 
 * Environment Variables:
 *   MONGODB_URI - MongoDB connection string (defaults to local instance)
 */

import { seedDatabase } from '../src/lib/database/seed';

console.log('🌱 Starting database seeding...');
console.log('='.repeat(50));

seedDatabase()
  .then(() => {
    console.log('='.repeat(50));
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('='.repeat(50));
    console.error('💥 Database seeding failed:');
    console.error(error);
    process.exit(1);
  });
