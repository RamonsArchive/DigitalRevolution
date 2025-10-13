"use client";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useShopFilters } from "@/contexts/ShopContext";

const ShopTitleSection = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const { filteredProducts, allProducts } = useShopFilters();

  const getCategory = useCallback(() => {
    const category = searchParams.get("cat");
    const query = searchParams.get("q");

    if (query) {
      setTitle(`Search results for: ${query}`);
    } else if (category) {
      setTitle(`Results for: ${category}`);
    } else {
      setTitle("All products");
    }
  }, [searchParams]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  return (
    <div className="flex flex-col px-5 md:px-0 bg-bg-primary pt-10 pb-3 md:pb-10">
      <h1 className="font-courier-prime text-4xl font-bold">{title}</h1>
      <p className="text-sm text-slate-400">
        {filteredProducts.length} out of {allProducts.length} products found
      </p>
    </div>
  );
};

export default ShopTitleSection;
