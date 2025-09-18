import { useCallback, useEffect } from "react";

interface UseScrollThrottleOptions {
  onScroll: () => void;
  enabled?: boolean;
}

export const useScrollThrottle = ({
  onScroll,
  enabled = true,
}: UseScrollThrottleOptions) => {
  useEffect(() => {
    if (!enabled) return;

    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [onScroll, enabled]);
};
