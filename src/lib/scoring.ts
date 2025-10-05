import { QuizSubmission, QuizResult, UserAnswer } from '@/types/quiz';
import { getQuestionsWithAnswers } from './database';

export function calculateScore(submission: QuizSubmission): QuizResult {
  const questions = getQuestionsWithAnswers();
  const questionMap = new Map(questions.map(q => [q.id, q]));
  
  let score = 0;
  const results = submission.answers.map((answer: UserAnswer) => {
    const question = questionMap.get(answer.questionId);
    if (!question) {
      throw new Error(`Question with id ${answer.questionId} not found`);
    }
    
    const isCorrect = answer.selectedOption === question.correctAnswer;
    if (isCorrect) {
      score++;
    }
    
    return {
      questionId: answer.questionId,
      question: question.text,
      selectedOption: answer.selectedOption,
      correctOption: question.correctAnswer,
      isCorrect,
      options: question.options
    };
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  return {
    score,
    totalQuestions,
    percentage,
    answers: results
  };
}

export function validateSubmission(submission: QuizSubmission): string[] {
  const errors: string[] = [];
  
  if (!submission.answers || !Array.isArray(submission.answers)) {
    errors.push('Invalid submission format: answers must be an array');
    return errors;
  }

  const questions = getQuestionsWithAnswers();
  const questionIds = new Set(questions.map(q => q.id));

  // Check if all questions are answered
  if (submission.answers.length !== questions.length) {
    errors.push(`Expected ${questions.length} answers, but received ${submission.answers.length}`);
  }

  // Validate each answer
  submission.answers.forEach((answer, index) => {
    if (typeof answer.questionId !== 'number') {
      errors.push(`Answer ${index + 1}: questionId must be a number`);
    } else if (!questionIds.has(answer.questionId)) {
      errors.push(`Answer ${index + 1}: invalid questionId ${answer.questionId}`);
    }

    if (typeof answer.selectedOption !== 'number') {
      errors.push(`Answer ${index + 1}: selectedOption must be a number`);
    } else if (answer.selectedOption < 0 || answer.selectedOption > 3) {
      errors.push(`Answer ${index + 1}: selectedOption must be between 0 and 3`);
    }
  });

  // Check for duplicate question IDs
  const submittedQuestionIds = submission.answers.map(a => a.questionId);
  const uniqueQuestionIds = new Set(submittedQuestionIds);
  if (submittedQuestionIds.length !== uniqueQuestionIds.size) {
    errors.push('Duplicate question IDs found in submission');
  }

  return errors;
}