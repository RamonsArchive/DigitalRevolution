"use client";
import React, { useState, useContext, createContext, useMemo } from "react";
import { ShopFilters, FilterState, PrintfulProduct } from "@/lib/globalTypes";

// Filter UI state structure
interface FilterOption {
  value: string;
  selected: boolean;
}

interface FilterCategory {
  categoryExpanded: boolean;
  options: FilterOption[];
}

interface FilterUIState {
  colors: FilterCategory;
  sizes: FilterCategory;
  brands: FilterCategory;
  productTypes: FilterCategory;
}

interface ShopContextType {
  availableFilters: ShopFilters;
  filterUIState: FilterUIState;
  allProducts: PrintfulProduct[];

  // Multi-select filter state
  selectedColors: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  selectedTypes: string[];
  sortBy: FilterState["sortBy"];
  searchQuery: string;
  inStockOnly: boolean;
  priceRange: [number, number];

  // Selection methods
  setSelectedColors: (colors: string[]) => void;
  setSelectedSizes: (sizes: string[]) => void;
  setSelectedBrands: (brands: string[]) => void;
  setSelectedTypes: (types: string[]) => void;
  setSortBy: (sortBy: FilterState["sortBy"]) => void;
  setSearchQuery: (query: string) => void;
  setInStockOnly: (inStock: boolean) => void;
  setPriceRange: (range: [number, number]) => void;

  // UI state methods
  toggleCategoryExpanded: (category: keyof FilterUIState) => void;
  toggleOptionSelected: (category: keyof FilterUIState, option: string) => void;

  // Utility methods
  clearFilters: () => void;
}

const ShopContext = createContext<ShopContextType | null>(null);

interface ShopProviderProps {
  children: React.ReactNode;
  allProducts: PrintfulProduct[];
  availableFilters: ShopFilters;
}

const ShopProvider = ({
  children,
  allProducts,
  availableFilters,
}: ShopProviderProps) => {
  // Multi-select filter state - using arrays instead of single strings
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<FilterState["sortBy"]>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    availableFilters.priceRange[0],
    availableFilters.priceRange[1],
  ]);

  // UI state for dropdown expansions
  const [categoryExpansions, setCategoryExpansions] = useState({
    colors: false,
    sizes: false,
    brands: false,
    productTypes: false,
  });

  // Create structured filter UI state with useMemo to prevent unnecessary re-renders
  const filterUIState: FilterUIState = useMemo(() => {
    return {
      colors: {
        categoryExpanded: categoryExpansions.colors,
        options: availableFilters.colors.map((color) => ({
          value: color,
          selected: selectedColors.includes(color), // Check if color is in the array
        })),
      },
      sizes: {
        categoryExpanded: categoryExpansions.sizes,
        options: availableFilters.sizes.map((size) => ({
          value: size,
          selected: selectedSizes.includes(size), // Check if size is in the array
        })),
      },
      brands: {
        categoryExpanded: categoryExpansions.brands,
        options: availableFilters.brands.map((brand) => ({
          value: brand,
          selected: selectedBrands.includes(brand), // Check if brand is in the array
        })),
      },
      productTypes: {
        categoryExpanded: categoryExpansions.productTypes,
        options: availableFilters.productTypes.map((type) => ({
          value: type,
          selected: selectedTypes.includes(type), // Check if type is in the array
        })),
      },
    };
  }, [
    availableFilters,
    categoryExpansions,
    selectedColors, // Now arrays instead of single values
    selectedSizes,
    selectedBrands,
    selectedTypes,
  ]);

  const toggleCategoryExpanded = (category: keyof FilterUIState) => {
    setCategoryExpansions((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleOptionSelected = (
    category: keyof FilterUIState,
    option: string
  ) => {
    switch (category) {
      case "colors":
        setSelectedColors(
          (prev) =>
            prev.includes(option)
              ? prev.filter((color) => color !== option) // Remove if already selected
              : [...prev, option] // Add if not selected
        );
        break;
      case "sizes":
        setSelectedSizes((prev) =>
          prev.includes(option)
            ? prev.filter((size) => size !== option)
            : [...prev, option]
        );
        break;
      case "brands":
        setSelectedBrands((prev) =>
          prev.includes(option)
            ? prev.filter((brand) => brand !== option)
            : [...prev, option]
        );
        break;
      case "productTypes":
        setSelectedTypes((prev) =>
          prev.includes(option)
            ? prev.filter((type) => type !== option)
            : [...prev, option]
        );
        break;
    }
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSortBy("name");
    setSearchQuery("");
    setInStockOnly(false);
    setPriceRange([
      availableFilters.priceRange[0],
      availableFilters.priceRange[1],
    ]);

    // Optionally collapse all categories
    setCategoryExpansions({
      colors: false,
      sizes: false,
      brands: false,
      productTypes: false,
    });
  };

  return (
    <ShopContext.Provider
      value={{
        // Current filter state (now arrays)
        selectedColors,
        selectedSizes,
        selectedBrands,
        selectedTypes,
        sortBy,
        searchQuery,
        inStockOnly,
        priceRange,

        // Available options and UI state
        availableFilters,
        filterUIState,
        allProducts,

        // Setters
        setSelectedColors,
        setSelectedSizes,
        setSelectedBrands,
        setSelectedTypes,
        setSortBy,
        setSearchQuery,
        setInStockOnly,
        setPriceRange,

        // UI methods
        toggleCategoryExpanded,
        toggleOptionSelected,
        clearFilters,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const shopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("shopContext must be used within a ShopProvider");
  }
  return context;
};

export default ShopProvider;
