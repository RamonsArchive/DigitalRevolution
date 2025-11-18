"use client";

import { DONATE_DATA } from "@/constants";
import React from "react";
import TitleSection from "./TitleSection";
import { useState } from "react";
import { Session } from "next-auth";
import { parseServerActionResponse } from "@/lib/utils";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { verifyDonateForm } from "@/lib/validation";
import { z } from "zod";
import {
  createDonationSession,
  createSubscriptionSession,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  ImpactBreakdownCard,
  FundingAreaCard,
  DonationOptionCard,
  InfoCard,
  FeatureCard,
} from "@/components/cards";
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
          titleClassName="font-lexend text-6xl md:text-8xl font-extrabold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 px-8 md:px-12 h-full"
          isHero={true}
        />
      </div>
      {/* Main Content */}
      <div className="flex flex-col gap-[4.5rem] md:gap-20 bg-gradient-to-b from-bg-primary via-slate-900/50 to-bg-primary h-full">
        {/* Donation Description */}
        <section className="px-6 md:px-12 py-10 md:py-12">
          <div className="max-w-4xl mx-auto">
            <InfoCard
              icon="💝"
              title={donateData.text.subTitle}
              description={donateData.text.description}
              borderColor="border-primary-500/30"
            />
          </div>
        </section>

        {/* Impact Breakdown */}
        <section className="px-6 md:px-12 py-10 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-[3.5rem] md:mb-16">
              <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {donateData.text.impactTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {donateData.impactBreakdown?.map((impact, idx) => (
                <ImpactBreakdownCard
                  key={idx}
                  amount={impact.amount}
                  impact={impact.impact}
                  stemConnection={impact.stemConnection}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Donation Options */}
        <section className="px-6 md:px-12 py-10 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-[3.5rem] md:mb-16">
              <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {donateData.text.donationTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {donateData.text.donationOptions?.map((option) => (
                <DonationOptionCard
                  key={option.id}
                  id={option.id}
                  title={option.title}
                  description={option.description}
                  subText={option.subText}
                  isSelected={paymentMethod === option.id}
                  onClick={() => setPaymentMethod(option.id)}
                  className="h-full"
                />
              ))}
            </div>

            {/* Amount Selection */}
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary-400/50 overflow-hidden">
                {/* Gradient overlay - matches card height exactly */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none blur-sm" />
                <h4 className="text-2xl font-semibold text-slate-100 mb-6 text-center">
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
                  <h5 className="text-lg font-semibold text-slate-100 mb-6 text-center">
                    Contact Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-slate-200 font-medium text-sm mb-2"
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
                        className="block text-slate-200 font-medium text-sm mb-2"
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
        <section className="px-6 md:px-12 py-10 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-[3.5rem] md:mb-16">
              <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                How Your Donation is Used
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {donateData.fundingAreas?.map((area, idx) => (
                <FundingAreaCard
                  key={idx}
                  percentage={area.percentage}
                  area={area.area}
                  description={area.description}
                  stemImpact={area.stemImpact}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Other Ways to Help */}
        <section className="px-6 md:px-12 py-10 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-[3.5rem] md:mb-16">
              <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Other Ways to Help
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donateData.otherWaysToHelp?.map((way, idx) => {
                const icons = ["🛍️", "👥", "🤝", "📢"];
                return (
                  <FeatureCard
                    key={idx}
                    icon={icons[idx] || "📌"}
                    title={way.title}
                    description={
                      <>
                        <p className="mb-3">{way.description}</p>
                        <p className="text-xs italic">{way.action}</p>
                      </>
                    }
                    className="h-full"
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Transparency Commitment */}
        <section className="px-6 md:px-12 py-10 md:py-12">
          <div className="max-w-4xl mx-auto">
            <InfoCard
              icon="🔍"
              title={donateData.text.transparencyTitle}
              description={donateData.text.transparencyDescription}
              borderColor="border-orange-500/30"
              gradientFrom="from-orange-500/10"
              gradientTo="to-pink-500/10"
              iconBgClassName="bg-gradient-to-r from-orange-500 to-pink-500"
            >
              <div className="bg-slate-700/50 rounded-xl p-4 max-w-2xl mx-auto">
                <p className="text-slate-300 text-sm italic">
                  {donateData.contributionInfo.status}
                </p>
              </div>
            </InfoCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DonatePageClient;
