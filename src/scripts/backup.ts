#!/usr/bin/env tsx

import { createBackup, disconnectFromDatabase } from '../lib/database/index';
import { promises as fs } from 'fs';
import path from 'path';

async function backup() {
  console.log('💾 Starting database backup...');
  
  try {
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const result = await createBackup();
    
    console.log(`\n✅ Database backup completed successfully!`);
    console.log(`📁 Backup file: ${result.filename}`);
    console.log(`📊 Backup size: ${formatBytes(result.size)}`);
    console.log(`⏱️  Backup duration: ${result.duration}ms`);
    console.log(`📄 Collections backed up: ${result.collections.length}`);
    
    result.collections.forEach(collection => {
      console.log(`  - ${collection.name}: ${collection.documentCount.toLocaleString()} documents`);
    });
    
    if (result.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered:`);
      result.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database backup failed:', error);
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
  backup();
}

export { backup };
