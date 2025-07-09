'use client';

import React, { useState } from 'react';

interface WineCharacteristic {
  id: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
}

interface WineLadderChartProps {
  characteristics?: WineCharacteristic[];
  onChange?: (characteristics: WineCharacteristic[]) => void;
  readOnly?: boolean;
}

const defaultCharacteristics: WineCharacteristic[] = [
  {
    id: 'sweetness',
    leftLabel: '甘口',
    rightLabel: '辛口（ドライ）',
    value: 50
  },
  {
    id: 'body',
    leftLabel: '軽い',
    rightLabel: '重い（ボディ）',
    value: 50
  },
  {
    id: 'acidity',
    leftLabel: '酸味が弱い',
    rightLabel: '酸味が強い',
    value: 50
  },
  {
    id: 'tannin',
    leftLabel: '渋みが弱い',
    rightLabel: '渋みが強い（タンニン）',
    value: 50
  },
  {
    id: 'bitterness',
    leftLabel: '苦味が少ない',
    rightLabel: '苦味がある',
    value: 50
  }
];

export default function WineLadderChart({ 
  characteristics = defaultCharacteristics, 
  onChange, 
  readOnly = false 
}: WineLadderChartProps) {
  const [localCharacteristics, setLocalCharacteristics] = useState(characteristics);

  const handleSliderChange = (id: string, value: number) => {
    const updatedCharacteristics = localCharacteristics.map(char => 
      char.id === id ? { ...char, value } : char
    );
    setLocalCharacteristics(updatedCharacteristics);
    onChange?.(updatedCharacteristics);
  };

  const getSliderColor = (value: number) => {
    const hue = 200; // Blue hue
    const saturation = 70;
    const lightness = 50 + (value / 100) * 20; // Varies from 50% to 70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        ワイン特性チャート
      </h2>
      
      <div className="space-y-6">
        {localCharacteristics.map((characteristic) => (
          <div key={characteristic.id} className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{characteristic.leftLabel}</span>
              <span>{characteristic.rightLabel}</span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={characteristic.value}
                onChange={(e) => handleSliderChange(characteristic.id, parseInt(e.target.value))}
                disabled={readOnly}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${characteristic.value}%, ${getSliderColor(characteristic.value)} ${characteristic.value}%, ${getSliderColor(characteristic.value)} 100%)`
                }}
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
              
              <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
                <div 
                  className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md transform -translate-y-0.5"
                  style={{ 
                    left: `${characteristic.value}%`,
                    transform: 'translateX(-50%) translateY(-2px)'
                  }}
                />
              </div>
            </div>
            
            <div className="text-center text-sm font-semibold text-blue-600">
              {characteristic.value}%
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
} 