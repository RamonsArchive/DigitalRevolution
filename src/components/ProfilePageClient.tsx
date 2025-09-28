"use client";

import { PROFILE_DATA } from "@/constants";
import React, { useState } from "react";
import TitleSection from "./TitleSection";
import { Subscription } from "../../prisma/generated/prisma";
import { z } from "zod";
import { cancelSubscription } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const cancelSubscriptionSchema = z.object({
  reason: z.string().min(5, "Please provide a reason (at least 5 characters)"),
});

const ProfilePageClient = ({
  profileData,
  subscriptions,
}: {
  profileData: typeof PROFILE_DATA;
  subscriptions: Subscription[];
}) => {
  const [cancellingSubscription, setCancellingSubscription] = useState<
    number | null
  >(null);
  const [cancelReason, setCancelReason] = useState("");
  const [errors, setErrors] = useState<{ reason?: string }>({});
  const [showCancelForm, setShowCancelForm] = useState<number | null>(null);
  const router = useRouter();
  const handleCancelSubscription = async (subscriptionId: number) => {
    setErrors({});

    try {
      // Validate form data
      const formData = { reason: cancelReason };
      await cancelSubscriptionSchema.parseAsync(formData);

      // TODO: Call your backend function to cancel subscription
      const result = await cancelSubscription(subscriptionId, cancelReason);
      console.log("result", result);

      if (result.status === "ERROR") {
        toast.error("ERROR", { description: result.error });
        return;
      }

      toast.success("SUCCESS", {
        description: "Subscription cancelled successfully",
      });

      // Reset form
      setCancelReason("");
      setShowCancelForm(null);
      setCancellingSubscription(null);
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = z.flattenError(error).fieldErrors as Record<
          string,
          string[]
        >;
        const formattedErrors: Record<string, string> = {};
        Object.keys(fieldErrors).forEach((key) => {
          formattedErrors[key] = fieldErrors[key]?.[0] || "";
        });
        setErrors(formattedErrors);
      }
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-900/30 border-green-700/50";
      case "canceled":
        return "text-red-400 bg-red-900/30 border-red-700/50";
      case "past_due":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-700/50";
      default:
        return "text-slate-400 bg-slate-900/30 border-slate-700/50";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      <TitleSection
        title={profileData.text.mainTitle}
        titleClassName="font-courier-prime text-6xl md:text-8xl font-bold text-center"
        containerClassName="flex items-center justify-center py-20 md:py-32 h-full"
      />
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary h-full">
        {/* Profile Overview */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    Your Profile
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto">
                  Manage your account settings, view your subscription details,
                  and track your support for our mission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subscriptions Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Your Subscriptions
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>

            {subscriptions.length === 0 ? (
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-100 mb-3">
                    No Active Subscriptions
                  </h4>
                  <p className="text-slate-300 mb-6">
                    You don't have any active subscriptions yet.
                  </p>
                  <a
                    href="/donate"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105"
                  >
                    Start Supporting Our Mission
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Subscription Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                              <span className="text-xl">🔄</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-slate-100">
                                Monthly Donation
                              </h4>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(subscription.status)}`}
                                >
                                  {subscription.status.charAt(0).toUpperCase() +
                                    subscription.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400 font-medium mb-1">
                                Amount
                              </p>
                              <p className="text-slate-200 font-bold text-lg">
                                {formatPrice(subscription.amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-medium mb-1">
                                Interval
                              </p>
                              <p className="text-slate-200 capitalize">
                                {subscription.interval}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-medium mb-1">
                                Next Billing
                              </p>
                              <p className="text-slate-200">
                                {formatDate(subscription.currentPeriodEnd)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          {subscription.status === "active" && (
                            <button
                              onClick={() =>
                                setShowCancelForm(
                                  showCancelForm === subscription.id
                                    ? null
                                    : subscription.id
                                )
                              }
                              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              Cancel Subscription
                            </button>
                          )}

                          {subscription.cancelAtPeriodEnd && (
                            <div className="px-4 py-2 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 text-sm text-center">
                              Cancels on{" "}
                              {formatDate(subscription.currentPeriodEnd)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cancel Form */}
                      {showCancelForm === subscription.id && (
                        <div className="mt-6 pt-6 border-t border-slate-700/50">
                          <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl blur opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
                              <h5 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                                <span className="text-xl mr-2">⚠️</span>
                                Cancel Subscription
                              </h5>
                              <p className="text-slate-300 text-sm mb-4">
                                We're sorry to see you go! Please let us know
                                why you're cancelling so we can improve our
                                service.
                              </p>

                              <div className="mb-4">
                                <label className="block text-slate-200 font-semibold text-sm mb-2">
                                  Reason for Cancellation{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  value={cancelReason}
                                  onChange={(e) =>
                                    setCancelReason(e.target.value)
                                  }
                                  placeholder="Please tell us why you're cancelling..."
                                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 resize-none"
                                  rows={4}
                                  required
                                />
                                {errors.reason && (
                                  <p className="text-red-400 text-sm font-medium mt-1">
                                    {errors.reason}
                                  </p>
                                )}
                              </div>

                              <div className="flex gap-3">
                                <button
                                  onClick={() =>
                                    handleCancelSubscription(subscription.id)
                                  }
                                  disabled={
                                    cancellingSubscription === subscription.id
                                  }
                                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                  {cancellingSubscription ===
                                  subscription.id ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      <span>Cancelling...</span>
                                    </div>
                                  ) : (
                                    "Confirm Cancellation"
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    setShowCancelForm(null);
                                    setCancelReason("");
                                    setErrors({});
                                  }}
                                  className="px-6 py-3 bg-slate-700/50 text-slate-200 font-semibold rounded-xl hover:bg-slate-600/50 transition-all duration-300"
                                >
                                  Keep Subscription
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Account Information */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-secondary-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
                    Account Settings
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto mb-6">
                  Manage your account preferences and personal information.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Edit Profile
                  </button>
                  <button className="px-8 py-4 bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-bold rounded-xl hover:from-secondary-600 hover:to-primary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePageClient;
