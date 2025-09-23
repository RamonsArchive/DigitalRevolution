"use client";
import { useShopFilters } from "@/contexts/ShopContext";
import { PrintfulProduct } from "@/lib/globalTypes";
import React, { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ShopTitleSection from "@/components/ShopTitleSection";
import SideBarFilters from "@/components/SideBarFilters";
import Filters from "@/components/Filters";

const ShopPage = () => {
  const { filteredProducts } = useShopFilters();

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col gap-5 w-full">
        <ShopTitleSection />
        <div className="flex gap-5 px-5 md:px-10">
          {/* Fixed Filters Sidebar - Desktop Only */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-40 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Filters />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
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

export default ShopPage;
