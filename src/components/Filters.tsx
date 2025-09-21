import React from "react";
import { useShopFilters } from "@/contexts/ShopContext";
import { ChevronDown, ChevronRight, Square, Check } from "lucide-react";

// Helper to format category names for display
const formatCategoryName = (key: string): string => {
  const nameMap: Record<string, string> = {
    colors: "Colors",
    sizes: "Sizes",
    brands: "Brands",
    productTypes: "Product Types",
  };
  return nameMap[key] || key;
};

const Filters = () => {
  const {
    filterUIState,
    toggleCategoryExpanded,
    toggleOptionSelected,
    clearFilters,
  } = useShopFilters();

  return (
    <div className="flex flex-col gap-4 w-full overflow-y-auto min-h-0">
      {Object.entries(filterUIState).map(([categoryKey, categoryData]) => (
        <div key={categoryKey} className="flex flex-col">
          {/* Category Header */}
          <button
            onClick={() =>
              toggleCategoryExpanded(categoryKey as keyof typeof filterUIState)
            }
            className="flex items-center justify-between px-5 py-3 text-left hover:bg-white/5 rounded-lg transition-colors"
          >
            <h3 className="text-lg font-semibold text-white/80">
              {formatCategoryName(categoryKey)}
            </h3>
            <div className="flex items-center gap-2">
              {/* Show count of selected options */}
              {categoryData.options.filter(
                (opt: { selected: boolean }) => opt.selected
              ).length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {
                    categoryData.options.filter(
                      (opt: { selected: boolean }) => opt.selected
                    ).length
                  }
                </span>
              )}
              {categoryData.categoryExpanded ? (
                <ChevronDown className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/60" />
              )}
            </div>
          </button>

          {/* Category Options - Animated dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              categoryData.categoryExpanded
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {categoryData.options.map(
                (option: { value: string; selected: boolean }) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      toggleOptionSelected(
                        categoryKey as keyof typeof filterUIState,
                        option.value
                      )
                    }
                    className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-md transition-colors text-left"
                  >
                    <div className="relative flex-shrink-0">
                      <Square
                        className={`w-4 h-4 ${
                          option.selected ? "text-blue-500" : "text-white/40"
                        }`}
                      />
                      {option.selected && (
                        <Check className="w-4 h-4 absolute top-0 left-0 text-blue-500" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        option.selected ? "text-white" : "text-white/60"
                      }`}
                    >
                      {option.value}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="mt-4 p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default Filters;
