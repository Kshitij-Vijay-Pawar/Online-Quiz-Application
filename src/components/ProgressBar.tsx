'use client';

import { useQuiz } from '@/contexts/QuizContext';

export default function ProgressBar() {
  const { state, getAnsweredQuestionsCount } = useQuiz();
  
  const totalQuestions = state.questions.length;
  const answeredQuestions = getAnsweredQuestionsCount();
  const currentProgress = totalQuestions > 0 ? (state.currentQuestionIndex + 1) / totalQuestions * 100 : 0;
  const answeredProgress = totalQuestions > 0 ? answeredQuestions / totalQuestions * 100 : 0;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {state.currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {answeredQuestions} answered
        </span>
      </div>
      
      <div className="relative w-full bg-gray-200 rounded-full h-2">
        {/* Answered questions background */}
        <div
          className="absolute h-2 bg-green-300 rounded-full transition-all duration-300"
          style={{ width: `${answeredProgress}%` }}
        />
        
        {/* Current position indicator */}
        <div
          className="absolute h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      
      {/* Question indicators */}
      <div className="flex justify-between mt-2">
        {state.questions.map((question, index) => (
          <div
            key={question.id}
            className={`w-3 h-3 rounded-full border-2 cursor-pointer transition-colors ${
              index === state.currentQuestionIndex
                ? 'bg-blue-600 border-blue-600'
                : question.id in state.answers
                ? 'bg-green-500 border-green-500'
                : 'bg-gray-200 border-gray-300'
            }`}
            title={`Question ${index + 1}${question.id in state.answers ? ' (answered)' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}