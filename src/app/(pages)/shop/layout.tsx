import React from "react";
import ShopNav from "@/components/ShopNav";
import ShopContext from "@/contexts/ShopContext";
import { getProductsAndFilters } from "@/lib/actions";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const { products, filters } = await getProductsAndFilters();
  return (
    <>
      <ShopContext>
        <ShopNav />
        {children}
      </ShopContext>
    </>
  );
};

export default layout;
