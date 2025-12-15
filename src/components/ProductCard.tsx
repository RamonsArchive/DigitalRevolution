import { PrintfulProduct } from "@/lib/globalTypes";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }: { product: PrintfulProduct }) => {
  return (
    <Link href={`/shop/product/${product.sync_product.external_id}`}>
      <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900/95 border border-slate-800/70 shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2">
        {/* Subtle accent background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/12 via-secondary-500/10 to-primary-500/12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>

        {/* Product Image Container */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={product.sync_product.thumbnail_url}
            alt={product.sync_product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Product Info */}
        <div className="relative flex flex-col p-6 bg-slate-950/80 backdrop-blur-sm">
          <h1 className="font-lexend text-xl font-bold text-slate-100 group-hover:text-primary-200 transition-colors duration-300 line-clamp-2">
            {product.sync_product.name}
          </h1>

          {/* Price - if available */}
          {product.sync_variants?.[0]?.retail_price && (
            <div className="mt-2">
              <span className="text-2xl font-bold text-primary-300">
                ${product.sync_variants[0].retail_price}
              </span>
            </div>
          )}

          {/* View Details indicator - Always visible on mobile, hover on desktop */}
          <div className="mt-2 md:mt-3 flex items-center text-primary-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium">View details</span>
            <svg
              className="w-4 h-4 ml-1 transform md:group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
