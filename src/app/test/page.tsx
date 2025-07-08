import React from 'react';
import WineLadderChart from '../../components/WineLadderChart';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ワインメモ
          </h1>
          <p className="text-gray-600">
            ワインの特性を記録しましょう
          </p>
        </div>

        <WineLadderChart />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            スライダーを動かしてワインの特性を評価してください
          </p>
        </div>
      </div>
    </div>
  );
} 