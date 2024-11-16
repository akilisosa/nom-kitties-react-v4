// hooks/useGameSize.ts
'use client';
import { useState, useEffect } from 'react';

export function useGameSize() {
  const [gameSize, setGameSize] = useState(600);

  useEffect(() => {
    const calculateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // If screen is smaller than 500px, use 90% of screen width
      if (width < 600) {
        return Math.min(width * 0.9, height * 0.6);
      }
      
      // For larger screens, use 50% of screen width, but no larger than 600px
      return Math.min(width * 0.5, 600, height * 0.7);
    };

    // Set initial size
    setGameSize(calculateSize());

    // Update size on window resize
    const handleResize = () => {
      setGameSize(calculateSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return gameSize;
}
