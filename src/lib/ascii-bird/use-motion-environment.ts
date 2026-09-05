'use client';

import { useEffect, useState } from 'react';

export function useMotionEnvironment() {
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [motionReduced, setMotionReduced] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionPreference() {
      setMotionReduced(reducedMotion.matches);
    }

    function handleVisibilityChange() {
      setIsPageVisible(!document.hidden);
    }

    handleMotionPreference();
    handleVisibilityChange();

    reducedMotion.addEventListener('change', handleMotionPreference);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      reducedMotion.removeEventListener('change', handleMotionPreference);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isPageVisible, motionReduced };
}
