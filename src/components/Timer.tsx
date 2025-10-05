'use client';

import { useQuiz } from '@/contexts/QuizContext';

export default function Timer() {
  const { state, formatTime } = useQuiz();

  const isLowTime = state.timeRemaining <= 60; // Less than 1 minute
  const isCriticalTime = state.timeRemaining <= 30; // Less than 30 seconds

  return (
    <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold transition-colors ${
      isCriticalTime
        ? 'bg-red-500 text-white animate-pulse'
        : isLowTime
        ? 'bg-yellow-500 text-white'
        : 'bg-blue-500 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{formatTime(state.timeRemaining)}</span>
      </div>
    </div>
  );
}