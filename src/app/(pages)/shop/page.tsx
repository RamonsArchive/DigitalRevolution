import React from "react";

import { getProductsAndFilters } from "@/lib/actions";

import ShopHomeClient from "@/components/ShopHomeClient";

const ShopPage = async () => {
  const result = await getProductsAndFilters({ limit: 100, offset: 0 });
  console.log(result);

  if (result.status === "ERROR") {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-center text-2xl font-bold">
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
