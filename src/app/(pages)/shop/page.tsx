"use client";
import { useShopFilters } from "@/contexts/ShopContext";
import { PrintfulProduct } from "@/lib/globalTypes";
import React, { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ShopTitleSection from "@/components/ShopTitleSection";

const ShopPage = () => {
  const { filteredProducts } = useShopFilters();

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

export default ShopPage;
