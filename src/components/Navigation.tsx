'use client';

import { useState } from 'react';
import { useQuiz } from '@/contexts/QuizContext';

interface NavigationProps {
  onQuizSubmit: () => void;
}

export default function Navigation({ onQuizSubmit }: NavigationProps) {
  const { state, nextQuestion, previousQuestion, getAnsweredQuestionsCount } = useQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const answeredCount = getAnsweredQuestionsCount();
  const totalQuestions = state.questions.length;
  const allAnswered = answeredCount === totalQuestions;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    const confirmed = confirm(
      allAnswered 
        ? 'Are you sure you want to submit your quiz? You cannot change your answers after submission.'
        : `You have only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`
    );
    
    if (confirmed) {
      setIsSubmitting(true);
      try {
        await onQuizSubmit();
      } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Failed to submit quiz. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
      <button
        onClick={previousQuestion}
        disabled={isFirstQuestion}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          isFirstQuestion
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        ← Previous
      </button>

      <div className="text-sm text-gray-600">
        {answeredCount} / {totalQuestions} answered
      </div>

      <div className="flex space-x-3">
        {!isLastQuestion ? (
          <button
            onClick={nextQuestion}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : allAnswered
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}