'use client';

import React, { useState } from 'react';
import RadarChart from '../../components/RaderChart';

interface WineCharacteristics {
  甘口: number;
  軽い: number;
  酸味が弱い: number;
  渋みが弱い: number;
  苦味が少ない: number;
}

const initialData: WineCharacteristics = {
  甘口: 30,
  軽い: 60,
  酸味が弱い: 40,
  渋みが弱い: 50,
  苦味が少ない: 45
};

export default function RadarChartPage() {
  const [wineData, setWineData] = useState<WineCharacteristics>(initialData);

  const handleDataChange = (newData: WineCharacteristics) => {
    setWineData(newData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          ワインレーダーチャート
        </h1>
        
        <div className="flex flex-col items-center">
          <RadarChart 
            data={wineData} 
            width={400} 
            height={400}
            onDataChange={handleDataChange}
          />
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              ポイントをドラッグして値を調整できます
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
              <div className="bg-white p-2 rounded shadow">
                <div className="font-medium text-red-500">甘口</div>
                <div>{wineData.甘口}%</div>
              </div>
              <div className="bg-white p-2 rounded shadow">
                <div className="font-medium text-teal-500">軽い</div>
                <div>{wineData.軽い}%</div>
              </div>
              <div className="bg-white p-2 rounded shadow">
                <div className="font-medium text-blue-500">酸味</div>
                <div>{wineData.酸味が弱い}%</div>
              </div>
              <div className="bg-white p-2 rounded shadow">
                <div className="font-medium text-green-500">渋み</div>
                <div>{wineData.渋みが弱い}%</div>
              </div>
              <div className="bg-white p-2 rounded shadow">
                <div className="font-medium text-yellow-500">苦味</div>
                <div>{wineData.苦味が少ない}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 