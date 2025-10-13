"use client";

import { useEffect, useState } from "react";
import { getOrderByStripeSessionId } from "@/lib/actions";
import Link from "next/link";

interface Order {
  orderNumber: string;
  customerEmail: string;
  amountTotal: number;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingAddress: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
}

interface SuccessPageClientProps {
  sessionId: string;
}

const SuccessPageClient = ({
  // Changed from SuccessPageClient to SuccessPageClientClient
  sessionId,
}: SuccessPageClientProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 10; // Try for about 30 seconds (3s intervals)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await getOrderByStripeSessionId(sessionId);

        if (result.status === "SUCCESS" && result.data) {
          setOrder(result.data);
          setLoading(false);
        } else if (retryCount < maxRetries - 1) {
          // Order not found yet, retry after delay
          setRetryCount((prev) => prev + 1);
          setTimeout(fetchOrder, 3000); // Wait 3 seconds before retry
        } else {
          // Max retries reached
          setError(
            "Order not found. Please check your email for confirmation or contact support."
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        if (retryCount < maxRetries - 1) {
          setRetryCount((prev) => prev + 1);
          setTimeout(fetchOrder, 3000);
        } else {
          setError("Failed to load order details. Please contact support.");
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [sessionId, retryCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 rounded-2xl p-8 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-6"></div>
            <h1 className="text-3xl font-bold text-slate-100 mb-4">
              Processing Your Order...
            </h1>
            <p className="text-slate-300 text-lg mb-4">
              Please wait while we prepare your order details.
            </p>
            <p className="text-sm text-slate-400">
              Attempt {retryCount + 1} of {maxRetries}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-red-300 mb-4">
              Order Processing Error
            </h1>
            <p className="text-red-200 text-lg mb-4">{error}</p>
            <p className="text-sm text-red-400 mb-6">Session ID: {sessionId}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-2xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-yellow-300 mb-4">
              Order Not Found
            </h1>
            <p className="text-yellow-200 text-lg">
              We couldn&apos;t find your order details, but your payment was
              processed successfully. Please check your email for confirmation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-8 mb-8 shadow-xl">
          <h1 className="text-4xl font-bold text-green-300 mb-4 text-center">
            Payment Successful! 🎉
          </h1>
          <p className="text-green-200 text-xl text-center">
            Your order has been confirmed and is being processed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">
            Order Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <p className="text-slate-300">
                <span className="font-semibold text-slate-200">
                  Order Number:
                </span>{" "}
                {order.orderNumber}
              </p>
              {order.customerEmail && (
                <p className="text-slate-300">
                  <span className="font-semibold text-slate-200">Email:</span>{" "}
                  {order.customerEmail}
                </p>
              )}
              <p className="text-slate-300">
                <span className="font-semibold text-slate-200">Total:</span> $
                {(order.amountTotal / 100).toFixed(2)}
              </p>
              <p className="text-slate-300">
                <span className="font-semibold text-slate-200">Status:</span>{" "}
                <span className="capitalize text-green-400">
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-100 mb-4">
            Items Ordered:
          </h3>
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-700/40 rounded-xl p-4 border border-gray-600/30"
              >
                <div>
                  <p className="font-semibold text-slate-100">
                    {item.productName}
                  </p>
                  <p className="text-slate-300">
                    {item.variantName} - Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-slate-100 text-lg">
                  ${(item.totalPrice / 100).toFixed(2)}
                </p>
              </div>
            )) || <p className="text-slate-400">Loading items...</p>}
          </div>

          {order.shippingAddress && (
            <div className="mt-8 p-6 bg-gray-700/40 rounded-xl border border-gray-600/30">
              <h4 className="font-bold text-slate-100 mb-4 text-lg">
                Shipping Address:
              </h4>
              <div className="text-slate-300 space-y-1">
                <p>
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-6">
              You&apos;ll receive an email confirmation shortly with tracking
              information.
            </p>
            <Link
              href="/shop"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPageClient;
