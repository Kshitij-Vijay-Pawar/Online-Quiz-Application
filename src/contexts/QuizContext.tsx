'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { QuizState, QuizQuestion, QuizResult } from '@/types/quiz';

// Quiz actions
type QuizAction =
  | { type: 'LOAD_QUESTIONS'; payload: QuizQuestion[] }
  | { type: 'SET_ANSWER'; payload: { questionId: number; selectedOption: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'GO_TO_QUESTION'; payload: number }
  | { type: 'TICK_TIMER' }
  | { type: 'SET_TIMER'; payload: number }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'RESET_QUIZ' };

// Initial state
const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 600, // 10 minutes in seconds
  isSubmitted: false,
};

// Quiz reducer
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'LOAD_QUESTIONS':
      return {
        ...state,
        questions: action.payload,
        currentQuestionIndex: 0,
        answers: {},
        isSubmitted: false,
      };

    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.selectedOption,
        },
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          state.questions.length - 1
        ),
      };

    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };

    case 'GO_TO_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(
          0,
          Math.min(action.payload, state.questions.length - 1)
        ),
      };

    case 'TICK_TIMER':
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      };

    case 'SET_TIMER':
      return {
        ...state,
        timeRemaining: action.payload,
      };

    case 'SUBMIT_QUIZ':
      return {
        ...state,
        isSubmitted: true,
      };

    case 'RESET_QUIZ':
      return {
        ...initialState,
        questions: state.questions,
      };

    default:
      return state;
  }
}

// Context types
interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  loadQuestions: () => Promise<void>;
  setAnswer: (questionId: number, selectedOption: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => Promise<QuizResult | null>;
  resetQuiz: () => void;
  getCurrentQuestion: () => QuizQuestion | null;
  getAnsweredQuestionsCount: () => number;
  isCurrentQuestionAnswered: () => boolean;
  formatTime: (seconds: number) => string;
}

const QuizContext = createContext<QuizContextType | null>(null);

// Provider component
export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const submitQuiz = useCallback(async (): Promise<QuizResult | null> => {
    try {
      const answers = state.questions.map(question => ({
        questionId: question.id,
        selectedOption: state.answers[question.id] ?? 0, // Default to 0 if not answered
      }));

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quiz');
      }

      dispatch({ type: 'SUBMIT_QUIZ' });
      return data.result;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }, [state.questions, state.answers]);

  // Timer effect
  useEffect(() => {
    if (state.questions.length > 0 && state.timeRemaining > 0 && !state.isSubmitted) {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.questions.length, state.timeRemaining, state.isSubmitted]);

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (state.timeRemaining === 0 && !state.isSubmitted && state.questions.length > 0) {
      submitQuiz();
    }
  }, [state.timeRemaining, state.isSubmitted, state.questions.length, submitQuiz]);

  const loadQuestions = async (): Promise<void> => {
    try {
      const response = await fetch('/api/quiz/questions');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions');
      }
      
      dispatch({ type: 'LOAD_QUESTIONS', payload: data.questions });
    } catch (error) {
      console.error('Error loading questions:', error);
      throw error;
    }
  };

  const setAnswer = (questionId: number, selectedOption: number): void => {
    dispatch({ type: 'SET_ANSWER', payload: { questionId, selectedOption } });
  };

  const nextQuestion = (): void => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = (): void => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const goToQuestion = (index: number): void => {
    dispatch({ type: 'GO_TO_QUESTION', payload: index });
  };

  const resetQuiz = (): void => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const getCurrentQuestion = (): QuizQuestion | null => {
    return state.questions[state.currentQuestionIndex] || null;
  };

  const getAnsweredQuestionsCount = (): number => {
    return Object.keys(state.answers).length;
  };

  const isCurrentQuestionAnswered = (): boolean => {
    const currentQuestion = getCurrentQuestion();
    return currentQuestion ? currentQuestion.id in state.answers : false;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const contextValue: QuizContextType = {
    state,
    dispatch,
    loadQuestions,
    setAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    getCurrentQuestion,
    getAnsweredQuestionsCount,
    isCurrentQuestionAnswered,
    formatTime,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
}

// Custom hook to use quiz context
export function useQuiz(): QuizContextType {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}