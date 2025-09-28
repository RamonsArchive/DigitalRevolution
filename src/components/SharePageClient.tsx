"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  Hash,
  Users,
  Target,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Globe,
  BookOpen,
  Handshake,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Award,
  TrendingUp,
  Users2,
  GraduationCap,
  Building2,
} from "lucide-react";
import { SHARE_DATA } from "@/constants";
import TitleSection from "./TitleSection";

const SharePageClient = ({ shareData }: { shareData: typeof SHARE_DATA }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "tiktok":
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary gap-16 pb-20">
      {/* Hero Section */}
      <div className="relative h-[33%] overflow-hidden">
        <TitleSection
          title={shareData.text.mainTitle}
          titleClassName="font-courier-prime text-6xl md:text-8xl font-bold text-center"
          containerClassName="flex items-center justify-center py-20 md:py-32 h-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-16 bg-gradient-to-b from-bg-primary via-primary-900 to-bg-primary h-full">
        {/* Mission Description */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center gap-2 md:gap-5 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    {shareData.text.subTitle}
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto mb-6">
                  {shareData.text.description}
                </p>
                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl p-4 max-w-2xl mx-auto">
                  <p className="text-emerald-200 font-semibold text-sm">
                    ✨ {shareData.text.promotion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Share Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {shareData.text.whyShareTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shareData.sharingReasons.map((reason, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                        <span className="text-2xl">{reason.icon}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
                        {reason.title}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hashtags Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-secondary-500/30 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 md:gap-5 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Hash className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
                      {shareData.text.hashtagsTitle}
                    </h3>
                  </div>
                  <p className="text-slate-300 text-lg">
                    Use these hashtags to help us reach more people and build
                    our community
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {shareData.hashtags.map((hashtag, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyToClipboard(hashtag, `hashtag-${idx}`)}
                      className="group/hashtag relative bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-secondary-500/50 rounded-xl p-3 transition-all duration-300 hover:scale-105 min-w-0 flex-shrink-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-200 font-medium text-sm group-hover/hashtag:text-secondary-200 transition-colors whitespace-nowrap">
                          {hashtag}
                        </span>
                        <div className="flex-shrink-0">
                          {copiedText === `hashtag-${idx}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400 group-hover/hashtag:text-secondary-400 transition-colors" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shareable Content */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Ready-to-Share Content
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-6">
              {shareData.shareableContent.map((content, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold rounded-full">
                            {content.type}
                          </span>
                        </div>
                        <p className="text-slate-200 text-lg leading-relaxed mb-4">
                          {content.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {content.hashtags.map((hashtag, hashtagIdx) => (
                            <span
                              key={hashtagIdx}
                              className="px-2 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-md"
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            copyToClipboard(content.content, `content-${idx}`)
                          }
                          className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                          {copiedText === `content-${idx}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          Copy Text
                        </button>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${content.content} ${content.hashtags.join(" ")}`,
                              `full-${idx}`
                            )
                          }
                          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                          {copiedText === `full-${idx}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          Copy All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                    Follow Us on Social Media
                  </h3>
                  <p className="text-slate-300 text-lg">
                    Connect with us and stay updated on our mission
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {shareData.promotionLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link relative bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-primary-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover/link:scale-110 transition duration-300">
                          {getPlatformIcon(link.platform)}
                        </div>
                        <h4 className="text-slate-200 font-semibold mb-1 group-hover/link:text-primary-200 transition-colors">
                          {link.label}
                        </h4>
                        <p className="text-slate-400 text-sm">@{link.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sharing Tips */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                {shareData.text.sharingTipsTitle}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shareData.sharingTips.map((tip, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        <span className="text-lg">💡</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-secondary-200 transition-colors">
                          {tip.tip}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get Featured Section */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-emerald-500/30 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 md:gap-5 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                      {shareData.featuredContent.title}
                    </h3>
                  </div>
                  <p className="text-slate-200 text-lg">
                    {shareData.featuredContent.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {shareData.featuredContent.requirements.map(
                        (req, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-slate-300"
                          >
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span className="text-sm">{req}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {shareData.featuredContent.benefits.map(
                        (benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-slate-300"
                          >
                            <span className="text-cyan-400 mt-1">★</span>
                            <span className="text-sm">{benefit}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Goals */}
        <section className="px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
                Our Community Goals
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shareData.communityGoals.map((goal, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                        {idx === 0 && <Users2 className="w-6 h-6 text-white" />}
                        {idx === 1 && (
                          <GraduationCap className="w-6 h-6 text-white" />
                        )}
                        {idx === 2 && (
                          <Building2 className="w-6 h-6 text-white" />
                        )}
                        {idx === 3 && <Heart className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-primary-200 transition-colors">
                          {goal.goal}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-500/30 shadow-2xl text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    {shareData.impactStats.title}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {shareData.impactStats.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-white">
                          {stat.metric}
                        </span>
                      </div>
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
    </div>
  );
};

export default SharePageClient;
