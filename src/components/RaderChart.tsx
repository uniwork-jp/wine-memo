'use client';

import React, { useRef, useEffect, useState } from 'react';

interface WineCharacteristics {
  甘口: number; // Sweetness (甘口 ←→ 辛口)
  軽い: number; // Body (軽い ←→ 重い)
  酸味が弱い: number; // Acidity (酸味が弱い ←→ 酸味が強い)
  渋みが弱い: number; // Tannin (渋みが弱い ←→ 渋みが強い)
  苦味が少ない: number; // Bitterness (苦味が少ない ←→ 苦味がある)
}

interface RadarChartProps {
  data: WineCharacteristics;
  width?: number;
  height?: number;
  className?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  width = 400, 
  height = 400, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const characteristics = [
    { key: '甘口', label: '甘口 ←→ 辛口', color: '#FF6B6B' },
    { key: '軽い', label: '軽い ←→ 重い', color: '#4ECDC4' },
    { key: '酸味が弱い', label: '酸味が弱い ←→ 酸味が強い', color: '#45B7D1' },
    { key: '渋みが弱い', label: '渋みが弱い ←→ 渋みが強い', color: '#96CEB4' },
    { key: '苦味が少ない', label: '苦味が少ない ←→ 苦味がある', color: '#FFEAA7' }
  ];

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

    // Draw background circles
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    characteristics.forEach((_, index) => {
      const angle = (index * 2 * Math.PI) / characteristics.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Draw data polygon
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    characteristics.forEach((char, index) => {
      const angle = (index * 2 * Math.PI) / characteristics.length - Math.PI / 2;
      const value = data[char.key as keyof WineCharacteristics];
      const pointRadius = (radius * value) / 100;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

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
    characteristics.forEach((char, index) => {
      const angle = (index * 2 * Math.PI) / characteristics.length - Math.PI / 2;
      const value = data[char.key as keyof WineCharacteristics];
      const pointRadius = (radius * value) / 100;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      // Check if mouse is hovering over this point
      const isHovered = hoveredPoint === index;
      
      ctx.fillStyle = isHovered ? '#EF4444' : char.color;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 8 : 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw value label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${value}%`, x, y - 15);
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';

    characteristics.forEach((char, index) => {
      const angle = (index * 2 * Math.PI) / characteristics.length - Math.PI / 2;
      const labelRadius = radius + 30;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);

      // Adjust text position for better readability
      let textX = x;
      let textY = y;
      
      if (angle > Math.PI / 2 && angle < 3 * Math.PI / 2) {
        ctx.textAlign = 'right';
        textX = x - 10;
      } else {
        ctx.textAlign = 'left';
        textX = x + 10;
      }

      if (angle > 0 && angle < Math.PI) {
        textY = y + 5;
      } else {
        textY = y - 5;
      }

      ctx.fillText(char.label, textX, textY);
    });

  }, [data, width, height, hoveredPoint]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Check if mouse is near any data point
    let closestPoint: number | null = null;
    let minDistance = Infinity;

    characteristics.forEach((char, index) => {
      const angle = (index * 2 * Math.PI) / characteristics.length - Math.PI / 2;
      const value = data[char.key as keyof WineCharacteristics];
      const pointRadius = (radius * value) / 100;
      const pointX = centerX + pointRadius * Math.cos(angle);
      const pointY = centerY + pointRadius * Math.sin(angle);

      const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
      if (distance < 20 && distance < minDistance) {
        minDistance = distance;
        closestPoint = index;
      }
    });

    setHoveredPoint(closestPoint);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="border border-gray-200 rounded-lg shadow-sm"
        style={{ cursor: hoveredPoint !== null ? 'pointer' : 'default' }}
      />
      {hoveredPoint !== null && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          <strong>{characteristics[hoveredPoint].label}:</strong> {data[characteristics[hoveredPoint].key as keyof WineCharacteristics]}%
        </div>
      )}
    </div>
  );
};

export default RadarChart;
