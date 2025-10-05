import { NextRequest, NextResponse } from 'next/server';
import { calculateScore, validateSubmission } from '@/lib/scoring';
import { QuizSubmission } from '@/types/quiz';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const submission: QuizSubmission = body;

    // Validate the submission
    const validationErrors = validateSubmission(submission);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid submission', details: validationErrors },
        { status: 400 }
      );
    }

    // Calculate the score
    const result = calculateScore(submission);
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process quiz submission' },
      { status: 500 }
    );
  }
}