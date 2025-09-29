import React from "react";
import Link from "next/link";
import { PrivacyPolicy } from "@/constants";
import TitleSection from "@/components/TitleSection";
import {
  ArrowLeft,
  Shield,
  Database,
  Eye,
  Share2,
  Lock,
  UserCheck,
  Clock,
  Cookie,
  ExternalLink,
} from "lucide-react";

const PrivacyPolicyPage = () => {
  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Database className="w-6 h-6" />;
      case 2:
        return <Eye className="w-6 h-6" />;
      case 3:
        return <Share2 className="w-6 h-6" />;
      case 4:
        return <Lock className="w-6 h-6" />;
      case 5:
        return <UserCheck className="w-6 h-6" />;
      case 6:
        return <Clock className="w-6 h-6" />;
      case 7:
        return <Cookie className="w-6 h-6" />;
      case 8:
        return <ExternalLink className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      {/* Hero Section */}
      <div className="relative h-[33%] overflow-hidden">
        <TitleSection
          title="Privacy Policy"
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
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                    Your Privacy Matters
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
                    We&apos;re committed to protecting your privacy and being
                    transparent about how we collect, use, and protect your
                    information.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {PrivacyPolicy.map((policy, idx) => (
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

            {/* Key Privacy Principles */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-blue-100 mb-2">
                      Secure
                    </h4>
                    <p className="text-blue-200 text-sm">
                      Bank-level encryption for all data transmission and
                      storage
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="text-center">
                    <UserCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-green-100 mb-2">
                      Transparent
                    </h4>
                    <p className="text-green-200 text-sm">
                      Clear communication about what data we collect and why
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-purple-100 mb-2">
                      Respectful
                    </h4>
                    <p className="text-purple-200 text-sm">
                      Your data belongs to you - we never sell or misuse it
                    </p>
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
                    Questions About Your Privacy?
                  </h3>
                  <p className="text-slate-300 mb-6">
                    We&apos;re here to help. Contact us if you have any questions
                    about your data or privacy rights.
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

export default PrivacyPolicyPage;
