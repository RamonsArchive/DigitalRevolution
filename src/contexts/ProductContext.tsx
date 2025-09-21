"use client";
import { PrintfulProduct } from "@/lib/globalTypes";
import React, { createContext, useContext, useState, useCallback } from "react";

interface ProductContextType {
  selectedProduct: PrintfulProduct | null;
  selectedVariantIndex: number;
  selectedImageIndex: number;
  setSelectedProduct: (product: PrintfulProduct | null) => void;
  setSelectedVariantIndex: (index: number) => void;
  setSelectedImageIndex: (index: number) => void;
  addToCart: (
    product: PrintfulProduct,
    variantIndex: number,
    quantity: number
  ) => void;
  cartItems: Array<{
    product: PrintfulProduct;
    variantIndex: number;
    quantity: number;
  }>;
}

export const ProductContext = createContext<ProductContextType | null>(null);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedProduct, setSelectedProduct] =
    useState<PrintfulProduct | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartItems, setCartItems] = useState<
    Array<{
      product: PrintfulProduct;
      variantIndex: number;
      quantity: number;
    }>
  >([]);

  const addToCart = useCallback(
    (product: PrintfulProduct, variantIndex: number, quantity: number) => {
      setCartItems((prev) => {
        const existingItemIndex = prev.findIndex(
          (item) =>
            item.product.sync_product.id === product.sync_product.id &&
            item.variantIndex === variantIndex
        );

        if (existingItemIndex > -1) {
          // Update existing item
          const updated = [...prev];
          updated[existingItemIndex].quantity += quantity;
          return updated;
        } else {
          // Add new item
          return [...prev, { product, variantIndex, quantity }];
        }
      });
    },
    []
  );

  return (
    <ProductContext.Provider
      value={{
        selectedProduct,
        selectedVariantIndex,
        selectedImageIndex,
        setSelectedProduct,
        setSelectedVariantIndex,
        setSelectedImageIndex,
        addToCart,
        cartItems,
      }}
    >
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

export default ProductProvider;
