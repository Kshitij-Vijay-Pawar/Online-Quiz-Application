import { getDatabase } from './database';

interface QuestionData {
  text: string;
  options: string[];
  correctAnswer: number;
}

export class DatabaseManager {
  private db = getDatabase();

  // Add a single question
  addQuestion(question: QuestionData): number {
    const insertQuestion = this.db.prepare(`
      INSERT INTO questions (text, option_a, option_b, option_c, option_d, correct_answer)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertQuestion.run(
      question.text,
      question.options[0],
      question.options[1],
      question.options[2],
      question.options[3],
      question.correctAnswer
    );

    return result.lastInsertRowid as number;
  }

  // Add multiple questions
  addQuestions(questions: QuestionData[]): void {
    const insertQuestion = this.db.prepare(`
      INSERT INTO questions (text, option_a, option_b, option_c, option_d, correct_answer)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((questionsToInsert: QuestionData[]) => {
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

  // Update an existing question
  updateQuestion(id: number, question: QuestionData): boolean {
    const updateQuestion = this.db.prepare(`
      UPDATE questions 
      SET text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?
      WHERE id = ?
    `);

    const result = updateQuestion.run(
      question.text,
      question.options[0],
      question.options[1],
      question.options[2],
      question.options[3],
      question.correctAnswer,
      id
    );

    return result.changes > 0;
  }

  // Delete a question
  deleteQuestion(id: number): boolean {
    const deleteQuestion = this.db.prepare('DELETE FROM questions WHERE id = ?');
    const result = deleteQuestion.run(id);
    return result.changes > 0;
  }

  // Get a specific question
  getQuestion(id: number) {
    const getQuestion = this.db.prepare(`
      SELECT id, text, option_a, option_b, option_c, option_d, correct_answer
      FROM questions
      WHERE id = ?
    `);

    const row = getQuestion.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      text: row.text,
      options: [row.option_a, row.option_b, row.option_c, row.option_d],
      correctAnswer: row.correct_answer
    };
  }

  // Get all questions
  getAllQuestions() {
    const rows = this.db.prepare(`
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

  // Get question count
  getQuestionCount(): number {
    const count = this.db.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number };
    return count.count;
  }

  // Clear all questions
  clearAllQuestions(): void {
    this.db.prepare('DELETE FROM questions').run();
  }

  // Reset auto-increment counter
  resetAutoIncrement(): void {
    this.db.prepare('DELETE FROM sqlite_sequence WHERE name = "questions"').run();
  }
}

// Export a singleton instance
export const dbManager = new DatabaseManager();

