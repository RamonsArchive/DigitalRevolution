import React from "react";
import Link from "next/link";
import { TermsOfService } from "@/constants";
import TitleSection from "@/components/TitleSection";
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
          titleClassName="font-courier-prime text-6xl md:text-8xl font-bold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 h-full"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary h-full">
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="group relative mb-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                    Legal Terms & Conditions
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
                    Please read these terms carefully before using our services.
                    By accessing Digital Revolution, you agree to be bound by
                    these terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {TermsOfService.map((term, idx) => (
                <div key={term.id} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        {getIcon(term.id)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-primary-200 transition-colors">
                          {term.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg">
                          {term.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-secondary-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-100 mb-4">
                    Questions About These Terms?
                  </h3>
                  <p className="text-slate-300 mb-6">
                    If you have any questions about these Terms of Service,
                    please contact us.
                  </p>
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
