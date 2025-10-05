'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizResult } from '@/types/quiz';
import { useQuiz } from '@/contexts/QuizContext';

export default function ResultsPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { resetQuiz } = useQuiz();

  useEffect(() => {
    // Try to get result from localStorage
    const storedResult = localStorage.getItem('quizResult');
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing stored result:', error);
        router.push('/');
      }
    } else {
      // No result found, redirect to home
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleRetakeQuiz = () => {
    localStorage.removeItem('quizResult');
    resetQuiz();
    router.push('/');
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent! Outstanding performance! 🎉';
    if (percentage >= 80) return 'Great job! Very well done! 👏';
    if (percentage >= 70) return 'Good work! You did well! 👍';
    if (percentage >= 60) return 'Not bad! Room for improvement. 💪';
    if (percentage >= 40) return 'Keep trying! Practice makes perfect. 📚';
    return 'Don\'t give up! Every attempt is a learning opportunity. 🌟';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No results found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8 text-center">
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </div>
            <div className="text-2xl text-gray-800 mb-2">
              {result.score} out of {result.totalQuestions} correct
            </div>
            <p className="text-lg text-gray-600 mb-6">
              {getScoreMessage(result.percentage)}
            </p>
          </div>

          {/* Score visualization */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                result.percentage >= 80
                  ? 'bg-green-500'
                  : result.percentage >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${result.percentage}%` }}
            />
          </div>

          <button
            onClick={handleRetakeQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Take Quiz Again
          </button>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Detailed Results
          </h2>

          <div className="space-y-6">
            {result.answers.map((answer, index) => (
              <div
                key={answer.questionId}
                className={`p-6 rounded-lg border-2 ${
                  answer.isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Question {index + 1}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      answer.isCorrect
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{answer.question}</p>

                <div className="grid gap-2">
                  {answer.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg border ${
                        optionIndex === answer.correctOption
                          ? 'border-green-500 bg-green-100'
                          : optionIndex === answer.selectedOption && !answer.isCorrect
                          ? 'border-red-500 bg-red-100'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <span className="flex-1">{option}</span>
                        <div className="flex items-center space-x-2">
                          {optionIndex === answer.correctOption && (
                            <span className="text-green-600 text-sm">
                              ✓ Correct
                            </span>
                          )}
                          {optionIndex === answer.selectedOption &&
                            optionIndex !== answer.correctOption && (
                              <span className="text-red-600 text-sm">
                                ✗ Your answer
                              </span>
                            )}
                          {optionIndex === answer.selectedOption &&
                            optionIndex === answer.correctOption && (
                              <span className="text-green-600 text-sm">
                                ✓ Your answer
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {result.answers.filter(a => a.isCorrect).length}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {result.answers.filter(a => !a.isCorrect).length}
                </div>
                <div className="text-sm text-gray-600">Incorrect Answers</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                  {result.percentage}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleRetakeQuiz}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}