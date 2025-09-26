"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Play, Pause } from "lucide-react";
import Image from "next/image";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const imageRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef<HTMLSpanElement[]>([]);
  const dotRef = useRef<HTMLSpanElement[]>([]);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [carousel, setCarousel] = useState({
    currentImage: 0,
    isPlaying: true,
    isLastImage: false,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const { currentImage, isPlaying } = carousel;

  const throttle = useCallback(
    (func: (clientX: number, clientY: number) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      let lastExecTime = 0;
      return function (clientX: number, clientY: number) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
          func(clientX, clientY);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(
            () => {
              func(clientX, clientY);
              lastExecTime = currentTime;
            },
            delay - (currentTime - lastExecTime)
          );
        }
      };
    },
    []
  );

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isPlaying || isDragging) return;
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    interval.current = setInterval(() => {
      setCarousel((prev) => {
        const nextImage = prev.currentImage + 1;
        if (nextImage >= images.length) {
          return { ...prev, currentImage: 0, isLastImage: false };
        }
        return { ...prev, currentImage: nextImage };
      });
    }, 5000);
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [isPlaying, images.length, isDragging]);

  // GSAP animation for active dot progress
  useGSAP(() => {
    if (progressRef.current[currentImage]) {
      gsap.to(progressRef.current[currentImage], {
        clipPath: "circle(50% at center)",
        scale: 1,
        duration: 5,
        ease: "none",
        onComplete: () => {
          gsap.set(progressRef.current[currentImage], {
            clipPath: "circle(0% at center)",
            scale: 0,
          });
        },
      });
    }
  }, [currentImage]);

  const handlePlayPause = () => {
    setCarousel((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const resetInterval = useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    if (isPlaying) {
      interval.current = setInterval(() => {
        setCarousel((prev) => {
          const nextImage = prev.currentImage + 1;
          if (nextImage >= images.length) {
            return { ...prev, currentImage: 0 };
          }
          return { ...prev, currentImage: nextImage };
        });
      }, 5000);
    }
  }, [isPlaying, images.length]);

  const handleImageSelect = (index: number) => {
    setCarousel((prev) => ({ ...prev, currentImage: index }));
    resetInterval();
  };

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
    setCurrentX(clientX);
    setDragOffset(0);
    if (interval.current) clearInterval(interval.current);
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      const minHorizontalMovement = 20;
      const maxVerticalMovement = 30;
      if (
        Math.abs(deltaX) < minHorizontalMovement ||
        Math.abs(deltaY) > maxVerticalMovement
      )
        return;
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const imageWidth = containerWidth / images.length;
      const maxDragDistance = imageWidth * 0.8;
      const clampedDeltaX = Math.max(
        -maxDragDistance,
        Math.min(maxDragDistance, deltaX)
      );
      const offsetPercent = (clampedDeltaX / imageWidth) * 100;
      setDragOffset(offsetPercent);
      setCurrentX(clientX);
    },
    [isDragging, startX, startY, images.length]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const imageWidth = containerWidth / images.length;
    const threshold = imageWidth * 0.3;
    if (Math.abs(currentX - startX) > threshold) {
      if (currentX < startX) {
        const nextImage = (currentImage + 1) % images.length;
        setCarousel((prev) => ({ ...prev, currentImage: nextImage }));
      } else {
        const prevImage =
          currentImage === 0 ? images.length - 1 : currentImage - 1;
        setCarousel((prev) => ({ ...prev, currentImage: prevImage }));
      }
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
      setTimeout(() => resetInterval(), 0);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
      setTimeout(() => resetInterval(), 0);
    }
    setDragOffset(0);
  }, [
    isDragging,
    currentX,
    startX,
    currentImage,
    images.length,
    resetInterval,
  ]);

  const getTransformStyle = useMemo(() => {
    const baseTransform = (-100 * currentImage) / images.length;
    const dragTransform = dragOffset / images.length;
    return `translateX(${baseTransform + dragTransform}%)`;
  }, [currentImage, dragOffset, images.length]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onMouseDown={(e) => {
          e.preventDefault();
          handleStart(e.clientX, e.clientY);
        }}
        onMouseMove={(e) => {
          if (isDragging) throttle(handleMove, 16)(e.clientX, e.clientY);
        }}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          const t = e.touches[0];
          handleStart(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          if (isDragging) {
            const t = e.touches[0];
            throttle(handleMove, 16)(t.clientX, t.clientY);
          }
        }}
        onTouchEnd={handleEnd}
      >
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out"
          style={{
            width: `${images.length * 100}%`,
            transform: getTransformStyle,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0"
              style={{ width: `${100 / images.length}%` }}
            >
              <div className="w-full h-full flex-center overflow-hidden bg-black relative">
                <Image
                  src={image}
                  alt={`about image ${index + 1}`}
                  width={2000}
                  height={1300}
                  sizes="90vw"
                  priority
                  loading="eager"
                  ref={(el) => {
                    if (el) imageRef.current[index] = el;
                  }}
                  className="w-full h-full max-h-[650px] object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-row w-full max-w-md items-center gap-5">
          <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            {images.map((_, index) => (
              <span
                key={index}
                ref={(el) => {
                  if (el) dotRef.current[index] = el;
                }}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 relative ${index === currentImage ? "bg-white" : "bg-white/40"}`}
                onClick={() => handleImageSelect(index)}
              >
                <span
                  ref={(el) => {
                    if (el) progressRef.current[index] = el;
                  }}
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${index === currentImage ? "bg-primary-400" : "bg-transparent"}`}
                  style={{
                    clipPath:
                      index === currentImage
                        ? "circle(0% at center)"
                        : "circle(0% at center)",
                    transform: "scale(0)",
                  }}
                />
              </span>
            ))}
          </div>
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
