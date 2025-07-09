'use client';

import React, { useRef, useEffect } from 'react';

export interface WineCharacteristics {
  sweetness: number;
  body: number;
  acidity: number;
  tannin: number;
  bitterness: number;
}

interface WineChartProps {
  characteristics: WineCharacteristics;
  width?: number;
  height?: number;
  className?: string;
  showLabels?: boolean;
  showValues?: boolean;
}

const WineChart: React.FC<WineChartProps> = ({ 
  characteristics, 
  width = 200, 
  height = 200, 
  className = '',
  showLabels = false,
  showValues = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const characteristicLabels = [
    { key: 'sweetness', label: '甘さ', color: '#FF6B6B' },
    { key: 'body', label: '重さ', color: '#4ECDC4' },
    { key: 'acidity', label: '酸味', color: '#45B7D1' },
    { key: 'tannin', label: '渋み', color: '#96CEB4' },
    { key: 'bitterness', label: '苦味', color: '#FFEAA7' }
  ];

  const getPointPosition = (index: number, value: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const angle = (index * 2 * Math.PI) / characteristicLabels.length - Math.PI / 2;
    const pointRadius = (radius * value) / 100;
    
    return {
      x: centerX + pointRadius * Math.cos(angle),
      y: centerY + pointRadius * Math.sin(angle),
      angle,
      radius
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Draw background circles (fewer for smaller charts)
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    const circleCount = width < 150 ? 3 : 5;
    for (let i = 1; i <= circleCount; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / circleCount, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    characteristicLabels.forEach((_, index) => {
      const angle = (index * 2 * Math.PI) / characteristicLabels.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Draw data polygon
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    characteristicLabels.forEach((char, index) => {
      const value = characteristics[char.key as keyof WineCharacteristics];
      const { x, y } = getPointPosition(index, value);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw data points
    characteristicLabels.forEach((char, index) => {
      const value = characteristics[char.key as keyof WineCharacteristics];
      const { x, y } = getPointPosition(index, value);
      
      ctx.fillStyle = char.color;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw value labels if enabled
      if (showValues) {
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${value}`, x, y - 8);
      }
    });

    // Draw characteristic labels if enabled
    if (showLabels) {
      characteristicLabels.forEach((char, index) => {
        const angle = (index * 2 * Math.PI) / characteristicLabels.length - Math.PI / 2;
        const labelRadius = radius + 20;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        
        ctx.fillStyle = '#6B7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char.label, x, y);
      });
    }

  }, [characteristics, width, height, showLabels, showValues, characteristicLabels, getPointPosition]);

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default WineChart; 