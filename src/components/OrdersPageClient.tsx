"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Order, OrderItem, Address } from "../../prisma/generated/prisma";
import { formatDate } from "@/lib/utils";

type OrderWithRelations = Order & {
  items: OrderItem[];
  address: Address | null;
};

interface OrdersPageClientProps {
  orders: OrderWithRelations[];
}

const OrdersPageClient = ({ orders }: OrdersPageClientProps) => {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-emerald-300 bg-emerald-900/30 border-emerald-700/50";
      case "shipped":
        return "text-blue-300 bg-blue-900/30 border-blue-700/50";
      case "processing":
        return "text-yellow-300 bg-yellow-900/30 border-yellow-700/50";
      case "pending":
        return "text-orange-300 bg-orange-900/30 border-orange-700/50";
      case "cancelled":
        return "text-red-300 bg-red-900/30 border-red-700/50";
      case "refunded":
        return "text-purple-300 bg-purple-900/30 border-purple-700/50";
      default:
        return "text-slate-300 bg-slate-900/30 border-slate-700/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      case "processing":
        return <Package className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      case "refunded":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getOrderImages = (items: OrderItem[]) => {
    return items
      .map((item: OrderItem) => {
        if (
          item.images &&
          typeof item.images === "object" &&
          "images" in item.images
        ) {
          const imagesArray = (item.images as any).images;
          if (Array.isArray(imagesArray) && imagesArray.length > 0) {
            return imagesArray[0];
          }
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 3);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-500/30 shadow-2xl">
              <div className="w-20 h-20 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-300 mb-4">
                No Orders Yet
              </h1>
              <p className="text-slate-400 text-lg mb-8">
                You haven't placed any orders yet. Start shopping to see your
                orders here!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <div className="relative h-[30%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-primary-900 to-slate-900"></div>
        <div className="relative flex items-center justify-center py-16 md:py-24 h-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
              Your Orders
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Track your orders and view order history
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 h-full pb-20">
        <section className="px-6 md:px-12 -mt-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {orders.map((order) => {
                const orderImages = getOrderImages(order.items);
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      {/* Order Header */}
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-100">
                                  Order {order.orderNumber}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                  Placed on {formatDate(order.createdAt)}
                                </p>
                              </div>
                            </div>

                            {/* Order Images Preview */}
                            {orderImages.length > 0 && (
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-slate-400 text-sm font-medium">
                                  Items:
                                </span>
                                <div className="flex -space-x-2">
                                  {orderImages.map((image, idx) => (
                                    <div
                                      key={idx}
                                      className="w-8 h-8 rounded-full border-2 border-slate-700 overflow-hidden"
                                    >
                                      <Image
                                        src={image}
                                        alt={`Order item ${idx + 1}`}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {order.items.length > 3 && (
                                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 bg-slate-700 flex items-center justify-center">
                                      <span className="text-xs text-slate-300">
                                        +{order.items.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Order Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-slate-400 font-medium mb-1">
                                  Total
                                </p>
                                <p className="text-slate-200 font-bold text-lg">
                                  {formatPrice(order.amountTotal)}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-400 font-medium mb-1">
                                  Items
                                </p>
                                <p className="text-slate-200 font-semibold">
                                  {order.items.length}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-400 font-medium mb-1">
                                  Status
                                </p>
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}
                                >
                                  {getStatusIcon(order.status)}
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                              </div>
                              <div>
                                <p className="text-slate-400 font-medium mb-1">
                                  Payment
                                </p>
                                <p className="text-slate-200 font-semibold capitalize">
                                  {order.currency.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() =>
                                setExpandedOrder(isExpanded ? null : order.id)
                              }
                              className="px-6 py-3 bg-slate-700/50 text-slate-200 font-semibold rounded-xl hover:bg-slate-600/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              {isExpanded ? "Hide Details" : "View Details"}
                            </button>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Track Order
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-700/50 p-6 md:p-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Order Items */}
                            <div>
                              <h4 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order Items
                              </h4>
                              <div className="space-y-4">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="bg-slate-700/50 rounded-xl p-4"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="w-16 h-16 bg-slate-600/50 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.images &&
                                        typeof item.images === "object" &&
                                        "images" in item.images ? (
                                          <Image
                                            src={
                                              (item.images as any)
                                                .images?.[0] ||
                                              "/placeholder.jpg"
                                            }
                                            alt={item.productName}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-slate-600 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-slate-400" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h5 className="font-semibold text-slate-100 mb-1 truncate">
                                          {item.productName}
                                        </h5>
                                        <p className="text-slate-300 text-sm mb-2">
                                          {item.variantName}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                          <span className="text-slate-400">
                                            Size:{" "}
                                            <span className="text-slate-200">
                                              {item.variantSize}
                                            </span>
                                          </span>
                                          <span className="text-slate-400">
                                            Color:{" "}
                                            <span className="text-slate-200">
                                              {item.variantColor}
                                            </span>
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="text-slate-400 text-sm">
                                            Qty: {item.quantity}
                                          </span>
                                          <span className="font-bold text-slate-100">
                                            {formatPrice(item.totalPrice)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Details */}
                            <div>
                              <h4 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Order Details
                              </h4>
                              <div className="space-y-4">
                                {/* Shipping Address */}
                                {order.address && (
                                  <div className="bg-slate-700/50 rounded-xl p-4">
                                    <h5 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      Shipping Address
                                    </h5>
                                    <p className="text-slate-300 text-sm">
                                      {order.address.firstName}{" "}
                                      {order.address.lastName}
                                      {order.address.company && (
                                        <>
                                          <br />
                                          {order.address.company}
                                        </>
                                      )}
                                      <br />
                                      {order.address.line1}
                                      {order.address.line2 && (
                                        <>
                                          <br />
                                          {order.address.line2}
                                        </>
                                      )}
                                      <br />
                                      {order.address.city},{" "}
                                      {order.address.state}{" "}
                                      {order.address.postalCode}
                                      <br />
                                      {order.address.country}
                                    </p>
                                  </div>
                                )}

                                {/* Order Totals */}
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                  <h5 className="font-semibold text-slate-100 mb-3">
                                    Order Summary
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">
                                        Subtotal:
                                      </span>
                                      <span className="text-slate-200">
                                        {formatPrice(order.subtotal)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">
                                        Shipping:
                                      </span>
                                      <span className="text-slate-200">
                                        {formatPrice(order.shippingCost)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">
                                        Tax:
                                      </span>
                                      <span className="text-slate-200">
                                        {formatPrice(order.taxAmount)}
                                      </span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">
                                          Discount:
                                        </span>
                                        <span className="text-emerald-300">
                                          -{formatPrice(order.discountAmount)}
                                        </span>
                                      </div>
                                    )}
                                    <div className="border-t border-slate-600 pt-2 flex justify-between font-bold">
                                      <span className="text-slate-100">
                                        Total:
                                      </span>
                                      <span className="text-slate-100">
                                        {formatPrice(order.amountTotal)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Tracking Info */}
                                {order.trackingNumber && (
                                  <div className="bg-slate-700/50 rounded-xl p-4">
                                    <h5 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                                      <Truck className="w-4 h-4" />
                                      Tracking Information
                                    </h5>
                                    <p className="text-slate-300 text-sm">
                                      Tracking Number:{" "}
                                      <span className="font-mono">
                                        {order.trackingNumber}
                                      </span>
                                    </p>
                                    {order.carrier && (
                                      <p className="text-slate-300 text-sm">
                                        Carrier: {order.carrier}
                                      </p>
                                    )}
                                    {order.estimatedDelivery && (
                                      <p className="text-slate-300 text-sm">
                                        Estimated Delivery:{" "}
                                        {order.estimatedDelivery}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrdersPageClient;
