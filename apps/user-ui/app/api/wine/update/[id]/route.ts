import { NextRequest, NextResponse } from 'next/server';
import { adminWineService } from '@wine-memo/firebase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { wineName, wineCharacteristics, notes, rating, region, vintage, grapeVariety } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ワインIDが必要です' },
        { status: 400 }
      );
    }

    if (!wineName || !wineCharacteristics) {
      return NextResponse.json(
        { error: 'ワイン名と特性データが必要です' },
        { status: 400 }
      );
    }

    // Map the Japanese characteristics to English for the database
    const characteristics = {
      sweetness: wineCharacteristics.甘口,
      body: wineCharacteristics.軽い,
      acidity: wineCharacteristics.酸味が弱い,
      tannin: wineCharacteristics.渋みが弱い,
      bitterness: wineCharacteristics.苦味が少ない,
    };

    // Update the wine record using admin service
    const adminDb = (await import('@wine-memo/firebase')).adminDb;
    const docRef = adminDb.collection('wines').doc(id);
    
    const updateData = {
      name: wineName,
      characteristics,
      notes: notes || null,
      rating: rating || null,
      region: region || null,
      vintage: vintage || null,
      grapeVariety: grapeVariety || null,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);

    const updatedWine = {
      id,
      ...updateData,
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'ワイン記録が正常に更新されました',
        wine: updatedWine 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating wine record:', error);
    return NextResponse.json(
      { 
        error: 'ワイン記録の更新中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 