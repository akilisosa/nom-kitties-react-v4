// hooks/useScreenSize.ts
'use client';
import { useState, useEffect } from 'react';

export function useScreenSize() {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 500);
    };

    // Check initial size
    checkScreenSize();

    // Update on resize
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isLargeScreen;
}
