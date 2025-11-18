"use client";

import React from "react";
import { PARTNERS_DATA } from "@/constants";
import TitleSection from "./TitleSection";
import ImageCarousel from "./ImageCarousel";
import PartnersForm from "./PartnersForm";
import { FeatureCard, IconCard } from "@/components/cards";

const PartnersPageClient = ({
  partnersData,
}: {
  partnersData: typeof PARTNERS_DATA;
}) => {
  const images = (partnersData.images || []).map((img) => img.src);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      {/* Hero Section */}
      <div className="relative h-[33%] overflow-hidden">
        <TitleSection
          title={partnersData.text.mainTitle}
          titleClassName="font-lexend text-6xl md:text-8xl font-bold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 px-8 md:px-12 h-full"
          isHero={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-slate-900/50 to-bg-primary h-full">
        {/* Partnership Overview */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    Partnership Overview
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto">
                  {partnersData.text.partnershipOverview}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {partnersData.text.typesTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnersData.partnershipTypes?.map((type, idx) => {
                const icons = ["🏢", "🎓", "🤝", "🏛️"];
                return (
                  <FeatureCard
                    key={idx}
                    icon={icons[idx] || "📌"}
                    title={type.type}
                    description={
                      <>
                        <p className="mb-3">{type.description}</p>
                        <p className="text-xs italic">
                          Examples: {type.examples}
                        </p>
                      </>
                    }
                    className="h-full"
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {partnersData.text.benefitsTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnersData.benefits?.map((benefit, idx) => {
                const icons = ["📈", "⭐", "🌐", "🔄", "📊"];
                return (
                  <IconCard
                    key={idx}
                    icon={icons[idx] || "📌"}
                    title={benefit.title}
                    content={<p>{benefit.description}</p>}
                    gradientFrom="from-secondary-500/10"
                    gradientTo="to-primary-500/10"
                    className="h-full"
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Partnership Requirements */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    {partnersData.requirements.title}
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg mb-6">
                  {partnersData.requirements.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnersData.requirements.criteria?.map((criterion, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {criterion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="flex flex-col gap-2 items-center justify-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Partnership Gallery{" "}
                <span className="text-xs text-slate-300">
                  <span className="text-red-500">*</span>Placeholders for future
                  partnerships
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-primary-500/30">
              <ImageCarousel images={images} />
            </div>
          </div>
        </section>

        {/* Partnership Form */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-3xl">📝</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                      {partnersData.text.formTitle}
                    </h2>
                  </div>
                  <p className="text-slate-200 leading-relaxed text-lg max-w-2xl mx-auto">
                    {partnersData.text.callToAction}
                  </p>
                </div>
                <PartnersForm formTitle={partnersData.text.formTitle} />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-secondary-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">📞</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
                    Get In Touch
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">
                      Email
                    </h3>
                    <p className="text-slate-300">
                      {partnersData.contactInfo.email}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">
                      Response Time
                    </h3>
                    <p className="text-slate-300">
                      {partnersData.contactInfo.responseTime}
                    </p>
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

export default PartnersPageClient;
