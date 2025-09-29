"use client";
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import { PrintfulProduct, PrintfulSyncVariant } from "@/lib/globalTypes";
import { CartItem } from "../../../../../../prisma/generated/prisma";
import { useGSAP } from "@gsap/react";
import { useProduct } from "@/contexts/ProductContext";
import { useShopFilters } from "@/contexts/ShopContext";
import gsap from "gsap";
import { toast } from "sonner";
import { writeToCart } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductImage {
  url: string;
  variantId: number;
  color: string;
  size: string;
}

interface ProductPageClientProps {
  userId: string;
  guestUserId: string;
  slug: string;
  cartItems: CartItem[];
}

const ProductPageClient = ({
  userId,
  guestUserId,
  cartItems,
  slug,
}: ProductPageClientProps) => {
  const router = useRouter();
  const {
    selectedVariantIndex,
    setSelectedVariantIndex,
    selectedImageIndex,
    setSelectedImageIndex,
    setCartItems,
  } = useProduct();

  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    setCartItems(cartItems);
  }, [cartItems]);

  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Find product from context using slug
  const { allProducts } = useShopFilters();
  const product = allProducts.find(
    (p: PrintfulProduct) => p.sync_product.external_id?.toLowerCase() === slug
  );

  console.log("product", product);

  // State for product details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productDetails, setProductDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch product details on-demand
  useEffect(() => {
    if (product && !productDetails) {
      setIsLoadingDetails(true);
      const firstVariant = product.sync_variants[0];
      if (firstVariant) {
        // Import the function dynamically to avoid server-side issues
        import("@/lib/actions").then(({ getProductDetailsByVariantId }) => {
          console.log("getProductDetailsByVariantId", firstVariant.variant_id);
          getProductDetailsByVariantId(firstVariant.variant_id).then(
            (result) => {
              if (result.status === "SUCCESS") {
                setProductDetails(result.data);
              }
              setIsLoadingDetails(false);
            }
          );
        });
      }
    }
  }, [product, productDetails]);

  // Early return if no product
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-slate-300">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Aggregate all product images from variants
  const productImages: ProductImage[] = useMemo(() => {
    const images: ProductImage[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product.sync_variants.forEach((variant: any) => {
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
    console.log("handleVariantSelect", variantIndex);
    setSelectedVariantIndex(variantIndex);
    // Find corresponding image for this variant
    const variantImageIndex = productImages.findIndex(
      (img) => img.variantId === product.sync_variants[variantIndex].id
    );
    if (variantImageIndex !== -1) {
      handleImageSelect(variantImageIndex);
    }
  };

  // Handle color selection - find first available size for the selected color
  const handleColorSelect = (color: string) => {
    const inStockVariants = product.sync_variants.filter(
      (v: PrintfulSyncVariant) => v.availability_status === "active"
    );
    const colorVariants = inStockVariants.filter(
      (v: PrintfulSyncVariant) => v.color === color
    );

    if (colorVariants.length > 0) {
      // Find the variant index in the original array
      const variantIndex = product.sync_variants.findIndex(
        (v: PrintfulSyncVariant) => v.id === colorVariants[0].id
      );
      handleVariantSelect(variantIndex);
    }
  };

  // Handle size selection - find variant with current color and selected size
  const handleSizeSelect = (size: string) => {
    const inStockVariants = product.sync_variants.filter(
      (v: PrintfulSyncVariant) => v.availability_status === "active"
    );
    const sizeVariant = inStockVariants.find(
      (v: PrintfulSyncVariant) =>
        v.color === currentVariant.color && v.size === size
    );

    if (sizeVariant) {
      // Find the variant index in the original array
      const variantIndex = product.sync_variants.findIndex(
        (v: PrintfulSyncVariant) => v.id === sizeVariant.id
      );
      handleVariantSelect(variantIndex);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(userId, guestUserId, product, selectedVariantIndex, quantity);
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

  // Get unique colors and sizes for variant selection (only in-stock variants)
  const availableColors = useMemo(() => {
    const inStockVariants = product.sync_variants.filter(
      (v: PrintfulSyncVariant) => v.availability_status === "active"
    );
    const colors = [
      ...new Set(inStockVariants.map((v: PrintfulSyncVariant) => v.color)),
    ];
    return colors;
  }, [product.sync_variants]);

  const availableSizes = useMemo(() => {
    const inStockVariants = product.sync_variants.filter(
      (v: PrintfulSyncVariant) => v.availability_status === "active"
    );
    const sizes = [
      ...new Set(inStockVariants.map((v: PrintfulSyncVariant) => v.size)),
    ];
    return sizes;
  }, [product.sync_variants]);

  // Get available sizes for the currently selected color (only in-stock)
  const availableSizesForColor = useMemo(() => {
    const inStockVariants = product.sync_variants.filter(
      (v: PrintfulSyncVariant) => v.availability_status === "active"
    );
    const sizes = [
      ...new Set(
        inStockVariants
          .filter((v: PrintfulSyncVariant) => v.color === currentVariant.color)
          .map((v: PrintfulSyncVariant) => v.size)
      ),
    ];
    return sizes;
  }, [product.sync_variants, currentVariant.color]);

  const addToCart = useCallback(
    async (
      userId: string,
      guestUserId: string,
      product: PrintfulProduct,
      variantIndex: number,
      quantity: number
    ) => {
      try {
        const result = await writeToCart(
          userId,
          guestUserId,
          product,
          variantIndex,
          quantity
        );

        if (result.status === "ERROR") {
          toast.error("ERROR", {
            description: result.error as unknown as string,
          });
          return;
        }
        toast.success("SUCCESS", { description: "Added to cart" });
        // set cart items in context
        router.refresh();

        // revlaidate cart items
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("ERROR", { description: error as string });
      }
    },
    []
  );

  return (
    <section className="flex flex-col p-5 md:p-10 gap-10 min-h-screen pb-20">
      <div className="group relative w-fit">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
        <div className="relative bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <Link
            href="/shop"
            className="flex items-center gap-3 text-slate-200 hover:text-white transition-all duration-300 font-medium"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-sm font-bold leading-none">
                ←
              </span>
            </div>
            <span className="text-base font-semibold">Back to Shop</span>
          </Link>
        </div>
      </div>
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
                    : "border-gray-200 hover:border-gray-300 cursor-pointer hover:bg-gray-400"
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
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-300 font-courier-prime">
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
                <h3 className="text-sm font-medium text-slate-300 mb-2">
                  Color
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color: string) => {
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:bg-gray-400 ${
                          currentVariant.color === color
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300 text-slate-300"
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
            {availableSizesForColor.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">
                  Size
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {availableSizesForColor.map((size: string) => {
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                          currentVariant.size === size
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300 text-slate-300 cursor-pointer hover:bg-gray-400"
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
            <label className="text-sm font-medium text-slate-300">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-400 transition-colors duration-200 rounded-l-lg cursor-pointer"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-400 transition-colors duration-200 rounded-r-lg cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Add to Cart ({cartItems.length})
            </button>
            <button className="flex-1 bg-gradient-to-r from-tertiary-500 to-tertiary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-tertiary-600 hover:to-tertiary-700 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="pt-4 border-t border-gray-200 ">
            <h3 className="text-lg font-semibold text-slate-300 mb-2 underline">
              Product Details
            </h3>
            <div className="space-y-2 text-sm text-slate-200">
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

            {/* Enhanced Product Details from API */}
            {isLoadingDetails && (
              <div className="mt-6">
                <p className="text-sm text-slate-400">
                  Loading product details...
                </p>
              </div>
            )}
            {productDetails && (
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-semibold text-gray-200 underline">
                  Description
                </h4>
                <p className="text-sm text-slate-200 whitespace-pre-line">
                  {productDetails.description}
                </p>

                {productDetails.materials &&
                  productDetails.materials.length > 0 && (
                    <div className="">
                      <h4 className="text-md font-semibold text-slate-300 underline">
                        Materials
                      </h4>
                      <ul className="text-sm text-slate-200 list-disc list-inside ">
                        {productDetails.materials.map(
                          (
                            material: { name: string; percentage: number },
                            index: number
                          ) => (
                            <li key={index}>
                              {material.name} ({material.percentage}%)
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {productDetails.features &&
                  productDetails.features.length > 0 && (
                    <div className="">
                      <h4 className="text-md font-semiboldtext-slate-300 underline">
                        Features
                      </h4>
                      <ul className="text-sm text-slate-200 list-disc list-inside ">
                        {productDetails.features.map(
                          (feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {productDetails.care_instructions && (
                  <div className="">
                    <h4 className="text-md font-semibold text-slate-300 underline">
                      Care Instructions
                    </h4>
                    <p className="text-sm text-slate-200">
                      {productDetails.care_instructions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPageClient;
