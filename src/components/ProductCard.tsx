import { PrintfulProduct } from "@/lib/globalTypes";
import React from "react";
import Link from "next/link";
import Image from "next/image";
const ProductCard = ({ product }: { product: PrintfulProduct }) => {
  return (
    <Link href={`/shop/${product.sync_product.id}`}>
      <div className="flex flex-col rounded-xl overflow-hidden">
        <div className="relative w-full h-[60%]">
          <Image
            src={product.sync_product.thumbnail_url}
            alt={product.sync_product.name}
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col p-5">
          <h1 className="font-courier-prime text-2xl font-bold">
            {product.sync_product.name}
          </h1>
          <p className="font-courier-prime text-sm text-gray-500">
            {product.sync_product.name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
