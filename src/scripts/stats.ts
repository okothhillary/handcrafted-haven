#!/usr/bin/env tsx

import { getDatabaseStats, disconnectFromDatabase } from '../lib/database/index';

async function getStats() {
  console.log('📊 Fetching database statistics...');
  
  try {
    const stats = await getDatabaseStats();
    
    console.log(`\n📈 Database Statistics:`);
    console.log(`Total Documents: ${stats.totalDocuments.toLocaleString()}`);
    console.log(`Total Size: ${formatBytes(stats.totalSize)}`);
    console.log(`Collections: ${Object.keys(stats.collections).length}`);
    
    console.log(`\n📋 Collection Details:`);
    Object.entries(stats.collections).forEach(([name, data]) => {
      console.log(`  ${name}:`);
      console.log(`    Documents: ${data.count.toLocaleString()}`);
      console.log(`    Size: ${formatBytes(data.size)}`);
      if (data.avgObjSize > 0) {
        console.log(`    Avg Object Size: ${formatBytes(data.avgObjSize)}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to get database stats:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

if (require.main === module) {
  getStats();
}

export { getStats };
