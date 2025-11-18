import React from "react";
import Link from "next/link";
import { TermsOfService } from "@/constants";
import TitleSection from "@/components/TitleSection";
import { IconCard, InfoCard } from "@/components/cards";
import {
  ArrowLeft,
  FileText,
  Scale,
  Shield,
  CreditCard,
  AlertTriangle,
  Copyright,
  Zap,
  Globe,
} from "lucide-react";

const TermsOfServicePage = () => {
  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <FileText className="w-6 h-6" />;
      case 2:
        return <Globe className="w-6 h-6" />;
      case 3:
        return <Shield className="w-6 h-6" />;
      case 4:
        return <CreditCard className="w-6 h-6" />;
      case 5:
        return <AlertTriangle className="w-6 h-6" />;
      case 6:
        return <Copyright className="w-6 h-6" />;
      case 7:
        return <Scale className="w-6 h-6" />;
      case 8:
        return <Zap className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      {/* Hero Section */}
      <div className="relative h-[33%] overflow-hidden">
        <TitleSection
          title="Terms of Service"
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
                icon={Scale}
                title="Legal Terms & Conditions"
                description="Please read these terms carefully before using our services. By accessing Digital Revolution, you agree to be bound by these terms."
              />
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {TermsOfService.map((term) => (
                <IconCard
                  key={term.id}
                  icon={getIcon(term.id)}
                  title={term.title}
                  content={<p>{term.content}</p>}
                />
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16">
              <InfoCard
                icon={Scale}
                title="Questions About These Terms?"
                description="If you have any questions about these Terms of Service, please contact us."
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

export default TermsOfServicePage;
