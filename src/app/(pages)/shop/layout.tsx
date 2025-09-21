import React, { Suspense } from "react";
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
    const productDetailsMap =
      detailsResult.status === "SUCCESS" ? detailsResult.data : new Map();

    // In a real implementation, you might want to store this in a global cache
    // or update the context dynamically. For now, we'll just log success.
    console.log(
      "Background product details loaded:",
      productDetailsMap.size,
      "variants"
    );

    return productDetailsMap;
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

    // Start background fetching immediately but don't wait for it
    const productDetailsPromise = BackgroundDataFetcher({
      allProducts: result.data.allProducts,
    });

    return (
      <ShopProvider
        availableFilters={result.data.filters}
        allProducts={result.data.allProducts}
        productDetailsMap={new Map()} // Start with empty map, will be populated in background
      >
        <ShopNav />
        {children}
        {/* Background data fetcher - runs without blocking */}
        <Suspense fallback={null}>
          <BackgroundDataFetcher allProducts={result.data.allProducts} />
        </Suspense>
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
