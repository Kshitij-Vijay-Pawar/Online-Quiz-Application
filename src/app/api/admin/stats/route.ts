import { NextResponse } from 'next/server';
import { dbManager } from '../../../../lib/db-manager';

// GET - Fetch database statistics
export async function GET() {
  try {
    const count = dbManager.getQuestionCount();
    return NextResponse.json({ 
      success: true, 
      data: { 
        totalQuestions: count 
      } 
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
