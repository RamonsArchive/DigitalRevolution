import React from "react";
import Link from "next/link";
import { ReturnPolicy } from "@/constants";
import TitleSection from "@/components/TitleSection";
import { IconCard, FeatureCard, InfoCard } from "@/components/cards";
import {
  ArrowLeft,
  RotateCcw,
  Clock,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ReturnPolicyPage = () => {
  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <RotateCcw className="w-6 h-6" />;
      case 2:
        return <Clock className="w-6 h-6" />;
      default:
        return <RotateCcw className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      {/* Hero Section */}
      <div className="relative h-[33%] overflow-hidden">
        <TitleSection
          title="Return Policy"
          titleClassName="font-lexend text-6xl md:text-8xl font-bold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 h-full"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary h-full">
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-12">
              <InfoCard
                icon={RotateCcw}
                title="Return & Refund Policy"
                description="We want you to be completely satisfied with your purchase. Here's everything you need to know about returns and refunds."
              />
            </div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {ReturnPolicy.map((policy) => (
                <IconCard
                  key={policy.id}
                  icon={getIcon(policy.id)}
                  title={policy.title}
                  content={<p>{policy.content}</p>}
                />
              ))}
            </div>

            {/* Important Notes */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={CheckCircle}
                title="What We Accept"
                description={
                  <ul className="text-green-200 text-sm space-y-1 text-left">
                    <li>• Damaged or defective items</li>
                    <li>• Items not as described</li>
                    <li>• Undelivered orders</li>
                    <li>• Within 30 days of purchase</li>
                  </ul>
                }
                gradientFrom="from-green-500/20"
                gradientTo="to-emerald-500/20"
                cardClassName="bg-gradient-to-br from-green-900/30 to-emerald-900/30"
                borderColor="border-green-500/30"
              />
              <FeatureCard
                icon={AlertCircle}
                title="What We Don't Accept"
                description={
                  <ul className="text-red-200 text-sm space-y-1 text-left">
                    <li>• Worn or washed items</li>
                    <li>• Custom/personalized items</li>
                    <li>• Items with signs of use</li>
                    <li>• After 30 days</li>
                  </ul>
                }
                gradientFrom="from-red-500/20"
                gradientTo="to-orange-500/20"
                cardClassName="bg-gradient-to-br from-red-900/30 to-orange-900/30"
                borderColor="border-red-500/30"
              />
            </div>

            {/* Contact Section */}
            <div className="mt-16">
              <InfoCard
                icon={RotateCcw}
                title="Need to Start a Return?"
                description="Contact us with your order number and reason for return. We'll guide you through the process."
                gradientFrom="from-secondary-500/20"
                gradientTo="to-primary-500/20"
                borderColor="border-secondary-500/30"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:clutchdev.apps@gmail.com"
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Start Return
                  </a>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Return Home
                  </Link>
                </div>
              </InfoCard>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
