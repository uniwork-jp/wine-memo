import { NextRequest, NextResponse } from 'next/server';
import { wineService } from '@wine-memo/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wineName, wineCharacteristics } = body;

    // Validate required fields
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

    // Create the wine record
    const wineData = {
      name: wineName,
      characteristics,
    };

    const createdWine = await wineService.create(wineData);

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