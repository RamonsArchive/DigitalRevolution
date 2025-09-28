import React from "react";
import Link from "next/link";
import { ReturnPolicy } from "@/constants";
import TitleSection from "@/components/TitleSection";
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
                    <RotateCcw className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                    Return & Refund Policy
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
                    We want you to be completely satisfied with your purchase.
                    Here's everything you need to know about returns and
                    refunds.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {ReturnPolicy.map((policy, idx) => (
                <div key={policy.id} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        {getIcon(policy.id)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-primary-200 transition-colors">
                          {policy.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg">
                          {policy.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Notes */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-green-100 mb-2">
                        What We Accept
                      </h4>
                      <ul className="text-green-200 text-sm space-y-1">
                        <li>• Damaged or defective items</li>
                        <li>• Items not as described</li>
                        <li>• Undelivered orders</li>
                        <li>• Within 30 days of purchase</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-red-100 mb-2">
                        What We Don't Accept
                      </h4>
                      <ul className="text-red-200 text-sm space-y-1">
                        <li>• Worn or washed items</li>
                        <li>• Custom/personalized items</li>
                        <li>• Items with signs of use</li>
                        <li>• After 30 days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-16 group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-secondary-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-100 mb-4">
                    Need to Start a Return?
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Contact us with your order number and reason for return.
                    We'll guide you through the process.
                  </p>
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
