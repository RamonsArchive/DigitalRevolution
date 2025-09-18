"use client";
import React, { useState, useContext } from "react";
import { createContext } from "react";

// Shop-specific types (for your context)
//   export interface ShopFilters {
//     category: ProductCategory | "all";
//     priceRange: { min: number; max: number };
//     colors: string[];
//     sizes: string[];
//     brands: string[];
//     sortBy: "price-asc" | "price-desc" | "name" | "newest" | "popular";
//     searchQuery: string;
//     inStockOnly: boolean;
//   }

type VariantOptionsType = {
  color: string;
  size: string;
  brand: string;
  sortBy: string;
  searchQuery: string;
  inStockOnly: boolean;
  setColor: (color: string) => void;
  setSize: (size: string) => void;
  setBrand: (brand: string) => void;
  setSortBy: (sortBy: string) => void;
  setSearchQuery: (searchQuery: string) => void;
  setInStockOnly: (inStockOnly: boolean) => void;
};

export const FilterOptionsContext = createContext<VariantOptionsType>({
  color: "",
  size: "",
  brand: "",
  sortBy: "",
  searchQuery: "",
  inStockOnly: false,
  setColor: () => {},
  setSize: () => {},
  setBrand: () => {},
  setSortBy: () => {},
  setSearchQuery: () => {},
  setInStockOnly: () => {},
});

const ShopContext = ({ children }: { children: React.ReactNode }) => {
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <FilterOptionsContext.Provider
      value={{
        color,
        size,
        brand,
        sortBy,
        searchQuery,
        inStockOnly,
        setColor,
        setSize,
        setBrand,
        setSortBy,
        setSearchQuery,
        setInStockOnly,
      }}
    >
      {children}
    </FilterOptionsContext.Provider>
  );
};

export const useFilterOptions = () => {
  const context = useContext(FilterOptionsContext);
  if (!context) {
    throw new Error(
      "useFilterOptions must be used within a FilterOptionsProvider"
    );
  }
  return context;
};

export default ShopContext;
