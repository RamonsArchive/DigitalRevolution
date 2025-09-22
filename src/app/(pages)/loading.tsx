"use client";
import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-50">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-800 to-primary-900 opacity-20 animate-pulse"></div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo with animation */}
        <div className="relative w-[300px] h-[120px] animate-bounce">
          <Image
            src="/Assets/Logos/lightDRLogo.svg"
            alt="DR Logo"
            width={300}
            height={120}
            className="w-full h-full object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 animate-pulse">
            Loading...
          </h2>
          <p className="text-white/60 text-sm md:text-base">
            Preparing your experience
          </p>
        </div>

        {/* Animated loading spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin border-t-white/60"></div>
          {/* Inner ring */}
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent rounded-full animate-spin border-t-primary-400"></div>
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"></div>
        </div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
