import React from "react";
import ShopNav from "@/components/ShopNav";
import ShopContext from "@/contexts/ShopContext";

const layout = ({ children }: { children: React.ReactNode }) => {
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
