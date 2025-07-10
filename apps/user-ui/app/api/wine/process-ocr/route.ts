import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, wineId } = body;

    if (!imageUrl || !wineId) {
      return NextResponse.json(
        { error: 'imageUrl and wineId are required' },
        { status: 400 }
      );
    }

    // Get the Firebase Functions URL from environment
    const functionsUrl = process.env.FIREBASE_FUNCTIONS_URL;
    if (!functionsUrl) {
      return NextResponse.json(
        { error: 'Firebase Functions URL not configured' },
        { status: 500 }
      );
    }

    // Call the Firebase Function for OCR processing
    const response = await fetch(`${functionsUrl}/processWineLabelHttp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, wineId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'OCR処理中にエラーが発生しました', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: 'OCR処理が完了しました',
        data: result.data,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing OCR:', error);
    return NextResponse.json(
      {
        error: 'OCR処理中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 