import { NextResponse } from 'next/server';
import { getQuestions } from '@/lib/database';

export async function GET() {
  try {
    const questions = getQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}