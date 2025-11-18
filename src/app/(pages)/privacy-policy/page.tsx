import React from "react";
import Link from "next/link";
import { PrivacyPolicy } from "@/constants";
import TitleSection from "@/components/TitleSection";
import { IconCard, FeatureCard, InfoCard } from "@/components/cards";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicyPage = () => {
  const getIcon = (id: number): string => {
    switch (id) {
      case 1:
        return "💾";
      case 2:
        return "👁️";
      case 3:
        return "🔗";
      case 4:
        return "🔒";
      case 5:
        return "✅";
      case 6:
        return "⏰";
      case 7:
        return "🍪";
      case 8:
        return "🔗";
      default:
        return "🛡️";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      {/* Hero Section */}
      <div className="relative h-[33%] overflow-hidden">
        <TitleSection
          title="Privacy Policy"
          titleClassName="font-lexend text-6xl md:text-8xl font-bold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 px-8 md:px-12 h-full"
          isHero={true}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-slate-900/50 to-bg-primary h-full">
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-12">
              <InfoCard
                icon="🛡️"
                title="Your Privacy Matters"
                description="We're committed to protecting your privacy and being transparent about how we collect, use, and protect your information."
              />
            </div>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {PrivacyPolicy.map((policy) => (
                <IconCard
                  key={policy.id}
                  icon={getIcon(policy.id)}
                  title={policy.title}
                  content={policy.content}
                />
              ))}
            </div>

            {/* Key Privacy Principles */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon="🔒"
                title="Secure"
                description="Bank-level encryption for all data transmission and storage"
                gradientFrom="from-blue-500/20"
                gradientTo="to-cyan-500/20"
                cardClassName="bg-gradient-to-br from-blue-900/30 to-cyan-900/30"
                borderColor="border-blue-500/30"
              />
              <FeatureCard
                icon="✅"
                title="Transparent"
                description="Clear communication about what data we collect and why"
                gradientFrom="from-green-500/20"
                gradientTo="to-emerald-500/20"
                cardClassName="bg-gradient-to-br from-green-900/30 to-emerald-900/30"
                borderColor="border-green-500/30"
              />
              <FeatureCard
                icon="🛡️"
                title="Respectful"
                description="Your data belongs to you - we never sell or misuse it"
                gradientFrom="from-purple-500/20"
                gradientTo="to-pink-500/20"
                cardClassName="bg-gradient-to-br from-purple-900/30 to-pink-900/30"
                borderColor="border-purple-500/30"
              />
            </div>

            {/* Contact Section */}
            <div className="mt-16">
              <InfoCard
                icon="🛡️"
                title="Questions About Your Privacy?"
                description="We're here to help. Contact us if you have any questions about your data or privacy rights."
                gradientFrom="from-secondary-500/20"
                gradientTo="to-primary-500/20"
                borderColor="border-secondary-500/30"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:clutchdev.apps@gmail.com"
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Contact Us
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

export default PrivacyPolicyPage;
