"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  PathwayCard,
  FactCard,
  ImpactCard,
  InfoCard,
  StatsMetricsCard,
} from "@/components/cards";

interface HomePageClientProps {
  homeData: typeof import("@/constants").HOME_TEXT_SECTIONS;
}

const HomePageClient = ({ homeData }: HomePageClientProps) => {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Digital Divide Reality Section */}
      <section className="px-6 md:px-12 py-22 md:py-24 bg-[linear-gradient(#020617_0%,#020617_14%,transparent_22%),radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.10),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.10),transparent_35%)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-18 md:mb-20 overflow-visible">
            <h2 className="section-title text-4xl md:text-6xl font-extrabold bg-linear-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6 pb-3 overflow-visible">
              {homeData.section2.title}
            </h2>
            <p className="section-subtitle text-xl font-medium text-slate-300 max-w-3xl mx-auto">
              {homeData.section2.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Facts List */}
            <div className="space-y-6 mb-12">
              {homeData.section2.description.map((fact, idx) => {
                const icons = ["🌐", "📊", "⚖️", "🎓"];
                return (
                  <FactCard
                    key={idx}
                    icon={icons[idx] || "📌"}
                    fact={fact}
                    className="w-fit"
                  />
                );
              })}
            </div>

            {/* Sources Card */}
            <div className="w-fit mx-auto">
              <InfoCard
                icon="📚"
                title="Research Sources"
                description=""
                className="bg-linear-to-br from-blue-900/30 to-cyan-800/20"
                borderColor="border-blue-500/30"
              >
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
              </InfoCard>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Approach Section */}
      <section className="px-6 md:px-12 py-22 md:py-24 bg-[linear-gradient(#020617_0%,#020617_14%,transparent_22%),radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.08),transparent_35%)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-18 md:mb-20 overflow-visible">
            <h2 className="section-title text-4xl md:text-6xl font-extrabold bg-linear-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6 pb-3 overflow-visible">
              {homeData.section3.title}
            </h2>
            <p className="section-subtitle text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              {homeData.section3.subtitle}
            </p>
            <p className="section-description text-lg font-normal text-slate-400 max-w-3xl mx-auto">
              {homeData.section3.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeData.section3.impactAreas.map((area, idx) => (
              <ImpactCard
                key={idx}
                icon={area.icon}
                title={area.title}
                description={area.description}
                impactLabel="Impact"
                impactContent={area.outcome}
                layout="vertical"
                className="h-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pathway Section */}
      <section className="px-6 md:px-12 py-22 md:py-24 bg-[linear-gradient(#020617_0%,#020617_14%,transparent_22%),radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.10),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.10),transparent_35%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-18 md:mb-20 overflow-visible">
            <h2 className="section-title text-4xl md:text-6xl font-extrabold bg-linear-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6 pb-3 overflow-visible">
              {homeData.section4.title}
            </h2>
            <p className="section-subtitle text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              {homeData.section4.subtitle}
            </p>
            <p className="section-description text-lg font-normal text-slate-400 max-w-3xl mx-auto">
              {homeData.section4.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeData.section4.pathway.map((step, idx) => (
              <PathwayCard
                key={idx}
                icon={step.icon}
                title={step.title}
                description={step.description}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Support Our Mission Section */}
      <section className="px-6 md:px-12 py-22 md:py-24 bg-[linear-gradient(#020617_0%,#020617_14%,transparent_22%),radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.08),transparent_35%)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-18 md:mb-20 overflow-visible">
            <h2 className="section-title text-4xl md:text-6xl font-extrabold bg-linear-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-6 pb-3 overflow-visible">
              {homeData.section5.title}
            </h2>
            <p className="section-subtitle text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              {homeData.section5.subtitle}
            </p>
            <p className="section-description text-lg font-normal text-slate-400 max-w-3xl mx-auto">
              {homeData.section5.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeData.section5.supportOptions.map((option, idx) => {
              const icons = ["🛍️", "💰", "📤", "👥"];
              return (
                <Link key={idx} href={option.href} className="h-full">
                  <ImpactCard
                    icon={icons[idx] || "🛍️"}
                    title={option.label}
                    description={option.description}
                    impactLabel="Impact"
                    impactContent={option.impact}
                    layout="vertical"
                    gradientFrom="from-emerald-500/10"
                    gradientTo="to-cyan-500/10"
                    iconGradientFrom="from-emerald-500"
                    iconGradientTo="to-cyan-500"
                    className="h-full"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-12 py-22 md:py-24 bg-[linear-gradient(#020617_0%,#020617_14%,transparent_22%),radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.10),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.10),transparent_35%)]">
        <div className="max-w-6xl mx-auto">
          <InfoCard
            icon="📈"
            title={homeData.stats.title}
            description={homeData.stats.description}
          />
          <div className="mt-6">
            <StatsMetricsCard metrics={homeData.stats.metrics} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageClient;
