import React from "react";
import ShopNav from "@/components/ShopNav";
import { getProductsAndFilters } from "@/lib/actions";
import ShopProvider from "@/contexts/ShopContext";

const layout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const result = await getProductsAndFilters({ limit: 100, offset: 0 });

    console.log(result.data.allProducts[10]);
    console.log(result.data.filters);
    if (result.status === "ERROR") {
      console.error("Failed to fetch products:", result.error);
      // Provide fallback empty filters
      const emptyFilters = {
        colors: [],
        sizes: [],
        brands: [],
        productTypes: [],
        priceRange: [0, 100] as [number, number],
      };

      return (
        <ShopProvider availableFilters={emptyFilters} allProducts={[]}>
          <ShopNav />
          {children}
        </ShopProvider>
      );
    }

    return (
      <ShopProvider
        availableFilters={result.data.filters}
        allProducts={result.data.allProducts}
      >
        <ShopNav />
        {children}
      </ShopProvider>
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Provide fallback empty filters
    const emptyFilters = {
      colors: [],
      sizes: [],
      brands: [],
      productTypes: [],
      priceRange: [0, 100] as [number, number],
    };

    return (
      <ShopProvider availableFilters={emptyFilters} allProducts={[]}>
        <ShopNav />
        {children}
      </ShopProvider>
    );
  }
};

export default layout;
