"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { quickSearches } from "@/constants";
import { useShopFilters } from "@/contexts/ShopContext";
const ShopSearch = ({
  className,
  searchRefInner,
  searchRefOuter,
  openSearch,
  setOpenSearch,
}: {
  className: string;
  searchRefInner: React.RefObject<HTMLDivElement | null>;
  searchRefOuter: React.RefObject<HTMLDivElement | null>;
  openSearch: boolean;
  setOpenSearch: (open: boolean) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleOptionSelected } = useShopFilters();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    toggleOptionSelected("searchQuery", searchQuery);
    setOpenSearch(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {/* Expanded Search Overlay */}
      <div
        ref={searchRefInner}
        className={`${className} ${
          openSearch
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-full pointer-events-none"
        } transition-all duration-500 ease-out`}
        style={{ zIndex: 9999 }}
      >
        {/* Beautiful Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-800 to-primary-900"></div>

        {/* Backdrop to prevent clicks through */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Header with Close Button */}
          <div className="flex w-full justify-between items-center p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">Search Products</h2>
            <button
              onClick={() => setOpenSearch(false)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out hover:scale-110 group"
            >
              <X className="w-6 h-6 text-white group-hover:text-red-300 transition-colors duration-300" />
            </button>
          </div>

          {/* Search Form */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative flex flex-col items-center w-full">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, categories, or keywords..."
                    className="w-full pl-14 pr-16 py-4 text-lg bg-slate-100 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all duration-300 placeholder-gray-400 text-gray-800"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="mt-4 bg-gradient-to-r from-tertiary-500 to-tertiary-600 text-white py-2 px-6 rounded-xl font-semibold text-sm hover:from-tertiary-600 hover:to-tertiary-700 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Search Products
                </button>
              </div>
            </form>

            {/* Quick Searches */}
            <div className="mt-8 w-full max-w-2xl">
              <h3 className="text-white text-lg font-semibold mb-4 text-center">
                Quick Searches
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {quickSearches.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() =>
                      toggleOptionSelected("searchQuery", filter.value)
                    }
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Stats */}
            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
                Search through our collection of premium products
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSearch;
