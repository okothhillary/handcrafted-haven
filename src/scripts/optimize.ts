#!/usr/bin/env tsx

import { optimizeDatabase, disconnectFromDatabase } from '../lib/database/index';

async function optimize() {
  console.log('⚡ Starting database optimization...');
  
  try {
    const result = await optimizeDatabase();
    
    console.log(`\n✅ Database optimization completed successfully!`);
    console.log(`📊 Optimized ${result.optimizedCollections.length} collections`);
    console.log(`📈 Performance improvements:`);
    
    result.optimizedCollections.forEach(collection => {
      console.log(`  - ${collection.name}: ${collection.improvements.join(', ')}`);
    });
    
    console.log(`\n🔍 Index Analysis:`);
    console.log(`  Created Indexes: ${result.indexesCreated}`);
    console.log(`  Unused Indexes Removed: ${result.unusedIndexesRemoved}`);
    
    if (result.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      result.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
}

if (require.main === module) {
  optimize();
}

export { optimize };
