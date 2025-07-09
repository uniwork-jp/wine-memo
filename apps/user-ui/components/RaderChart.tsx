'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

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
  onDataChange?: (newData: WineCharacteristics) => void;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  width = 400, 
  height = 400, 
  className = '',
  onDataChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const characteristics = [
    { key: '甘口', label: '甘さ', color: '#FF6B6B' },
    { key: '軽い', label: '重さ', color: '#4ECDC4' },
    { key: '酸味が弱い', label: '酸味', color: '#45B7D1' },
    { key: '渋みが弱い', label: '渋み', color: '#96CEB4' },
    { key: '苦味が少ない', label: '苦味', color: '#FFEAA7' }
  ];

  const getPointPosition = useCallback((index: number, value: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const angle = (index * 2 * Math.PI) / characteristics.length - Math.PI / 2;
    const pointRadius = (radius * value) / 100;
    
    return {
      x: centerX + pointRadius * Math.cos(angle),
      y: centerY + pointRadius * Math.sin(angle),
      angle,
      radius
    };
  }, [width, height, characteristics.length]);

  const getClosestPoint = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    let closestPoint: number | null = null;
    let minDistance = Infinity;

    characteristics.forEach((char, index) => {
      const value = data[char.key as keyof WineCharacteristics];
      const { x: pointX, y: pointY } = getPointPosition(index, value);

      const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
      if (distance < 30 && distance < minDistance) { // Increased touch area
        minDistance = distance;
        closestPoint = index;
      }
    });

    return closestPoint;
  }, [data, width, height, characteristics, getPointPosition]);

  const updateValueFromPosition = useCallback((index: number, clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const angle = (index * 2 * Math.PI) / characteristics.length - Math.PI / 2;

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    
    // Calculate the projected distance along the axis
    const projectedDistance = distanceFromCenter * Math.cos(
      Math.atan2(y - centerY, x - centerX) - angle
    );
    
    // Convert to percentage (0-100)
    let newValue = Math.max(0, Math.min(100, (projectedDistance / radius) * 100));
    
    // Round to nearest integer
    newValue = Math.round(newValue);

    if (onDataChange) {
      const newData = { ...data };
      newData[characteristics[index].key as keyof WineCharacteristics] = newValue;
      onDataChange(newData);
    }
  }, [data, width, height, characteristics, onDataChange]);

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
      const { x, y } = getPointPosition(index, data[char.key as keyof WineCharacteristics]);

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
      const { x, y } = getPointPosition(index, data[char.key as keyof WineCharacteristics]);

      // Check if mouse is hovering over this point
      const isHovered = hoveredPoint === index;
      const isDragged = draggedPoint === index;
      
      ctx.fillStyle = isDragged ? '#EF4444' : (isHovered ? '#F59E0B' : char.color);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = isDragged || isHovered ? 3 : 2;
      ctx.beginPath();
      ctx.arc(x, y, isDragged || isHovered ? 12 : 8, 0, 2 * Math.PI); // Larger touch targets
      ctx.fill();
      ctx.stroke();

      // Draw value label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${data[char.key as keyof WineCharacteristics]}%`, x, y - 20);
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

  }, [data, width, height, hoveredPoint, draggedPoint, getPointPosition]);

  // Mouse event handlers
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && draggedPoint !== null) {
      updateValueFromPosition(draggedPoint, event.clientX, event.clientY);
    } else {
      const closestPoint = getClosestPoint(event.clientX, event.clientY);
      setHoveredPoint(closestPoint);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const closestPoint = getClosestPoint(event.clientX, event.clientY);
    if (closestPoint !== null) {
      setDraggedPoint(closestPoint);
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedPoint(null);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setIsDragging(false);
    setDraggedPoint(null);
  };

  // Touch event handlers
  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const closestPoint = getClosestPoint(touch.clientX, touch.clientY);
      if (closestPoint !== null) {
        setDraggedPoint(closestPoint);
        setIsDragging(true);
        setHoveredPoint(closestPoint);
      }
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging && draggedPoint !== null && event.touches.length === 1) {
      const touch = event.touches[0];
      updateValueFromPosition(draggedPoint, touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    setDraggedPoint(null);
    setHoveredPoint(null);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border border-gray-200 rounded-lg shadow-sm cursor-crosshair select-none"
        style={{ 
          cursor: hoveredPoint !== null ? 'pointer' : 'crosshair',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      />
      {hoveredPoint !== null && !isDragging && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          <strong>{characteristics[hoveredPoint].label}:</strong> {data[characteristics[hoveredPoint].key as keyof WineCharacteristics]}%
        </div>
      )}
      {isDragging && draggedPoint !== null && (
        <div className="mt-2 p-2 bg-blue-100 rounded text-sm">
          <strong>ドラッグ中:</strong> {characteristics[draggedPoint].label}: {data[characteristics[draggedPoint].key as keyof WineCharacteristics]}%
        </div>
      )}
    </div>
  );
};

export default RadarChart;
