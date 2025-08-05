#!/usr/bin/env tsx

import { cleanupDatabase, disconnectFromDatabase } from '../lib/database/index';

async function cleanup() {
  console.log('🧹 Starting database cleanup...');
  
  try {
    const result = await cleanupDatabase();
    
    console.log(`\n✅ Database cleanup completed successfully!`);
    console.log(`📄 Cleaned up ${result.deletedDocuments} expired/soft-deleted documents`);
    console.log(`📁 Cleaned up ${result.cleanedCollections.length} collections:`);
    
    result.cleanedCollections.forEach(collection => {
      console.log(`  - ${collection}`);
    });
    
    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      result.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
}

if (require.main === module) {
  cleanup();
}

export { cleanup };
