import React from "react";
import ShopNav from "@/components/ShopNav";
import ShopContext from "@/contexts/ShopContext";
import { getProductsAndFilters } from "@/lib/actions";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const result = await getProductsAndFilters({ limit: 100, offset: 0 });
  console.log(result);
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
