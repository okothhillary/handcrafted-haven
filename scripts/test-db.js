import { seedDatabase } from '../src/lib/database/seed.js';

// Simple test script to verify database seeding
async function testDatabase() {
  console.log('🧪 Starting database seeding test...');
  
  try {
    await seedDatabase();
    console.log('✅ Database seeding test completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding test failed:', error);
    process.exit(1);
  }
}

// Run test if this file is executed directly
testDatabase().catch(console.error);

export { testDatabase };
module.exports = { testDatabase };
