import { NextRequest, NextResponse } from 'next/server';
import { adminWineService } from '@wine-memo/firebase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ワインIDが必要です' },
        { status: 400 }
      );
    }

    // Delete the wine using admin service
    await adminWineService.deleteWine(id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'ワイン記録が正常に削除されました'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting wine record:', error);
    return NextResponse.json(
      { 
        error: 'ワイン記録の削除中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 