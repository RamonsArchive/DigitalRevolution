"use client";

import React from "react";
import TitleSection from "./TitleSection";
import ImageCarousel from "./ImageCarousel";
import { ABOUT_DATA } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const AboutPageClient = ({ aboutData }: { aboutData: typeof ABOUT_DATA }) => {
  const images = (aboutData.images || []).map((img) => img.src);
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      {/* Hero Section with Animated Background */}
      <div className="relative h-[33%] overflow-hidden">
        <TitleSection
          title={aboutData.text.mainTitle}
          titleClassName="font-courier-prime text-6xl md:text-8xl font-bold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 h-full"
        />
      </div>

      {/* Mission & Vision Cards */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary h-full">
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    {aboutData.text.missionTitle}
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg">
                  {aboutData.text.missionStatement}
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-secondary-500/30 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
                    {aboutData.text.descriptionTitle}
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg">
                  {aboutData.text.missionDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="px-6 md:px-12 bg-gradient-to-br">
          <div className="max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="w-full lg:w-1/3">
                    <div className="relative group/image">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover/image:opacity-50 transition duration-500"></div>
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-primary-500/50 shadow-2xl">
                        <Image
                          src={
                            aboutData.images?.[0]?.src ||
                            "/Assets/About/Images/personal1.png"
                          }
                          alt={aboutData.images?.[0]?.alt || "Founder"}
                          fill
                          className="object-cover group-hover/image:scale-105 transition duration-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-2xl">👨‍💻</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                        {aboutData.text.founderTitle}
                      </h2>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-lg">
                      {aboutData.text.founderDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {aboutData.text.impactTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aboutData.impactAreas?.map((area, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        <span className="text-lg">
                          {idx === 0
                            ? "🌐"
                            : idx === 1
                              ? "📚"
                              : idx === 2
                                ? "🔬"
                                : "🏛️"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
                          {area.title}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                          {area.description}
                        </p>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <p className="text-slate-400 text-xs font-medium mb-1">
                            STEM Connection:
                          </p>
                          <p className="text-slate-200 text-xs leading-relaxed">
                            {area.stemConnection}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Our Values
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {aboutData.values?.map((v, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-2xl">
                          {idx === 0
                            ? "⚖️"
                            : idx === 1
                              ? "🏘️"
                              : idx === 2
                                ? "📊"
                                : idx === 3
                                  ? "🗳️"
                                  : "🎓"}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
                        {v.title}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Initiatives */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Our Initiatives
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutData.initiatives?.map((initiative, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-secondary-500/30 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        <span className="text-lg">
                          {idx === 0
                            ? "🗳️"
                            : idx === 1
                              ? "🌉"
                              : idx === 2
                                ? "🏢"
                                : "📖"}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-secondary-200 transition-colors">
                          {initiative.name}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {initiative.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                    Our Impact
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📅</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-100 mb-2">
                      Founded
                    </h4>
                    <p className="text-slate-300 text-lg">
                      {aboutData.stats.founded}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💝</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-100 mb-2">
                      Profits Donated
                    </h4>
                    <p className="text-slate-300 text-lg">
                      {aboutData.stats.profitsDonated}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-100 mb-2">
                      Communities Served
                    </h4>
                    <p className="text-slate-300 text-lg">
                      {aboutData.stats.communitiesServed}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-100 mb-2">
                      Mission Focus
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {aboutData.stats.missionFocus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Gallery
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-primary-500/30">
              <ImageCarousel images={images} />
            </div>
          </div>
        </section>

        {/* How to Support */}
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
                    {aboutData.text.howToSupportTitle}
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto">
                  {aboutData.text.howToSupport}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/shop"
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/donate"
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Donate
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

export default AboutPageClient;
