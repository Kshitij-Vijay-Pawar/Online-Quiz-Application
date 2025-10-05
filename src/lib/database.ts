import Database from 'better-sqlite3';
import path from 'path';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const dbPath = path.join(process.cwd(), 'quiz.db');
let db: Database.Database;

// Initialize database connection
export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

// Initialize database schema
function initializeDatabase() {
  const createQuestionsTable = `
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer INTEGER NOT NULL CHECK (correct_answer IN (0, 1, 2, 3))
    )
  `;

  db.exec(createQuestionsTable);
}

// Seed database with sample questions
export function seedDatabase() {

  const questions = [
  {
    text: "What is the capital of India?",
    options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"],
    correctAnswer: 2
  },
  {
    text: "Who is known as the Father of the Nation in India?",
    options: ["Jawaharlal Nehru", "Mahatma Gandhi", "B. R. Ambedkar", "Subhas Chandra Bose"],
    correctAnswer: 1
  },
  {
    text: "Which Indian city is also known as the 'Pink City'?",
    options: ["Jaipur", "Udaipur", "Jodhpur", "Agra"],
    correctAnswer: 0
  },
  {
    text: "What is the national animal of India?",
    options: ["Lion", "Tiger", "Elephant", "Peacock"],
    correctAnswer: 1
  },
  {
    text: "In which year did India gain independence?",
    options: ["1945", "1946", "1947", "1948"],
    correctAnswer: 2
  },
  {
    text: "Who was the first Prime Minister of India?",
    options: ["Sardar Patel", "Mahatma Gandhi", "Jawaharlal Nehru", "Dr. Rajendra Prasad"],
    correctAnswer: 2
  },
  {
    text: "Which is the largest state in India by area?",
    options: ["Maharashtra", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh"],
    correctAnswer: 1
  },
  {
    text: "What is the national currency of India?",
    options: ["Dollar", "Rupee", "Pound", "Dinar"],
    correctAnswer: 1
  },
  {
    text: "Which river is known as the 'Ganga of the South'?",
    options: ["Godavari", "Krishna", "Cauvery", "Yamuna"],
    correctAnswer: 2
  },
  {
    text: "Who wrote the Indian National Anthem?",
    options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Subramania Bharati"],
    correctAnswer: 1
  },
  {
    text: "Which Indian festival is known as the 'Festival of Lights'?",
    options: ["Holi", "Diwali", "Navratri", "Eid"],
    correctAnswer: 1
  },
  {
    text: "Which city is known as the financial capital of India?",
    options: ["Chennai", "New Delhi", "Bengaluru", "Mumbai"],
    correctAnswer: 3
  },
  {
    text: "Where is the Taj Mahal located?",
    options: ["Delhi", "Agra", "Jaipur", "Lucknow"],
    correctAnswer: 1
  },
  {
    text: "Who was the first woman Prime Minister of India?",
    options: ["Sarojini Naidu", "Pratibha Patil", "Indira Gandhi", "Sushma Swaraj"],
    correctAnswer: 2
  },
  {
    text: "Which Indian state is known as the 'Land of Five Rivers'?",
    options: ["Punjab", "Haryana", "Bihar", "Gujarat"],
    correctAnswer: 0
  }
];


  const database = getDatabase();
  
  // Check if questions already exist
  const count = database.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number };
  if (count.count > 0) {
    return; // Questions already seeded
  }

  const insertQuestion = database.prepare(`
    INSERT INTO questions (text, option_a, option_b, option_c, option_d, correct_answer)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = database.transaction((questionsToInsert: typeof questions) => {
    for (const question of questionsToInsert) {
      insertQuestion.run(
        question.text,
        question.options[0],
        question.options[1],
        question.options[2],
        question.options[3],
        question.correctAnswer
      );
    }
  });

  insertMany(questions);
}

// Get all questions (without correct answers for frontend)
export function getQuestions() {
  const database = getDatabase();
  const rows = database.prepare(`
    SELECT id, text, option_a, option_b, option_c, option_d
    FROM questions
    ORDER BY id
  `).all() as Array<{
    id: number;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  }>;

  return rows.map(row => ({
    id: row.id,
    text: row.text,
    options: [row.option_a, row.option_b, row.option_c, row.option_d]
  }));
}

// Get all questions with correct answers (for scoring)
export function getQuestionsWithAnswers(): Question[] {
  const database = getDatabase();
  const rows = database.prepare(`
    SELECT id, text, option_a, option_b, option_c, option_d, correct_answer
    FROM questions
    ORDER BY id
  `).all() as Array<{
    id: number;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: number;
  }>;

  return rows.map(row => ({
    id: row.id,
    text: row.text,
    options: [row.option_a, row.option_b, row.option_c, row.option_d],
    correctAnswer: row.correct_answer
  }));
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close();
  }
}