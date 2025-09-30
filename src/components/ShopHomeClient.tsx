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
            <ShopTitleSection />

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
