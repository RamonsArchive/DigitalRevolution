"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection({
  section1,
}: {
  section1: {
    title: React.ReactNode;
    subtitle: React.ReactNode;
    description: React.ReactNode;
    sources?: string[];
  };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    title: title1,
    subtitle: subtitle1,
    description: description1,
  } = section1;

  // Safari video playback fix
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playVideo = async () => {
        try {
          await video.play();
        } catch {
          // Autoplay might be blocked; ignore.
        }
      };

      playVideo();

      const handleUserInteraction = () => {
        playVideo();
        document.removeEventListener("touchstart", handleUserInteraction);
        document.removeEventListener("click", handleUserInteraction);
      };

      document.addEventListener("touchstart", handleUserInteraction);
      document.addEventListener("click", handleUserInteraction);

      return () => {
        document.removeEventListener("touchstart", handleUserInteraction);
        document.removeEventListener("click", handleUserInteraction);
      };
    }
  }, []);

  return (
    <section className="relative flex h-[calc(100dvh-42px)] w-full overflow-hidden bg-linear-to-b from-bg-primary via-bg-dark/80 to-bg-primary">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center lg:py-14">
        <div className="flex flex-1 flex-col gap-5 text-white md:pr-6">
          <div className="hero-fade-up text-xs font-semibold uppercase tracking-[0.3em] text-primary-200">
            Digital Revolution
          </div>

          <h1 className="hero-fade-up hero-fade-delay-1 font-lexend text-4xl font-extrabold leading-tight md:text-6xl">
            {title1}
          </h1>

          <p className="hero-fade-up hero-fade-delay-2 max-w-2xl text-lg text-slate-200 md:text-xl">
            {subtitle1}
          </p>

          <div className="hero-fade-up hero-fade-delay-3 flex items-center gap-3 rounded-xl border border-primary-700/50 bg-primary-950/40 px-4 py-3 shadow-lg shadow-primary-900/40 backdrop-blur">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary-400/60 shadow-[0_0_12px_rgba(0,212,255,0.35)]">
              <Image
                src="/About/personal1.png"
                alt="Ramon - Founder"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">
                Ramon — Founder
              </p>
              <p className="text-xs text-primary-100">
                Building ownership in the digital age.
              </p>
            </div>
          </div>

          <div className="hero-fade-up hero-fade-delay-4 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="shop-gradient-btn rounded-lg px-5 py-2 text-sm font-semibold text-bg-primary shadow-lg shadow-primary-900/40 transition hover:scale-[1.02]"
            >
              Shop to support
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-primary-500/60 px-4 py-2 text-sm font-semibold text-primary-100 transition hover:border-primary-400 hover:bg-primary-500/10"
            >
              Our mission
            </Link>
          </div>

          <div className="hero-fade-up hero-fade-delay-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg hidden md:block">
            {description1}
          </div>
        </div>

        <div className="hero-fade-up hero-fade-delay-4 relative flex-1 h-[360px] md:h-[calc(100dvh-42px)]">
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-primary-800/50 shadow-2xl shadow-primary-900/40">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              preload="auto"
              controls={false}
            >
              <source src="/Hero/hero1.MOV" type="video/mp4" />
              <source src="/Hero/hero1.MOV" type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg-primary/60 via-bg-primary/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
