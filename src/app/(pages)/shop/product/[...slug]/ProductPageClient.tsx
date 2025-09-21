"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { PrintfulProduct } from "@/lib/globalTypes";
import { useGSAP } from "@gsap/react";
import { useProduct } from "@/contexts/ProductContext";
import gsap from "gsap";

interface ProductImage {
  url: string;
  variantId: number;
  color: string;
  size: string;
}

interface ProductPageClientProps {
  product: PrintfulProduct;
}

const ProductPageClient = ({ product }: ProductPageClientProps) => {
  const {
    selectedVariantIndex,
    setSelectedVariantIndex,
    selectedImageIndex,
    setSelectedImageIndex,
    addToCart,
    cartItems,
  } = useProduct();

  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Aggregate all product images from variants
  const productImages: ProductImage[] = useMemo(() => {
    const images: ProductImage[] = [];

    product.sync_variants.forEach((variant) => {
      // Get the preview image from files array (index 1 as mentioned)
      const previewFile = variant.files?.[1];
      if (previewFile?.preview_url) {
        images.push({
          url: previewFile.preview_url,
          variantId: variant.id,
          color: variant.color,
          size: variant.size,
        });
      }
    });

    // Remove duplicates based on URL
    const uniqueImages = images.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.url === image.url)
    );

    return uniqueImages;
  }, [product.sync_variants]);

  // Get current variant
  const currentVariant = product.sync_variants[selectedVariantIndex];
  const currentImage = productImages[selectedImageIndex];

  // GSAP animations for image transitions
  useGSAP(() => {
    if (mainImageRef.current && isImageTransitioning) {
      gsap.fromTo(
        mainImageRef.current,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => setIsImageTransitioning(false),
        }
      );
    }
  }, [selectedImageIndex, isImageTransitioning]);

  // Handle image selection
  const handleImageSelect = (index: number) => {
    if (index !== selectedImageIndex && !isImageTransitioning) {
      setIsImageTransitioning(true);
      setSelectedImageIndex(index);
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex);
    // Find corresponding image for this variant
    const variantImageIndex = productImages.findIndex(
      (img) => img.variantId === product.sync_variants[variantIndex].id
    );
    if (variantImageIndex !== -1) {
      handleImageSelect(variantImageIndex);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, selectedVariantIndex, quantity);
    // Show success feedback (you can add a toast notification here)
    console.log(`Added ${quantity} ${product.sync_product.name} to cart`);
  };

  // Mobile swipe handling
  const handleSwipe = (direction: "left" | "right") => {
    if (isImageTransitioning) return;

    if (direction === "left" && selectedImageIndex < productImages.length - 1) {
      handleImageSelect(selectedImageIndex + 1);
    } else if (direction === "right" && selectedImageIndex > 0) {
      handleImageSelect(selectedImageIndex - 1);
    }
  };

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleSwipe("left");
    } else if (isRightSwipe) {
      handleSwipe("right");
    }
  };

  // Get unique colors and sizes for variant selection
  const availableColors = useMemo(() => {
    const colors = [...new Set(product.sync_variants.map((v) => v.color))];
    return colors;
  }, [product.sync_variants]);

  const availableSizes = useMemo(() => {
    const sizes = [...new Set(product.sync_variants.map((v) => v.size))];
    return sizes;
  }, [product.sync_variants]);

  return (
    <section className="flex flex-col p-5 md:p-10 gap-10 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10 w-full">
        {/* Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-[60%]">
          {/* Thumbnail Images - Desktop Only */}
          <div className="hidden lg:flex flex-col gap-2 w-20">
            {productImages.map((image, index) => (
              <div
                key={index}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                className={`relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                  selectedImageIndex === index
                    ? "border-primary-500 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleImageSelect(index)}
              >
                <Image
                  src={image.url}
                  alt={`${product.sync_product.name} - ${image.color}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div
            className="relative w-full aspect-square lg:flex-1 rounded-2xl overflow-hidden bg-gray-100"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div ref={mainImageRef} className="relative w-full h-full">
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={`${product.sync_product.name} - ${currentImage.color}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                />
              )}
            </div>

            {/* Mobile Swipe Indicators */}
            <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedImageIndex === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Mobile Swipe Areas */}
            <div className="lg:hidden absolute inset-0 flex">
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={() => handleSwipe("right")}
              />
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={() => handleSwipe("left")}
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6 w-full lg:w-[40%]">
          {/* Title and Price */}
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-courier-prime">
              {product.sync_product.name}
            </h1>
            {currentVariant?.retail_price && (
              <div className="text-2xl font-bold text-primary-600">
                ${currentVariant.retail_price}
              </div>
            )}
          </div>

          {/* Variant Selection */}
          <div className="space-y-4">
            {/* Color Selection */}
            {availableColors.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Color
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => {
                    const variantIndex = product.sync_variants.findIndex(
                      (v) => v.color === color
                    );
                    return (
                      <button
                        key={color}
                        onClick={() => handleVariantSelect(variantIndex)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                          product.sync_variants[selectedVariantIndex].color ===
                          color
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => {
                    const variantIndex = product.sync_variants.findIndex(
                      (v) => v.size === size
                    );
                    return (
                      <button
                        key={size}
                        onClick={() => handleVariantSelect(variantIndex)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                          product.sync_variants[selectedVariantIndex].size ===
                          size
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Add to Cart ({cartItems.length})
            </button>
            <button className="flex-1 bg-gradient-to-r from-tertiary-500 to-tertiary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-tertiary-600 hover:to-tertiary-700 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl">
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Product Details
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Product ID:</span>{" "}
                {product.sync_product.id}
              </p>
              <p>
                <span className="font-medium">Variants:</span>{" "}
                {product.sync_product.variants}
              </p>
              <p>
                <span className="font-medium">Synced:</span>{" "}
                {product.sync_product.synced}
              </p>
              {currentVariant && (
                <>
                  <p>
                    <span className="font-medium">Color:</span>{" "}
                    {currentVariant.color}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span>{" "}
                    {currentVariant.size}
                  </p>
                  <p>
                    <span className="font-medium">Availability:</span>{" "}
                    {currentVariant.availability_status}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPageClient;
