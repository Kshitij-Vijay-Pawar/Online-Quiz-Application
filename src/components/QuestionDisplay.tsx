'use client';

import { useQuiz } from '@/contexts/QuizContext';

export default function QuestionDisplay() {
  const { state, setAnswer, getCurrentQuestion } = useQuiz();
  
  const currentQuestion = getCurrentQuestion();
  
  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No question available</p>
      </div>
    );
  }

  const selectedOption = state.answers[currentQuestion.id];

  const handleOptionChange = (optionIndex: number) => {
    setAnswer(currentQuestion.id, optionIndex);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentQuestion.text}
        </h2>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedOption === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${currentQuestion.id}`}
              value={index}
              checked={selectedOption === index}
              onChange={() => handleOptionChange(index)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 text-sm sm:text-base">
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </span>
          </label>
        ))}
      </div>

      {selectedOption !== undefined && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            ✓ Answer selected: {String.fromCharCode(65 + selectedOption)}
          </p>
        </div>
      )}
    </div>
  );
}