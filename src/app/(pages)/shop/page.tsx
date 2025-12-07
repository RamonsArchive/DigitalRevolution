import React from "react";

import { getProductsAndFilters } from "@/lib/actions";

import ShopHomeClient from "@/components/ShopHomeClient";

const ShopPage = async () => {
  const result = await getProductsAndFilters({ limit: 100, offset: 0 });
  console.log("Result in shop", result);

  if (result.status === "ERROR") {
    return (
      <div className="flex items-center justify-center text-center text-2xl font-bold w-full h-full">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <ShopHomeClient
      initialProducts={result.data.allProducts}
      initialFilters={result.data.filters}
    />
  );
};

export default ShopPage;
