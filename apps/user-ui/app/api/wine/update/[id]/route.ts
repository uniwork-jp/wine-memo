import { NextRequest, NextResponse } from 'next/server';
import { WineUpdateSchema } from '@wine-memo/schemas';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ワインIDが必要です' },
        { status: 400 }
      );
    }

    // Validate the request body using Zod
    const validationResult = WineUpdateSchema.safeParse({ id, ...body });
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

    // Update the wine record using admin service
    const adminDb = (await import('@wine-memo/firebase')).adminDb;
    const docRef = adminDb.collection('wines').doc(id);
    
    const updateData = {
      ...(name && { name }),
      ...(characteristics && { characteristics }),
      ...(notes !== undefined && { notes }),
      ...(rating !== undefined && { rating }),
      ...(region !== undefined && { region }),
      ...(vintage !== undefined && { vintage }),
      ...(grapeVariety !== undefined && { grapeVariety }),
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