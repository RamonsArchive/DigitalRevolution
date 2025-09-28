import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

const DonateCancelPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-orange-500/30 shadow-2xl">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-orange-300 mb-4">
              Donation Cancelled
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Your donation process was cancelled. No charges have been made to
              your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 bg-slate-700/50 text-slate-200 font-bold rounded-xl hover:bg-slate-600/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateCancelPage;
