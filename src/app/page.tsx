'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadQuestions, resetQuiz } = useQuiz();
  const router = useRouter();

  const startQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loadQuestions();
      router.push('/quiz');
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryQuiz = () => {
    resetQuiz();
    startQuiz();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Online Quiz Challenge
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Test your knowledge with our interactive quiz! Answer 10 questions
            and see how well you score.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Instructions</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-xs">1</span>
              </div>
              <p>10 multiple choice questions</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-xs">2</span>
              </div>
              <p>10 minutes time limit</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-xs">3</span>
              </div>
              <p>Navigate with Previous/Next</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-xs">4</span>
              </div>
              <p>View results after submission</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleRetryQuiz}
              className="mt-2 text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Try again
            </button>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={startQuiz}
            disabled={isLoading}
            className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
              isLoading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  />
                </svg>
                <span>Loading Quiz...</span>
              </div>
            ) : (
              '🎮 Start Quiz'
            )}
          </button>
          
          <div className="flex space-x-4">
            <a
              href="/demo"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
            >
              📋 View Demo
            </a>
            <a
              href="/admin"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
            >
              🔧 Admin Panel
            </a>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Good luck! Do your best and have fun.
        </p>
      </div>
    </div>
  );
}
