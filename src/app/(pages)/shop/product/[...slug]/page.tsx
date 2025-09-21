"use client";
import { useShopFilters } from "@/contexts/ShopContext";
import { getProductBySlug } from "@/lib/utils";
import React from "react";
import Image from "next/image";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  const slug = (await params).slug.pop() || "";
  console.log("slug", slug);
  const { allProducts } = useShopFilters();

  const product = await getProductBySlug(slug, allProducts);
  return (
    <section className="flex flex-col p-5 md:p-10 gap-10">
      <div className="flex flex-col md:flex-row gap-10 md:gap-5 w-full h-full">
        <div className="flex flex-row w-[60%] h-full">
          {/* in mobile have the image from the file varinat defualt be shonw and then be able to swipe if there are more images then have the button to see the rest */}
          {/* on desktop have the images to a column on teh left of the main big image that if you hover it shows on the main like in the figma design */}
        </div>
        <div className="flex flex-1 h-full">
          {/* Title price descripton if any and selection of variants along with detials beofre that with purhcase and add to cart button keep these without logic for now though the buttons*/}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
