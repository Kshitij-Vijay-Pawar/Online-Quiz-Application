import { calculateScore, validateSubmission } from '@/lib/scoring';
import { QuizSubmission } from '@/types/quiz';
import { getQuestionsWithAnswers } from '@/lib/database';

// Mock the database module
jest.mock('@/lib/database', () => ({
  getQuestionsWithAnswers: jest.fn()
}));

const mockGetQuestionsWithAnswers = getQuestionsWithAnswers as jest.MockedFunction<typeof getQuestionsWithAnswers>;

const mockQuestions = [
  { id: 1, text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
  { id: 2, text: 'Question 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
  { id: 3, text: 'Question 3?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
  { id: 4, text: 'Question 4?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
  { id: 5, text: 'Question 5?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 }
];

beforeEach(() => {
  mockGetQuestionsWithAnswers.mockReturnValue(mockQuestions);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('calculateScore', () => {
  test('should calculate perfect score correctly', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 0 }, // Correct
        { questionId: 2, selectedOption: 1 }, // Correct
        { questionId: 3, selectedOption: 2 }, // Correct
        { questionId: 4, selectedOption: 3 }, // Correct
        { questionId: 5, selectedOption: 0 }  // Correct
      ]
    };

    const result = calculateScore(submission);

    expect(result.score).toBe(5);
    expect(result.totalQuestions).toBe(5);
    expect(result.percentage).toBe(100);
    expect(result.answers).toHaveLength(5);
    expect(result.answers.every(a => a.isCorrect)).toBe(true);
  });

  test('should calculate partial score correctly', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 0 }, // Correct
        { questionId: 2, selectedOption: 0 }, // Incorrect (should be 1)
        { questionId: 3, selectedOption: 2 }, // Correct
        { questionId: 4, selectedOption: 0 }, // Incorrect (should be 3)
        { questionId: 5, selectedOption: 0 }  // Correct
      ]
    };

    const result = calculateScore(submission);

    expect(result.score).toBe(3);
    expect(result.totalQuestions).toBe(5);
    expect(result.percentage).toBe(60);
    expect(result.answers).toHaveLength(5);
    
    // Check specific answers
    expect(result.answers[0].isCorrect).toBe(true);
    expect(result.answers[1].isCorrect).toBe(false);
    expect(result.answers[2].isCorrect).toBe(true);
    expect(result.answers[3].isCorrect).toBe(false);
    expect(result.answers[4].isCorrect).toBe(true);
  });

  test('should calculate zero score correctly', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 1 }, // Incorrect (should be 0)
        { questionId: 2, selectedOption: 0 }, // Incorrect (should be 1)
        { questionId: 3, selectedOption: 0 }, // Incorrect (should be 2)
        { questionId: 4, selectedOption: 0 }, // Incorrect (should be 3)
        { questionId: 5, selectedOption: 1 }  // Incorrect (should be 0)
      ]
    };

    const result = calculateScore(submission);

    expect(result.score).toBe(0);
    expect(result.totalQuestions).toBe(5);
    expect(result.percentage).toBe(0);
    expect(result.answers).toHaveLength(5);
    expect(result.answers.every(a => !a.isCorrect)).toBe(true);
  });

  test('should include correct answer details in result', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 1 } // Incorrect
      ]
    };

    mockGetQuestionsWithAnswers.mockReturnValue([mockQuestions[0]]);
    const result = calculateScore(submission);

    expect(result.answers[0]).toMatchObject({
      questionId: 1,
      question: 'Question 1?',
      selectedOption: 1,
      correctOption: 0,
      isCorrect: false,
      options: ['A', 'B', 'C', 'D']
    });
  });

  test('should throw error for non-existent question', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 999, selectedOption: 0 } // Non-existent question
      ]
    };

    expect(() => calculateScore(submission)).toThrow('Question with id 999 not found');
  });

  test('should round percentage correctly', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 0 }, // Correct
        { questionId: 2, selectedOption: 0 }, // Incorrect
        { questionId: 3, selectedOption: 0 }  // Incorrect
      ]
    };

    mockGetQuestionsWithAnswers.mockReturnValue(mockQuestions.slice(0, 3));
    const result = calculateScore(submission);

    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(3);
    expect(result.percentage).toBe(33); // 33.33... rounded to 33
  });
});

describe('validateSubmission', () => {
  test('should validate correct submission', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 0 },
        { questionId: 2, selectedOption: 1 },
        { questionId: 3, selectedOption: 2 },
        { questionId: 4, selectedOption: 3 },
        { questionId: 5, selectedOption: 0 }
      ]
    };

    const errors = validateSubmission(submission);
    expect(errors).toEqual([]);
  });

  test('should reject invalid submission format', () => {
    const invalidSubmission = { answers: 'invalid' } as any;
    const errors = validateSubmission(invalidSubmission);
    expect(errors).toContain('Invalid submission format: answers must be an array');
  });

  test('should reject missing answers', () => {
    const submission: QuizSubmission = { answers: null as any };
    const errors = validateSubmission(submission);
    expect(errors).toContain('Invalid submission format: answers must be an array');
  });

  test('should reject wrong number of answers', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 0 }
      ]
    };

    const errors = validateSubmission(submission);
    expect(errors).toContain('Expected 5 answers, but received 1');
  });

  test('should reject invalid question IDs', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 'invalid' as any, selectedOption: 0 },
        { questionId: 999, selectedOption: 1 },
        { questionId: 3, selectedOption: 2 },
        { questionId: 4, selectedOption: 3 },
        { questionId: 5, selectedOption: 0 }
      ]
    };

    const errors = validateSubmission(submission);
    expect(errors).toContain('Answer 1: questionId must be a number');
    expect(errors).toContain('Answer 2: invalid questionId 999');
  });

  test('should reject invalid selected options', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 'invalid' as any },
        { questionId: 2, selectedOption: -1 },
        { questionId: 3, selectedOption: 4 },
        { questionId: 4, selectedOption: 3 },
        { questionId: 5, selectedOption: 0 }
      ]
    };

    const errors = validateSubmission(submission);
    expect(errors).toContain('Answer 1: selectedOption must be a number');
    expect(errors).toContain('Answer 2: selectedOption must be between 0 and 3');
    expect(errors).toContain('Answer 3: selectedOption must be between 0 and 3');
  });

  test('should reject duplicate question IDs', () => {
    const submission: QuizSubmission = {
      answers: [
        { questionId: 1, selectedOption: 0 },
        { questionId: 1, selectedOption: 1 }, // Duplicate
        { questionId: 3, selectedOption: 2 },
        { questionId: 4, selectedOption: 3 },
        { questionId: 5, selectedOption: 0 }
      ]
    };

    const errors = validateSubmission(submission);
    expect(errors).toContain('Duplicate question IDs found in submission');
  });
});