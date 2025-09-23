"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { updateCartItemQuantity, removeCartItem } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-300 mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                      {item.variantName}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                      {item.sku && <span>SKU: {item.sku}</span>}
                    </div>
                  </div>

                  {/* Price and Controls */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xl font-bold text-slate-300 mb-4">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mb-4">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1 || isUpdating === item.id}
                      >
                        <Minus className="w-4 h-4 text-slate-300" />
                      </button>

                      <span className="w-12 text-center text-slate-300 font-medium">
                        {isUpdating === item.id ? (
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUpdating === item.id}
                      >
                        <Plus className="w-4 h-4 text-slate-300" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isUpdating === item.id}
                    >
                      {isUpdating === item.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 sticky top-8">
              <h2 className="text-xl font-bold text-slate-300 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {subtotal < 5000 && (
                  <div className="text-sm text-slate-500">
                    Add {formatPrice(5000 - subtotal)} more for free shipping
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold text-slate-300">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  🔒 Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageClient;
