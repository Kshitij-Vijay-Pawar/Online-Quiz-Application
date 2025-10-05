#!/usr/bin/env tsx

import { initializeQuizDatabase } from '../src/lib/init-db';

async function main() {
  try {
    console.log('🚀 Initializing quiz database...');
    await initializeQuizDatabase();
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
