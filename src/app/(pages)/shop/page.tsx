"use client";
import { shopContext } from "@/contexts/ShopContext";
import { PrintfulProduct } from "@/lib/globalTypes";
import React from "react";
import ProductCard from "@/components/ProductCard";
import { Suspense } from "react";

const ShopPage = () => {
  const { allProducts } = shopContext();
  console.log(allProducts);
  return (
    <div className="flex w-full h-[150dvh] overflow-y-auto">
      {allProducts.map((product: PrintfulProduct) => (
        <Suspense
          key={product.sync_product.id}
          fallback={<div>Loading...</div>}
        >
          <ProductCard product={product} />
        </Suspense>
      ))}
    </div>
  );
};

export default ShopPage;
