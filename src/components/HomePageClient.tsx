"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  GraduationCap,
  Building2,
  Users,
  ArrowRight,
  Target,
  TrendingUp,
  Heart,
  Share2,
  ShoppingBag,
  DollarSign,
  ExternalLink,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Award,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { animateTextScroll, animateCardsScroll } from "@/lib/utils";

interface HomePageClientProps {
  homeData: typeof import("@/constants").HOME_TEXT_SECTIONS;
}

const HomePageClient = ({ homeData }: HomePageClientProps) => {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Digital Divide Reality Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-bg-primary via-slate-900 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6">
              {homeData.section2.title}
            </h2>
            <p className="section-subtitle text-xl text-slate-300 max-w-3xl mx-auto">
              {homeData.section2.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Facts List */}
            <div className="space-y-6 mb-12">
              {homeData.section2.description.map((fact, idx) => (
                <div key={idx} className="fact-card group relative w-fit">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        <span className="text-2xl">
                          {idx === 0
                            ? "🌐"
                            : idx === 1
                              ? "📊"
                              : idx === 2
                                ? "⚖️"
                                : "🎓"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-200 leading-relaxed text-lg">
                          {fact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sources Card */}
            <div className="fact-card group relative w-fit mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-900/30 to-cyan-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-100">
                    Research Sources
                  </h3>
                </div>
                <div className="space-y-4">
                  {homeData.section2.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group/source"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-cyan-300 group-hover/source:text-cyan-200 transition-colors">
                          {source.title}
                        </p>
                        <ExternalLink className="w-4 h-4 text-cyan-400 group-hover/source:text-cyan-300 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Approach Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6">
              {homeData.section3.title}
            </h2>
            <p className="section-subtitle text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              {homeData.section3.subtitle}
            </p>
            <p className="section-description text-lg text-slate-400 max-w-3xl mx-auto">
              {homeData.section3.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeData.section3.impactAreas.map((area, idx) => (
              <div
                key={idx}
                className="impact-card group relative w-fit mx-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <span className="text-2xl">{area.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {area.description}
                    </p>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs font-medium mb-1">
                        Impact:
                      </p>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {area.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathway Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-bg-primary via-slate-900 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6">
              {homeData.section4.title}
            </h2>
            <p className="section-subtitle text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              {homeData.section4.subtitle}
            </p>
            <p className="section-description text-lg text-slate-400 max-w-3xl mx-auto">
              {homeData.section4.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeData.section4.pathway.map((step, idx) => (
              <div
                key={idx}
                className="pathway-card group relative w-fit mx-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      <span className="text-2xl font-bold text-white">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-secondary-200 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Our Mission Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6">
              {homeData.section5.title}
            </h2>
            <p className="section-subtitle text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              {homeData.section5.subtitle}
            </p>
            <p className="section-description text-lg text-slate-400 max-w-3xl mx-auto">
              {homeData.section5.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeData.section5.supportOptions.map((option, idx) => (
              <Link
                key={idx}
                href={option.href}
                className="support-card group relative w-fit mx-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                      {idx === 0 && (
                        <ShoppingBag className="w-8 h-8 text-white" />
                      )}
                      {idx === 1 && (
                        <DollarSign className="w-8 h-8 text-white" />
                      )}
                      {idx === 2 && <Share2 className="w-8 h-8 text-white" />}
                      {idx === 3 && <Users className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-emerald-200 transition-colors">
                      {option.label}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {option.description}
                    </p>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs font-medium mb-1">
                        Impact:
                      </p>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {option.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-bg-primary via-slate-900 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    {homeData.stats.title}
                  </h3>
                </div>
                <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                  {homeData.stats.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {homeData.stats.metrics.map((stat, idx) => (
                  <div
                    key={idx}
                    className="stat-card text-center w-fit mx-auto"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">
                        {stat.number}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-100 mb-2">
                      {stat.label}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageClient;
