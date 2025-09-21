"use client";
import { PrintfulSyncProduct, PrintfulSyncVariant } from "@/lib/globalTypes";
import React, { createContext, useContext, useMemo } from "react";

export interface PrintfulProduct {
  sync_product: PrintfulSyncProduct;
  sync_variants: PrintfulSyncVariant;
}

export const ProductContext = createContext<PrintfulProduct | null>(null);
const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const productSelected: PrintfulProduct = useMemo(() => {
    return {
      sync_product: productSelected.sync_product,
      sync_variants: productSelected.sync_variants,
    };
  }, []);

  return (
    <ProductContext.Provider value={productSelected}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export default ProductContext;
