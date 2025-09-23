"use client";
import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ShopFilters,
  PrintfulProduct,
  ProductDetails,
} from "@/lib/globalTypes";
import { extractGenderFromProduct } from "@/lib/utils";

// URL parameter keys - keep these short to avoid long URLs
const URL_KEYS = {
  category: "cat", // Added category filter
  colors: "c",
  sizes: "s",
  brands: "b",
  productTypes: "t",
  sortBy: "sort",
  searchQuery: "q",
  inStockOnly: "stock",
  priceMin: "pmin",
  priceMax: "pmax",
  // We DON'T sync category expansions - those are UI state only
} as const;

interface FilterOption {
  value: string;
  selected: boolean;
}

interface FilterCategory {
  categoryExpanded: boolean;
  options: FilterOption[];
}

interface FilterUIState {
  category: FilterCategory;
  colors: FilterCategory;
  sizes: FilterCategory;
  brands: FilterCategory;
  productTypes: FilterCategory;
  searchQuery: FilterCategory; // Add search as a special filter category
}

interface ShopContextType {
  // Filter state
  selectedCategory: string;
  selectedColors: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  selectedTypes: string[];
  sortBy: "price-asc" | "price-desc" | "name" | "newest";
  searchQuery: string;
  inStockOnly: boolean;
  priceRange: [number, number];

  // Computed data
  availableFilters: ShopFilters;
  filterUIState: FilterUIState;
  allProducts: PrintfulProduct[];
  filteredProducts: PrintfulProduct[];
  productDetailsMap: Map<number, ProductDetails>;

  // Actions
  setSelectedCategory: (category: string) => void;
  setSelectedColors: (colors: string[]) => void;
  setSelectedSizes: (sizes: string[]) => void;
  setSelectedBrands: (brands: string[]) => void;
  setSelectedTypes: (types: string[]) => void;
  setSortBy: (sortBy: "price-asc" | "price-desc" | "name" | "newest") => void;
  setSearchQuery: (query: string) => void;
  setInStockOnly: (inStock: boolean) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleCategoryExpanded: (category: keyof FilterUIState) => void;
  toggleOptionSelected: (category: keyof FilterUIState, option: string) => void;
  clearFilters: () => void;
}

const ShopContext = createContext<ShopContextType | null>(null);

interface ShopProviderProps {
  children: React.ReactNode;
  allProducts: PrintfulProduct[];
  availableFilters: ShopFilters;
  productDetailsMap: Map<number, ProductDetails>;
}

const ShopProvider = ({
  children,
  allProducts,
  availableFilters,
  productDetailsMap,
}: ShopProviderProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // UI state (not synced to URL)
  const [categoryExpansions, setCategoryExpansions] = useState({
    category: false,
    colors: false,
    sizes: false,
    brands: false,
    productTypes: false,
    searchQuery: false, // For search filter dropdown if needed
  });

  // Parse URL params into filter state - this is the source of truth
  const parseFiltersFromURL = useCallback(() => {
    const category = searchParams.get(URL_KEYS.category) || "";
    const colors =
      searchParams.get(URL_KEYS.colors)?.split(",").filter(Boolean) || [];
    const sizes =
      searchParams.get(URL_KEYS.sizes)?.split(",").filter(Boolean) || [];
    const brands =
      searchParams.get(URL_KEYS.brands)?.split(",").filter(Boolean) || [];
    const types =
      searchParams.get(URL_KEYS.productTypes)?.split(",").filter(Boolean) || [];
    const sortBy = (searchParams.get(URL_KEYS.sortBy) as any) || "name";
    const searchQuery = searchParams.get(URL_KEYS.searchQuery) || "";
    const inStockOnly = searchParams.get(URL_KEYS.inStockOnly) === "true";
    const priceMin = parseInt(
      searchParams.get(URL_KEYS.priceMin) ||
        availableFilters.priceRange[0].toString()
    );
    const priceMax = parseInt(
      searchParams.get(URL_KEYS.priceMax) ||
        availableFilters.priceRange[1].toString()
    );

    return {
      selectedCategory: category,
      selectedColors: colors,
      selectedSizes: sizes,
      selectedBrands: brands,
      selectedTypes: types,
      sortBy,
      searchQuery,
      inStockOnly,
      priceRange: [priceMin, priceMax] as [number, number],
    };
  }, [searchParams, availableFilters]);

  // Get current filter state from URL
  const currentFilters = useMemo(
    () => parseFiltersFromURL(),
    [parseFiltersFromURL]
  );

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: Partial<typeof currentFilters>) => {
      const current = new URLSearchParams(searchParams.toString());

      // Helper to set or delete URL param
      const setParam = (
        key: string,
        value: string | string[] | number | boolean
      ) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            current.set(key, value.join(","));
          } else {
            current.delete(key);
          }
        } else if (typeof value === "boolean") {
          if (value) {
            current.set(key, "true");
          } else {
            current.delete(key);
          }
        } else if (value && value !== "" && value !== "name") {
          // Don't add default values
          current.set(key, value.toString());
        } else {
          current.delete(key);
        }
      };

      // Update URL params
      if (newFilters.selectedCategory !== undefined) {
        setParam(URL_KEYS.category, newFilters.selectedCategory);
      }
      if (newFilters.selectedColors !== undefined) {
        setParam(URL_KEYS.colors, newFilters.selectedColors);
      }
      if (newFilters.selectedSizes !== undefined) {
        setParam(URL_KEYS.sizes, newFilters.selectedSizes);
      }
      if (newFilters.selectedBrands !== undefined) {
        setParam(URL_KEYS.brands, newFilters.selectedBrands);
      }
      if (newFilters.selectedTypes !== undefined) {
        setParam(URL_KEYS.productTypes, newFilters.selectedTypes);
      }
      if (newFilters.sortBy !== undefined) {
        setParam(URL_KEYS.sortBy, newFilters.sortBy);
      }
      if (newFilters.searchQuery !== undefined) {
        setParam(URL_KEYS.searchQuery, newFilters.searchQuery);
      }
      if (newFilters.inStockOnly !== undefined) {
        setParam(URL_KEYS.inStockOnly, newFilters.inStockOnly);
      }
      if (newFilters.priceRange !== undefined) {
        const [min, max] = newFilters.priceRange;
        if (min !== availableFilters.priceRange[0]) {
          setParam(URL_KEYS.priceMin, min);
        } else {
          current.delete(URL_KEYS.priceMin);
        }
        if (max !== availableFilters.priceRange[1]) {
          setParam(URL_KEYS.priceMax, max);
        } else {
          current.delete(URL_KEYS.priceMax);
        }
      }

      // Update URL without page refresh
      router.replace(`/shop?${current.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname, availableFilters]
  );

  // Filter actions that update URL
  const setSelectedCategory = useCallback(
    (category: string) => {
      updateURL({ selectedCategory: category, searchQuery: "" });
    },
    [updateURL]
  );

  const setSelectedColors = useCallback(
    (colors: string[]) => {
      updateURL({ selectedColors: colors });
    },
    [updateURL]
  );

  const setSelectedSizes = useCallback(
    (sizes: string[]) => {
      updateURL({ selectedSizes: sizes });
    },
    [updateURL]
  );

  const setSelectedBrands = useCallback(
    (brands: string[]) => {
      updateURL({ selectedBrands: brands });
    },
    [updateURL]
  );

  const setSelectedTypes = useCallback(
    (types: string[]) => {
      updateURL({ selectedTypes: types });
    },
    [updateURL]
  );

  const setSortBy = useCallback(
    (sortBy: "price-asc" | "price-desc" | "name" | "newest") => {
      updateURL({ sortBy });
    },
    [updateURL]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      if (query.trim()) {
        updateURL({ searchQuery: query, selectedCategory: "" });
      } else {
        updateURL({ searchQuery: query });
      }
    },
    [updateURL]
  );

  const setInStockOnly = useCallback(
    (inStock: boolean) => {
      updateURL({ inStockOnly: inStock });
    },
    [updateURL]
  );

  const setPriceRange = useCallback(
    (range: [number, number]) => {
      updateURL({ priceRange: range });
    },
    [updateURL]
  );

  const toggleCategoryExpanded = useCallback(
    (category: keyof FilterUIState) => {
      setCategoryExpansions((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    },
    []
  );

  const toggleOptionSelected = useCallback(
    (category: keyof FilterUIState, option: string) => {
      const filters = currentFilters;

      switch (category) {
        case "category":
          // Category is single-select (like radio button)
          setSelectedCategory(
            filters.selectedCategory === option ? "" : option
          );
          break;
        case "searchQuery":
          // Special case - just set the search query
          setSearchQuery(option);
          break;
        case "colors":
          const newColors = filters.selectedColors.includes(option)
            ? filters.selectedColors.filter((color) => color !== option)
            : [...filters.selectedColors, option];
          setSelectedColors(newColors);
          break;
        case "sizes":
          const newSizes = filters.selectedSizes.includes(option)
            ? filters.selectedSizes.filter((size) => size !== option)
            : [...filters.selectedSizes, option];
          setSelectedSizes(newSizes);
          break;
        case "brands":
          const newBrands = filters.selectedBrands.includes(option)
            ? filters.selectedBrands.filter((brand) => brand !== option)
            : [...filters.selectedBrands, option];
          setSelectedBrands(newBrands);
          break;
        case "productTypes":
          const newTypes = filters.selectedTypes.includes(option)
            ? filters.selectedTypes.filter((type) => type !== option)
            : [...filters.selectedTypes, option];
          setSelectedTypes(newTypes);
          break;
      }
    },
    [
      currentFilters,
      setSelectedCategory,
      setSelectedColors,
      setSelectedSizes,
      setSelectedBrands,
      setSelectedTypes,
      setSearchQuery,
    ]
  );

  const clearFilters = useCallback(() => {
    // Clear URL completely
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Create filter UI state
  const filterUIState: FilterUIState = useMemo(() => {
    const filters = currentFilters;

    return {
      category: {
        categoryExpanded: categoryExpansions.category,
        options: ["men", "women", "kids", "unisex"].map((cat) => ({
          value: cat,
          selected: filters.selectedCategory === cat, // Single select for category
        })),
      },
      colors: {
        categoryExpanded: categoryExpansions.colors,
        options: availableFilters.colors.map((color) => ({
          value: color,
          selected: filters.selectedColors.includes(color),
        })),
      },
      sizes: {
        categoryExpanded: categoryExpansions.sizes,
        options: availableFilters.sizes.map((size) => ({
          value: size,
          selected: filters.selectedSizes.includes(size),
        })),
      },
      brands: {
        categoryExpanded: categoryExpansions.brands,
        options: availableFilters.brands.map((brand) => ({
          value: brand,
          selected: filters.selectedBrands.includes(brand),
        })),
      },
      productTypes: {
        categoryExpanded: categoryExpansions.productTypes,
        options: availableFilters.productTypes.map((type) => ({
          value: type,
          selected: filters.selectedTypes.includes(type),
        })),
      },
      searchQuery: {
        categoryExpanded: categoryExpansions.searchQuery,
        options: [
          {
            value: filters.searchQuery,
            selected: filters.searchQuery !== "",
          },
        ],
      },
    };
  }, [availableFilters, categoryExpansions, currentFilters]);

  // Filter and sort products based on current filters
  const filteredProducts = useMemo(() => {
    const filters = currentFilters;

    let filtered = allProducts.filter((product) => {
      // Filter by category/gender first
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const productName = product.sync_product.name.toLowerCase();
        const baseProductName =
          product.sync_variants[0]?.product?.name?.toLowerCase() || "";

        if (!productName.includes(query) && !baseProductName.includes(query)) {
          return false;
        }
        // When searching, skip category filter - show all matching results
      } else if (filters.selectedCategory) {
        // Only apply category filter when NOT searching
        const productGender = extractGenderFromProduct(product);
        if (productGender !== filters.selectedCategory) {
          return false;
        }
      }

      // Get product's brand from name
      const productName = product.sync_product.name;
      let productBrand = "Unknown";
      if (productName.includes("Founder's")) {
        productBrand = "Founder's";
      } else if (productName.includes("Xen")) {
        productBrand = "Xen";
      }

      // Filter by brand
      if (
        filters.selectedBrands.length > 0 &&
        !filters.selectedBrands.includes(productBrand)
      ) {
        return false;
      }

      // Filter by product type
      if (filters.selectedTypes.length > 0) {
        const lowerName = productName.toLowerCase();
        let productType = "Other";
        if (lowerName.includes("t-shirt") || lowerName.includes("tee")) {
          productType = "T-Shirt";
        } else if (lowerName.includes("polo")) {
          productType = "Polo Shirt";
        } else if (lowerName.includes("hoodie")) {
          productType = "Hoodie";
        }

        if (!filters.selectedTypes.includes(productType)) {
          return false;
        }
      }

      // Filter variants by color, size, price, stock
      const validVariants = product.sync_variants.filter((variant) => {
        // Stock filter
        if (filters.inStockOnly && variant.availability_status !== "active") {
          return false;
        }

        // Color filter
        if (
          filters.selectedColors.length > 0 &&
          !filters.selectedColors.includes(variant.color)
        ) {
          return false;
        }

        // Size filter
        if (
          filters.selectedSizes.length > 0 &&
          !filters.selectedSizes.includes(variant.size)
        ) {
          return false;
        }

        // Price filter
        const price = parseFloat(variant.retail_price);
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }

        return true;
      });

      // Product must have at least one valid variant
      return validVariants.length > 0;
    });

    // Sort products
    switch (filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => {
          const aMin = Math.min(
            ...a.sync_variants.map((v) => parseFloat(v.retail_price))
          );
          const bMin = Math.min(
            ...b.sync_variants.map((v) => parseFloat(v.retail_price))
          );
          return aMin - bMin;
        });
        break;
      case "price-desc":
        filtered.sort((a, b) => {
          const aMax = Math.max(
            ...a.sync_variants.map((v) => parseFloat(v.retail_price))
          );
          const bMax = Math.max(
            ...b.sync_variants.map((v) => parseFloat(v.retail_price))
          );
          return bMax - aMax;
        });
        break;
      case "name":
        filtered.sort((a, b) =>
          a.sync_product.name.localeCompare(b.sync_product.name)
        );
        break;
      case "newest":
        filtered.sort((a, b) => b.sync_product.id - a.sync_product.id);
        break;
    }

    return filtered;
  }, [allProducts, currentFilters]);

  return (
    <ShopContext.Provider
      value={{
        // Current filter state (from URL)
        ...currentFilters,

        // Data and UI state
        availableFilters,
        filterUIState,
        allProducts,
        filteredProducts,
        productDetailsMap,

        // Actions
        setSelectedCategory,
        setSelectedColors,
        setSelectedSizes,
        setSelectedBrands,
        setSelectedTypes,
        setSortBy,
        setSearchQuery,
        setInStockOnly,
        setPriceRange,
        toggleCategoryExpanded,
        toggleOptionSelected,
        clearFilters,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopFilters = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopFilters must be used within a ShopProvider");
  }
  return context;
};

export default ShopProvider;
