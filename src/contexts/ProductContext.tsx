"use client";
import { PrintfulProduct } from "@/lib/globalTypes";
import React, { createContext, useContext, useState } from "react";
import { CartItem } from "../../../../../../prisma/generated/prisma";

interface ProductContextType {
  selectedProduct: PrintfulProduct | null;
  selectedVariantIndex: number;
  selectedImageIndex: number;
  setSelectedProduct: (product: PrintfulProduct | null) => void;
  setSelectedVariantIndex: (index: number) => void;
  setSelectedImageIndex: (index: number) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
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

  return (
    <ProductContext.Provider
      value={{
        selectedProduct,
        selectedVariantIndex,
        selectedImageIndex,
        setSelectedProduct,
        setSelectedVariantIndex,
        setSelectedImageIndex,
        cartItems,
        setCartItems,
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
