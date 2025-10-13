"use client";

import { DONATE_DATA } from "@/constants";
import React from "react";
import TitleSection from "./TitleSection";
import { useState } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { formToDataObject, parseServerActionResponse } from "@/lib/utils";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { verifyDonateForm } from "@/lib/validation";
import { z } from "zod";
import {
  createDonationSession,
  createSubscriptionSession,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
const DonatePageClient = ({
  session,
  donateData,
}: {
  session: Session | null;
  donateData: typeof DONATE_DATA;
}) => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("one-time");
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSetAmount = (amount: number) => {
    setAmount(amount * 100); // convert to cents for stripe
    setSelectedAmount(amount.toString());
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue * 100);
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setCustomAmount("");
    setSelectedAmount("");
    setAmount(0);
    setPaymentMethod("one-time");
    setErrors({});
  };

  const handleDonation = async () => {
    setErrors({});

    // This will be passed to your backend function
    try {
      //verify form data
      const formData = {
        name: name,
        email: email,
      };
      await verifyDonateForm.parseAsync(formData);

      if (paymentMethod === "monthly" && !session?.user) {
        toast.error("ERROR", { description: "Please sign in to donate" });
        await signIn("google", { callbackUrl: "/donate" });
        return parseServerActionResponse({
          status: "ERROR",
          error: "Please sign in to donate monthly",
          data: null,
        });
      }

      const donationData = {
        userId: session?.user?.id,
        amount: amount,
        name: name,
        email: email,
      };

      let result = null;
      if (paymentMethod === "one-time") {
        result = await createDonationSession(donationData);

        // TODO: Call your Stripe integration function here
      } else if (paymentMethod === "monthly") {
        result = await createSubscriptionSession(
          donationData as {
            userId: string;
            amount: number;
            name: string;
            email: string;
          }
        );
        // TODO: Call your Stripe integration function here
      } else {
        toast.error("ERROR", { description: "Invalid payment method" });
        return parseServerActionResponse({
          status: "ERROR",
          error: "Invalid payment method",
          data: null,
        });
      }

      if (result.status === "ERROR") {
        toast.error("ERROR", { description: result.error });
        return parseServerActionResponse({
          status: "ERROR",
          error: result.error,
          data: null,
        });
      }

      router.push(result.data?.url || "/");
      clearForm();
      toast.success("SUCCESS", { description: "Donation successful" });
      return parseServerActionResponse({
        status: "SUCCESS",
        error: "",
        data: null,
      });
      // TODO: Call your Stripe integration function here
    } catch (error) {
      console.error("Error handling donation:", error);
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
        toast.error("ERROR", { description: "Please fill out all fields" });
        return parseServerActionResponse({
          status: "ERROR",
          error: "Please fill out all fields",
          data: null,
        });
      }
      toast.error("ERROR", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      return parseServerActionResponse({
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      <div className="relative h-[33%]">
        <TitleSection
          title={donateData.text.mainTitle}
          titleClassName="font-courier-prime text-6xl md:text-8xl font-bold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 h-full"
        />
      </div>
      {/* Main Content */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary h-full">
        {/* Donation Description */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">💝</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    {donateData.text.subTitle}
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto">
                  {donateData.text.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Breakdown */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {donateData.text.impactTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {donateData.impactBreakdown?.map((impact, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-2xl font-bold text-white">
                          {impact.amount}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
                        {impact.impact}
                      </h4>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs font-medium mb-1">
                          STEM Impact:
                        </p>
                        <p className="text-slate-200 text-xs leading-relaxed">
                          {impact.stemConnection}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Options */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {donateData.text.donationTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {donateData.text.donationOptions?.map((option) => (
                <div key={option.id} className="group relative">
                  <div
                    className={`absolute -inset-1 rounded-3xl blur transition duration-500 ${
                      paymentMethod === option.id
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-40"
                        : "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                  <div
                    className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer ${
                      paymentMethod === option.id
                        ? "border-emerald-500/50 shadow-emerald-500/20"
                        : "border-slate-700/50 group-hover:shadow-2xl"
                    }`}
                    onClick={() => setPaymentMethod(option.id)}
                  >
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition duration-300 ${
                          paymentMethod === option.id
                            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 scale-110"
                            : "bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:scale-110"
                        }`}
                      >
                        <span className="text-2xl">
                          {option.id === "one-time" ? "💳" : "🔄"}
                        </span>
                      </div>
                      <h4
                        className={`text-xl font-bold mb-3 transition-colors ${
                          paymentMethod === option.id
                            ? "text-emerald-200"
                            : "text-slate-100 group-hover:text-primary-200"
                        }`}
                      >
                        {option.title}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        {option.description}
                      </p>
                      <p className="text-slate-400 text-xs italic">
                        {option.subText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Amount Selection */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl">
                <h4 className="text-2xl font-bold text-slate-100 mb-6 text-center">
                  Choose Your Amount
                </h4>

                {paymentMethod === "monthly" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {donateData.text.donationOptions[1].amountOptions.map(
                      (amount) => (
                        <button
                          key={amount}
                          onClick={() => handleSetAmount(parseInt(amount))}
                          className={`px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                            selectedAmount === amount
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white scale-105"
                              : "bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 hover:scale-105"
                          }`}
                        >
                          ${amount}
                        </button>
                      )
                    )}
                  </div>
                )}
                {/* Contact Information */}
                <div className="w-full max-w-2xl mx-auto mb-8">
                  <h5 className="text-lg font-bold text-slate-100 mb-6 text-center">
                    Contact Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-slate-200 font-semibold text-sm mb-2"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                        required
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-slate-200 font-semibold text-sm mb-2"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                        required
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="flex flex-col items-center space-y-4 gap-5">
                  <div className="w-full max-w-md">
                    <label className="block text-slate-200 font-semibold text-sm mb-2">
                      {paymentMethod === "one-time"
                        ? "Enter Amount"
                        : "Or Enter Custom Amount"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Donate Button */}
                  <button
                    onClick={handleDonation}
                    disabled={amount === 0 || !name.trim() || !email.trim()}
                    className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {paymentMethod === "one-time"
                      ? "Donate Now"
                      : "Start Monthly Donation"}
                  </button>
                  {(amount === 0 || !name.trim() || !email.trim()) && (
                    <p className="text-slate-400 text-sm text-center mt-2">
                      Please fill in all required fields and select an amount
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funding Areas */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                How Your Donation is Used
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {donateData.fundingAreas?.map((area, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-secondary-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        <span className="text-lg font-bold text-white">
                          {area.percentage}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-secondary-200 transition-colors">
                          {area.area}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                          {area.description}
                        </p>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <p className="text-slate-400 text-xs font-medium mb-1">
                            STEM Impact:
                          </p>
                          <p className="text-slate-200 text-xs leading-relaxed">
                            {area.stemImpact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Ways to Help */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Other Ways to Help
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donateData.otherWaysToHelp?.map((way, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-2xl">
                          {idx === 0
                            ? "🛍️"
                            : idx === 1
                              ? "👥"
                              : idx === 2
                                ? "🤝"
                                : "📢"}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
                        {way.title}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        {way.description}
                      </p>
                      <p className="text-slate-400 text-xs italic">
                        {way.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency Commitment */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-orange-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-200 to-pink-200 bg-clip-text text-transparent">
                    {donateData.text.transparencyTitle}
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto mb-6">
                  {donateData.text.transparencyDescription}
                </p>
                <div className="bg-slate-700/50 rounded-xl p-4 max-w-2xl mx-auto">
                  <p className="text-slate-300 text-sm italic">
                    {donateData.contributionInfo.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DonatePageClient;
