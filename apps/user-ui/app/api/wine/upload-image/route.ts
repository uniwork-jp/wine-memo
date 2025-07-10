import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@wine-memo/firebase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const wineId = formData.get('wineId') as string;

    if (!file) {
      return NextResponse.json(
        { error: '画像ファイルが必要です' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '画像ファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは10MB以下にしてください' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `wine-labels/${wineId || 'temp'}/${timestamp}-${file.name}`;

    // Upload to Firebase Storage
    const bucket = adminDb.storage().bucket();
    const fileRef = bucket.file(filename);
    
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          wineId: wineId || '',
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Make the file publicly accessible
    await fileRef.makePublic();

    // Get the public URL
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    // If wineId is provided, update the wine record with the image URL
    if (wineId) {
      const wineRef = adminDb.collection('wines').doc(wineId);
      await wineRef.update({
        imageUrl,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: '画像が正常にアップロードされました',
        imageUrl,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      {
        error: '画像のアップロード中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 