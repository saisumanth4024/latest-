import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  maxRating?: number;
  className?: string;
}

export function Ratings({
  value = 0,
  onChange,
  size = 'md',
  readOnly = false,
  maxRating = 5,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverValue(index);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null);
    }
  };
  
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const filled = (hoverValue !== null ? i <= hoverValue : i <= value);
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            'cursor-pointer transition-colors',
            filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600',
            !readOnly && 'cursor-pointer hover:text-yellow-400'
          )}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5',
        className
      )}
      role="radiogroup"
      aria-label="Rating"
    >
      {renderStars()}
    </div>
  );
}