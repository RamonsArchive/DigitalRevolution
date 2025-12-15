"use client";

import React, { useState } from "react";
import { useShopFilters } from "@/contexts/ShopContext";
import { PrintfulProduct } from "@/lib/globalTypes";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ShopTitleSection from "@/components/ShopTitleSection";
import { Suspense } from "react";

const ShopPageClient = () => {
  const { filteredProducts } = useShopFilters();
  const [isLoading] = useState(true);
  const [error] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 w-full h-[150dvh] overflow-y-auto pb-10 py-10">
        <ShopTitleSection />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 p-3 md:p-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-10 w-full h-[150dvh] overflow-y-auto pb-10 py-10">
        <ShopTitleSection />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-300 mb-4">
              Failed to load products
            </h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-slate-900/80 border border-primary-500/40 text-primary-50 shadow-[0_10px_28px_rgba(0,212,255,0.2)] hover:shadow-[0_14px_36px_rgba(0,212,255,0.28)] transition-all duration-300 hover:scale-[1.02]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full h-[150dvh] overflow-y-auto pb-10 py-10">
      <ShopTitleSection />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 p-3 md:p-10">
        {filteredProducts.map((product: PrintfulProduct) => (
          <Suspense
            key={product.sync_product.id}
            fallback={<ProductCardSkeleton />}
          >
            <ProductCard product={product} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default ShopPageClient;
