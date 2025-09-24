"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { updateCartItemQuantity, removeCartItem } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/actions";
interface CartItem {
  id: number;
  printfulVariantId: number;
  printfulProductId: number;
  variantName: string;
  productName: string;
  size: string;
  color: string;
  sku: string | null;
  unitPrice: number;
  quantity: number;
  imageUrl: string | null;
}

interface CartPageClientProps {
  userId: string;
  guestUserId: string;
  cartItems: CartItem[];
}

const CartPageClient = ({
  userId,
  guestUserId,
  cartItems,
}: CartPageClientProps) => {
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const shipping = subtotal > 5000 ? 0 : 999; // Free shipping over $50
  const total = subtotal + tax + shipping;

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(itemId);
    try {
      const result = await updateCartItemQuantity(
        userId,
        guestUserId,
        itemId,
        newQuantity
      );

      if (result.status === "SUCCESS") {
        toast.success("SUCCESS", {
          description: "Quantity updated successfully",
        });
        router.refresh(); // Refresh to get updated data
      } else {
        toast.error("ERROR", { description: "Failed to update quantity" });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setIsUpdating(itemId);
    try {
      const result = await removeCartItem(userId, guestUserId, itemId);

      if (result.status === "SUCCESS") {
        router.refresh(); // Refresh to get updated data
      } else {
        console.error("Failed to remove item:", result.error);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession(userId, guestUserId);
      if (result.status === "ERROR") {
        toast.error("ERROR", { description: result.error });
        return;
      }

      toast.success("SUCCESS", {
        description: "Checkout session created successfully",
      });
      //router.push(`/checkout?session_id=${result.data?.clientSecret}`);
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-300">
              Your cart is empty
            </h1>
            <p className="text-slate-400">
              Looks like you haven't added any items yet.
            </p>
          </div>
          <a
            href="/shop"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-300 mb-2">
            Shopping Cart
          </h1>
          <p className="text-slate-400">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="flex items-start space-x-8">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 bg-gray-700/80 rounded-2xl overflow-hidden shadow-xl border border-gray-600/30">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600/80 flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100 mb-3 leading-tight">
                        {item.variantName}
                      </h3>
                      <p className="text-slate-300 text-lg mb-4 font-medium">
                        {item.productName}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 text-base">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-semibold">
                          Size:
                        </span>
                        <span className="text-slate-200 bg-gray-700/80 px-3 py-2 rounded-lg text-sm font-bold border border-gray-600/50">
                          {item.size}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-semibold">
                          Color:
                        </span>
                        <span className="text-slate-200 bg-gray-700/80 px-3 py-2 rounded-lg text-sm font-bold border border-gray-600/50">
                          {item.color}
                        </span>
                      </div>
                      {item.sku && (
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-semibold">
                            SKU:
                          </span>
                          <span className="text-slate-300 text-sm font-mono bg-gray-800/50 px-2 py-1 rounded-md">
                            {item.sku}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Controls */}
                  <div className="flex-shrink-0 text-right space-y-6">
                    <div className="text-3xl font-bold text-slate-100">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-gray-600/50"
                        disabled={item.quantity <= 1 || isUpdating === item.id}
                      >
                        <Minus className="w-6 h-6 text-slate-200" />
                      </button>

                      <span className="w-20 text-center text-slate-100 font-bold text-xl bg-gray-800/80 px-4 py-3 rounded-xl border border-gray-600/50 shadow-lg">
                        {isUpdating === item.id ? (
                          <div className="w-6 h-6 border-2 border-slate-200 border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-gray-600/50"
                        disabled={isUpdating === item.id}
                      >
                        <Plus className="w-6 h-6 text-slate-200" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-300 hover:text-red-200 text-base flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-red-900/30 hover:bg-red-900/40 px-4 py-3 rounded-xl border border-red-800/50 shadow-lg hover:shadow-xl font-semibold"
                      disabled={isUpdating === item.id}
                    >
                      {isUpdating === item.id ? (
                        <div className="w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                      <span className="font-bold">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/40 sticky top-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-100 mb-8">
                Order Summary
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-300 text-lg font-medium">
                    Subtotal
                  </span>
                  <span className="text-slate-200 text-xl font-bold">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-300 text-lg font-medium">
                    Tax
                  </span>
                  <span className="text-slate-200 text-xl font-bold">
                    {formatPrice(tax)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-300 text-lg font-medium">
                    Shipping
                  </span>
                  <span className="text-xl font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-300">Free</span>
                    ) : (
                      <span className="text-slate-200">
                        {formatPrice(shipping)}
                      </span>
                    )}
                  </span>
                </div>

                {subtotal < 5000 && (
                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center">
                    <p className="text-blue-200 text-sm font-medium">
                      Add {formatPrice(5000 - subtotal)} more for free shipping
                    </p>
                  </div>
                )}

                <div className="border-t-2 border-gray-600/60 pt-6">
                  <div className="flex justify-between items-center py-4 bg-gray-700/40 rounded-xl px-6">
                    <span className="text-slate-100 text-2xl font-bold">
                      Total
                    </span>
                    <span className="text-slate-100 text-3xl font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold py-6 px-8 rounded-2xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl text-xl">
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-4">
                  <p className="text-green-300 text-sm font-semibold flex items-center justify-center gap-2">
                    <span className="text-lg">🔒</span>
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageClient;
