"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Heart, Users, Globe, ArrowLeft } from "lucide-react";
import { Donation } from "../../prisma/generated/prisma";
import { formatDate } from "@/lib/utils";

interface DonateSuccessClientProps {
  donation: Donation | null;
  error?: string;
}

const DonateSuccessClient = ({ donation, error }: DonateSuccessClientProps) => {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (error || !donation) {
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
                Donation Not Found
              </h1>
              <p className="text-slate-300 text-lg mb-8">
                We couldn't find your donation details. Please contact support
                if you believe this is an error.
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
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Your generous donation is helping us bridge the digital divide and
              create opportunities for underserved communities.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 h-full pb-20">
        {/* Donation Details Card */}
        <section className="px-6 md:px-12 -mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-emerald-500/30 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-4">
                    Donation Confirmed
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Donation Amount */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💰</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">
                      Amount Donated
                    </h3>
                    <p className="text-4xl font-bold text-emerald-300">
                      {formatPrice(donation.amount)}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      {donation.currency.toUpperCase()}
                    </p>
                  </div>

                  {/* Donation Type */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">
                        {donation.donationType === "one-time" ? "🎯" : "🔄"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">
                      Donation Type
                    </h3>
                    <p className="text-2xl font-bold text-cyan-300 capitalize">
                      {donation.donationType.replace("-", " ")}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      {donation.donationType === "one-time"
                        ? "Single contribution"
                        : "Recurring support"}
                    </p>
                  </div>
                </div>

                {/* Donor Information */}
                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <h3 className="text-xl font-bold text-slate-100 mb-6 text-center">
                    Donation Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Donor Name
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {donation.isAnonymous
                          ? "Anonymous"
                          : donation.donorName || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Email
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {donation.donorEmail}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Status
                      </p>
                      <p className="text-emerald-300 font-semibold capitalize">
                        {donation.status}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        Date
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {formatDate(donation.createdAt)}
                      </p>
                    </div>
                  </div>

                  {donation.message && (
                    <div className="mt-6 bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm font-medium mb-2">
                        Your Message
                      </p>
                      <p className="text-slate-200 italic">
                        "{donation.message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-4">
                Your Impact
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-200 transition-colors">
                      Direct Support
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Your donation directly funds STEM education programs,
                      technology access initiatives, and community outreach
                      efforts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-200 transition-colors">
                      Community Impact
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Help us reach more underserved communities and provide
                      equitable access to digital resources and education.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-200 transition-colors">
                      Long-term Change
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Support sustainable initiatives that create lasting change
                      in digital equity and STEM education access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-emerald-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">📧</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                    What's Next?
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto mb-8">
                  You'll receive a confirmation email shortly with your donation
                  receipt. Follow us on social media to stay updated on how your
                  contribution is making a difference!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Return Home
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

export default DonateSuccessClient;
