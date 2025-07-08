'use client';

import React from 'react';
import RadarChart from '../../components/RaderChart';

const sampleData = {
  甘口: 30,
  軽い: 60,
  酸味が弱い: 40,
  渋みが弱い: 50,
  苦味が少ない: 45
};

export default function RadarChartPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          ワインレーダーチャート
        </h1>
        
        <div className="flex justify-center">
          <RadarChart 
            data={sampleData} 
            width={400} 
            height={400}
          />
        </div>
      </div>
    </div>
  );
} 