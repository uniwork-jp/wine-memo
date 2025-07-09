import { NextRequest, NextResponse } from 'next/server';
import { WineCreateSchema } from '@wine-memo/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body using Zod
    const validationResult = WineCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: '入力データが無効です',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { name, characteristics, notes, rating, region, vintage, grapeVariety } = validationResult.data;

    // Create the wine record using admin service
    const wineData = {
      name,
      characteristics,
      notes: notes || null,
      rating: rating || null,
      region: region || null,
      vintage: vintage || null,
      grapeVariety: grapeVariety || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Use the admin service to create the wine
    const adminDb = (await import('@wine-memo/firebase')).adminDb;
    const docRef = adminDb.collection('wines').doc();
    await docRef.set(wineData);

    const createdWine = {
      id: docRef.id,
      ...wineData,
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'ワイン記録が正常に保存されました',
        wine: createdWine 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating wine record:', error);
    return NextResponse.json(
      { 
        error: 'ワイン記録の保存中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 