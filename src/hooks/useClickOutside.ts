import { useCallback, useEffect } from "react";

interface UseClickOutsideOptions {
  insideRef: React.RefObject<HTMLElement | null>;
  outsideRef: React.RefObject<HTMLElement | HTMLButtonElement | SVGSVGElement | null> | null;
  currentState: boolean;
  onOutsideClick: () => void;
  onInsideClick: () => void;
  enabled?: boolean;
}

export const useClickOutside = ({
  insideRef,
  outsideRef,
  currentState,
  onOutsideClick,
  onInsideClick,
  enabled = true,
}: UseClickOutsideOptions) => {
  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (!enabled) return;
    
    setTimeout(() => {
      const target = event.target as Node;
      const clickedInside = insideRef.current?.contains(target);
      
      // Check if clicked on outsideRef OR its children
      const clickedOutside = outsideRef?.current?.contains(target) || outsideRef?.current === target;
      
      if(clickedOutside && !currentState) {
        onInsideClick();
      } else if (clickedOutside && currentState) {
        onOutsideClick();
      } else if (!clickedInside && !clickedOutside && currentState) {
        onOutsideClick();
      }
    }, 0);
  }, [enabled, onOutsideClick, onInsideClick, insideRef, outsideRef, currentState]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside, enabled, outsideRef, insideRef, currentState]);
};
