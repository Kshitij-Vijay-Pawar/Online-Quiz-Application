import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '../../../../../lib/db-manager';

// GET - Fetch a specific question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid question ID' },
        { status: 400 }
      );
    }

    const question = dbManager.getQuestion(id);
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific question by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid question ID' },
        { status: 400 }
      );
    }

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

    const success = dbManager.updateQuestion(id, questionData);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Question not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { id, ...questionData } });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific question by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid question ID' },
        { status: 400 }
      );
    }

    const success = dbManager.deleteQuestion(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Question not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
