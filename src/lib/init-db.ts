import { seedDatabase, getDatabase } from './database';

// Initialize and seed the database
export function initializeQuizDatabase() {
  try {
    // Initialize database connection
    const db = getDatabase();
    
    // Seed with sample questions
    seedDatabase();
    
    // Check if seeding was successful
    const count = db.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number };
    console.log(`Database initialized successfully with ${count.count} questions`);
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  try {
    initializeQuizDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}