'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  wineId?: string;
  onImageUploaded?: (imageUrl: string) => void;
  onOCRCompleted?: (ocrData: any) => void;
  currentImageUrl?: string;
}

export default function ImageUpload({ 
  wineId, 
  onImageUploaded, 
  onOCRCompleted, 
  currentImageUrl 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(currentImageUrl || null);
  const [ocrData, setOcrData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (wineId) {
        formData.append('wineId', wineId);
      }

      const response = await fetch('/api/wine/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '画像のアップロードに失敗しました');
      }

      setUploadedImageUrl(result.imageUrl);
      onImageUploaded?.(result.imageUrl);

      // Automatically trigger OCR if wineId is provided
      if (wineId) {
        await processOCR(result.imageUrl, wineId);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロード中にエラーが発生しました');
    } finally {
      setIsUploading(false);
    }
  };

  const processOCR = async (imageUrl: string, wineId: string) => {
    setIsProcessingOCR(true);
    setError(null);

    try {
      const response = await fetch('/api/wine/process-ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, wineId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'OCR処理に失敗しました');
      }

      setOcrData(result.data);
      onOCRCompleted?.(result.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR処理中にエラーが発生しました');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const handleManualOCR = () => {
    if (uploadedImageUrl && wineId) {
      processOCR(uploadedImageUrl, wineId);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    setOcrData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {uploadedImageUrl ? (
          <div className="space-y-4">
            <div className="relative mx-auto max-w-xs">
              <Image
                src={uploadedImageUrl}
                alt="Wine label"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-2">
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                画像を削除
              </button>
              {wineId && (
                <button
                  onClick={handleManualOCR}
                  disabled={isProcessingOCR}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isProcessingOCR ? 'OCR処理中...' : 'OCR処理を実行'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'アップロード中...' : 'ワインラベル画像を選択'}
            </button>
            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG, GIF形式、最大10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {ocrData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">OCR結果</h3>
          <div className="space-y-1 text-sm text-green-700">
            {ocrData.wineName && (
              <p><strong>ワイン名:</strong> {ocrData.wineName}</p>
            )}
            {ocrData.grapeVariety && (
              <p><strong>ブドウ品種:</strong> {ocrData.grapeVariety}</p>
            )}
            {ocrData.region && (
              <p><strong>地域:</strong> {ocrData.region}</p>
            )}
            {ocrData.vintage && (
              <p><strong>ヴィンテージ:</strong> {ocrData.vintage}</p>
            )}
            {ocrData.producer && (
              <p><strong>生産者:</strong> {ocrData.producer}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 