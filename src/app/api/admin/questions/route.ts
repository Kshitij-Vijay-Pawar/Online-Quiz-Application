import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '../../../../lib/db-manager';

// GET - Fetch all questions
export async function GET() {
  try {
    const questions = dbManager.getAllQuestions();
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST - Add a new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, options, correctAnswer } = body;

    // Validate required fields
    if (!text || !options || !Array.isArray(options) || options.length !== 4 || typeof correctAnswer !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid question data' },
        { status: 400 }
      );
    }

    // Validate correctAnswer is within range
    if (correctAnswer < 0 || correctAnswer > 3) {
      return NextResponse.json(
        { success: false, error: 'Correct answer must be between 0 and 3' },
        { status: 400 }
      );
    }

    const questionData = {
      text,
      options,
      correctAnswer
    };

    const id = dbManager.addQuestion(questionData);
    return NextResponse.json({ success: true, data: { id, ...questionData } });
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add question' },
      { status: 500 }
    );
  }
}
