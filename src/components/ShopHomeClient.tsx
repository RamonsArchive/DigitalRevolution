"use client";
import React, { Suspense } from "react";
import { useShopFilters } from "@/contexts/ShopContext";
import { useEffect } from "react";
import { PrintfulProduct, ShopFilters } from "@/lib/globalTypes";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ShopTitleSection from "@/components/ShopTitleSection";
import Filters from "@/components/Filters";

const ShopHomeClient = ({
  initialProducts,
  initialFilters,
}: {
  initialProducts: PrintfulProduct[];
  initialFilters: ShopFilters;
}) => {
  const { filteredProducts, setAllProducts, setAvailableFilters } =
    useShopFilters();

  // Hydrate context with server data
  useEffect(() => {
    setAllProducts(initialProducts);
    setAvailableFilters(initialFilters);
  }, [initialProducts, initialFilters]);
  return (
    <div className="w-full min-h-screen pb-20">
      <div className="flex gap-5 px-3 md:px-10">
        {/* Fixed Filters Sidebar - Desktop Only */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <div className="sticky top-40 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="flex flex-col gap-10">
              <h1 className="font-courier-prime text-2xl font-bold">Filters</h1>
              <Filters />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-row gap-5 items-center">
              <ShopTitleSection />
              <div className="relative flex flex-row h-fit gap-5 rounded-lg p-3 bg-gradient-to-r from-red-500/90 via-orange-500/90 to-pink-500/90 shadow-lg shadow-red-500/30 backdrop-blur-sm border border-red-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 rounded-lg blur-md opacity-40 -z-10 animate-pulse"></div>
                <p className="font-courier-prime text-sm font-bold text-white drop-shadow-lg">
                  Free Shipping on all orders!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 p-3 md:p-0">
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
        </div>
      </div>
    </div>
  );
};

export default ShopHomeClient;
