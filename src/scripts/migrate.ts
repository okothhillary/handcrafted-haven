#!/usr/bin/env tsx

import { runMigrations, connectToDatabase, disconnectFromDatabase } from '../lib/database/index';

async function migrate() {
  console.log('🔄 Starting database migration...');
  
  try {
    await connectToDatabase();
    await runMigrations();
    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
}

if (require.main === module) {
  migrate();
}

export { migrate };
