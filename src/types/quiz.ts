export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  // Note: correctAnswer is NOT included when sending to frontend
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
}

export interface QuizSubmission {
  answers: UserAnswer[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    questionId: number;
    question: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    options: string[];
  }[];
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: { [questionId: number]: number };
  timeRemaining: number; // in seconds
  isSubmitted: boolean;
}