import React from "react";
import ShopNav from "@/components/ShopNav";
import ShopProvider from "@/contexts/ShopContext";
import ProductProvider from "@/contexts/ProductContext";

const layout = async ({ children }: { children: React.ReactNode }) => {
  // pass empty filters and all products
  try {
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
        <ProductProvider>
          <ShopNav />
          {children}
        </ProductProvider>
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
        <ProductProvider>
          <ShopNav />
          {children}
        </ProductProvider>
      </ShopProvider>
    );
  }
};

export default layout;
