import React from "react";
import Navbar from "@/components/Navbar";
import ShopNav from "@/components/ShopNav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ShopNav />
      {children}
    </>
  );
};

export default layout;
