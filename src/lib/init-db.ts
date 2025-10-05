import { seedDatabase } from './database';

// Initialize and seed the database
export function initializeQuizDatabase() {
  try {
    seedDatabase();
    console.log('Database initialized and seeded successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeQuizDatabase();
}