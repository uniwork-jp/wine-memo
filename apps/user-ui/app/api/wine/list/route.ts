import { NextResponse } from 'next/server';
import { adminWineService } from '@wine-memo/firebase';

export async function GET() {
  try {
    const wines = await adminWineService.getAllWines();
    
    return NextResponse.json(
      { 
        success: true, 
        wines,
        count: wines.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching wine records:', error);
    return NextResponse.json(
      { 
        error: 'ワイン記録の取得中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 