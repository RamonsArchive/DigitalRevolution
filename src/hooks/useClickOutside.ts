import { useCallback, useEffect, useRef } from "react";

interface UseClickOutsideOptions {
  insideRef: React.RefObject<HTMLElement | null>;
  outsideRef: React.RefObject<HTMLElement | SVGSVGElement | null>;
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

    const target = event.target as Node;
    const clickedInside = insideRef.current?.contains(target);
    const clickedOutside = outsideRef.current?.contains(target);
    console.log(clickedInside, clickedOutside);

    if(clickedOutside && !currentState) {
      onInsideClick();
    } else if (clickedOutside && currentState) {
      onOutsideClick();
    } else if (!clickedInside && !clickedOutside && currentState) {
      onOutsideClick();
    }
  }, [enabled, onOutsideClick, onInsideClick, insideRef, outsideRef, currentState]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside, enabled]);
};
