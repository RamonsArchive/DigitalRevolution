import React from "react";
import ShopNav from "@/components/ShopNav";
import { getProductsAndFilters, fetchAllProductDetails } from "@/lib/actions";
import ShopProvider from "@/contexts/ShopContext";

// Component for background data fetching
const BackgroundDataFetcher = async ({
  allProducts,
}: {
  allProducts: any[];
}) => {
  try {
    // This runs in the background without blocking the page load
    const detailsResult = await fetchAllProductDetails(allProducts);
    console.log(detailsResult);
    const productDetailsMap =
      detailsResult.status === "SUCCESS" ? detailsResult.data : new Map();

    // Convert back to Map if it's a plain object
    const finalMap =
      productDetailsMap instanceof Map
        ? productDetailsMap
        : new Map(Object.entries(productDetailsMap));

    // In a real implementation, you might want to store this in a global cache
    // or update the context dynamically. For now, we'll just log success.
    console.log(
      "Background product details loaded:",
      finalMap.size,
      "variants"
    );

    return finalMap;
  } catch (error) {
    console.error("Background data fetching failed:", error);
    return new Map();
  }
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const result = await getProductsAndFilters({ limit: 100, offset: 0 });

    console.log(result.data.allProducts[3]);
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
        <ShopProvider
          availableFilters={emptyFilters}
          allProducts={[]}
          productDetailsMap={new Map()}
        >
          <ShopNav />
          {children}
        </ShopProvider>
      );
    }

    // Fetch product details in the background
    const productDetailsResult = await BackgroundDataFetcher({
      allProducts: result.data.allProducts,
    });

    // Convert back to Map if it's a plain object
    const productDetailsMap =
      productDetailsResult instanceof Map
        ? productDetailsResult
        : new Map(Object.entries(productDetailsResult));

    return (
      <ShopProvider
        availableFilters={result.data.filters}
        allProducts={result.data.allProducts}
        productDetailsMap={productDetailsMap}
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
      <ShopProvider
        availableFilters={emptyFilters}
        allProducts={[]}
        productDetailsMap={new Map()}
      >
        <ShopNav />
        {children}
      </ShopProvider>
    );
  }
};

export default layout;
