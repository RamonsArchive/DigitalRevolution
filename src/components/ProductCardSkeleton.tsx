import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg">
      {/* Image skeleton */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_200%] animate-shimmer overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer-slide"></div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col p-6 space-y-3">
        {/* Title skeleton */}
        <div className="relative h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_200%] animate-shimmer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer-slide"></div>
        </div>

        {/* Price skeleton */}
        <div className="relative h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_200%] animate-shimmer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer-slide"></div>
        </div>

        {/* Button skeleton */}
        <div className="relative h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_200%] animate-shimmer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer-slide"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
