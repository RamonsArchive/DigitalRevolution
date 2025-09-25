"use client";
import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-red-900/20 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-300">
            Payment Cancelled
          </h1>
          <p className="text-slate-400 text-lg">
            Your payment was cancelled. No charges have been made to your
            account.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-600/40">
          <h3 className="text-slate-300 font-semibold mb-2">Need Help?</h3>
          <p className="text-slate-400 text-sm">
            If you're experiencing issues with checkout, please contact our
            support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
