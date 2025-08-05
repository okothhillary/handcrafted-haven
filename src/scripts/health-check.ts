#!/usr/bin/env tsx

import { checkDatabaseHealth, disconnectFromDatabase } from '../lib/database/index';

async function healthCheck() {
  console.log('🔍 Checking database health...');
  
  try {
    const health = await checkDatabaseHealth();
    
    console.log(`\n📊 Database Health Report:`);
    console.log(`Status: ${health.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`Connected: ${health.details.connected ? 'Yes' : 'No'}`);
    console.log(`Ready State: ${health.details.readyState}`);
    
    if (health.details.host) {
      console.log(`Host: ${health.details.host}`);
    }
    
    if (health.details.name) {
      console.log(`Database: ${health.details.name}`);
    }
    
    if (health.details.collections) {
      console.log(`Collections: ${health.details.collections.length}`);
      health.details.collections.forEach(collection => {
        console.log(`  - ${collection}`);
      });
    }
    
    if (health.status === 'unhealthy') {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
}

if (require.main === module) {
  healthCheck();
}

export { healthCheck };
