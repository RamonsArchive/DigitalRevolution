"use client";
import { PrintfulProduct } from "@/lib/globalTypes";
import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

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
    async (
      product: PrintfulProduct,
      variantIndex: number,
      quantity: number
    ) => {
      try {
        // const result = await addToCartAction(product, variantIndex, quantity);
        const result = {
          status: "SUCCESS",
          error: null,
          data: null,
        };
        if (result.status === "ERROR") {
          toast.error("ERROR", {
            description: result.error as unknown as string,
          });
          return;
        }
        toast.success("SUCCESS", { description: "Added to cart" });
        // revlaidate cart items
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("ERROR", { description: error as string });
      }
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
