"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Users,
  Globe,
  ArrowLeft,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Subscription } from "../../prisma/generated/prisma";
import { formatDate } from "@/lib/utils";

interface SubscriptionSuccessClientProps {
  subscription: Subscription | null;
  error?: string;
}

const SubscriptionSuccessClient = ({
  subscription,
  error,
}: SubscriptionSuccessClientProps) => {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getNextBillingDate = (currentPeriodEnd: Date | null) => {
    if (!currentPeriodEnd) return "Not available";
    return formatDate(currentPeriodEnd);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-300 bg-emerald-900/30 border-emerald-700/50";
      case "trialing":
        return "text-blue-300 bg-blue-900/30 border-blue-700/50";
      case "past_due":
        return "text-yellow-300 bg-yellow-900/30 border-yellow-700/50";
      case "canceled":
        return "text-red-300 bg-red-900/30 border-red-700/50";
      default:
        return "text-slate-300 bg-slate-900/30 border-slate-700/50";
    }
  };

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-red-500/30 shadow-2xl">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-red-300 mb-4">
                Subscription Not Found
              </h1>
              <p className="text-slate-300 text-lg mb-8">
                We couldn&apos;t find your subscription details. Please contact
                support if you believe this is an error.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Donate
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
      <div className="relative h-[40%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-primary-900 to-slate-900"></div>
        <div className="relative flex items-center justify-center py-20 md:py-32 h-full">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <RefreshCw className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
              Welcome to Our Community!
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Thank you for joining our monthly supporters! Your recurring
              donation helps us create lasting change in digital equity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 h-full pb-20">
        {/* Subscription Details Card */}
        <section className="px-6 md:px-12 -mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-purple-500/30 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                    Subscription Active
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Monthly Amount */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💰</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">
                      Monthly Amount
                    </h3>
                    <p className="text-4xl font-bold text-purple-300">
                      {formatPrice(subscription.amount)}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      {subscription.currency.toUpperCase()}
                    </p>
                  </div>

                  {/* Billing Interval */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔄</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">
                      Billing Cycle
                    </h3>
                    <p className="text-2xl font-bold text-pink-300 capitalize">
                      {subscription.interval}ly
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      Recurring {subscription.interval}ly payments
                    </p>
                  </div>
                </div>

                {/* Subscription Information */}
                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <h3 className="text-xl font-bold text-slate-100 mb-6 text-center">
                    Subscription Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Status
                      </p>
                      <p
                        className={`font-semibold capitalize px-3 py-1 rounded-full text-sm border ${getStatusColor(subscription.status)}`}
                      >
                        {subscription.status.replace("_", " ")}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Next Billing Date
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {getNextBillingDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Subscription Type
                      </p>
                      <p className="text-slate-200 font-semibold capitalize">
                        {subscription.subscriptionType}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Started
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {formatDate(subscription.createdAt)}
                      </p>
                    </div>
                  </div>

                  {subscription.cancelAtPeriodEnd && (
                    <div className="mt-6 bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4">
                      <p className="text-yellow-300 text-sm font-medium mb-1">
                        ⚠️ Subscription Ending
                      </p>
                      <p className="text-yellow-200 text-sm">
                        Your subscription will end on{" "}
                        {getNextBillingDate(subscription.currentPeriodEnd)}.
                        You&apos;ll continue to have access until then.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                Monthly Supporter Benefits
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-purple-200 transition-colors">
                      Consistent Impact
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Your monthly support provides predictable funding for our
                      programs, allowing us to plan long-term initiatives.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-pink-200 transition-colors">
                      Community Access
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Join our exclusive community of monthly supporters with
                      special updates and behind-the-scenes content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-purple-200 transition-colors">
                      Sustainable Growth
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Help us scale our impact sustainably and reach more
                      communities with your ongoing support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Management Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-purple-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Manage Your Subscription
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto mb-8">
                  You can manage your subscription, update payment methods, or
                  cancel anytime from your profile page. We&apos;ll send you
                  email reminders before each billing cycle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/profile"
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Manage Subscription
                  </Link>
                  <Link
                    href="/about"
                    className="px-8 py-4 bg-slate-700/50 text-slate-200 font-bold rounded-xl hover:bg-slate-600/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubscriptionSuccessClient;
