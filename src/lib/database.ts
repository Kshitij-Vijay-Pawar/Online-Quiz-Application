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
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      text: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2
    },
    {
      text: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3
    },
    {
      text: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1
    },
    {
      text: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2
    },
    {
      text: "Which programming language is known as the 'language of the web'?",
      options: ["Python", "Java", "JavaScript", "C++"],
      correctAnswer: 2
    },
    {
      text: "What is the smallest country in the world?",
      options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
      correctAnswer: 2
    },
    {
      text: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2
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