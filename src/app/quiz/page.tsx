'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import Timer from '@/components/Timer';
import ProgressBar from '@/components/ProgressBar';
import QuestionDisplay from '@/components/QuestionDisplay';
import Navigation from '@/components/Navigation';

export default function QuizPage() {
  const { state, submitQuiz } = useQuiz();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to home if no questions are loaded
  useEffect(() => {
    if (state.questions.length === 0) {
      router.push('/');
    }
  }, [state.questions.length, router]);

  // Redirect to results if quiz is submitted
  useEffect(() => {
    if (state.isSubmitted) {
      router.push('/results');
    }
  }, [state.isSubmitted, router]);

  const handleQuizSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitQuiz();
      if (result) {
        // Store result in localStorage for the results page
        localStorage.setItem('quizResult', JSON.stringify(result));
        router.push('/results');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error; // Re-throw for Navigation component to handle
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if questions aren't loaded yet
  if (state.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Online Quiz Challenge
            </h1>
            <Timer />
          </div>
          <ProgressBar />
        </div>

        {/* Question Section */}
        <div className="mb-6">
          <QuestionDisplay />
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Navigation onQuizSubmit={handleQuizSubmit} />
        </div>

        {/* Auto-submit warning */}
        {state.timeRemaining <= 60 && !state.isSubmitted && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-yellow-800 text-sm">
                {state.timeRemaining <= 30
                  ? 'Time is almost up! Your quiz will be auto-submitted when time runs out.'
                  : 'Less than a minute remaining!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}