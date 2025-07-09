import { NextResponse } from 'next/server';
import { WineResponseSchema } from '@wine-memo/schemas';

export async function GET() {
  try {
    // Get wines using admin service
    const adminDb = (await import('@wine-memo/firebase')).adminDb;
    const querySnapshot = await adminDb.collection('wines').orderBy('createdAt', 'desc').get();
    
    const wines = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Validate the response data using Zod
    const validatedWines = wines.map(wine => {
      const validationResult = WineResponseSchema.safeParse(wine);
      if (!validationResult.success) {
        console.warn('Invalid wine data:', validationResult.error.errors);
        return null;
      }
      return validationResult.data;
    }).filter(Boolean);

    return NextResponse.json(
      { 
        success: true, 
        wines: validatedWines,
        count: validatedWines.length
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