"use client";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleSection from "./TitleSection";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection({
  heroText,
}: {
  heroText: {
    section1: {
      title: React.ReactNode;
      description: React.ReactNode;
      sources?: string[];
    };
    section2: {
      title: React.ReactNode;
      description: React.ReactNode;
      sources?: string[];
    };
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { title: title1, description: description1 } = heroText.section1;
  const {
    title: title2,
    description: description2,
    sources: sources2,
  } = heroText.section2;

  //   // Prevent initial scrolling
  //   useEffect(() => {
  //     document.body.style.overflow = "hidden";
  //     return () => {
  //       document.body.style.overflow = "unset";
  //     };
  //   }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set title to start completely below viewport
    // Set title to start completely below viewport
    gsap.set(titleRef.current, {
      y: "100vh",
      opacity: 0,
      display: "flex",
    });

    // Professional approach: Pin the video and animate title
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=800vh", // Pin for 100vh of scroll
      pin: true, // Pin the container
      pinSpacing: false, // No extra space
      scrub: 1.8, // Smooth scroll-based animation
      animation: gsap
        .timeline()
        .to(titleRef.current, {
          y: 0, // Animate to center
          opacity: 1,
          duration: 10,
          display: "flex",
          ease: "power2.out",
        })
        .to(titleRef.current, {
          y: "-200vh", // Continue past the top
          opacity: 0,
          duration: 10,
          ease: "power2.in",
        }),
    });
  }, []);

  return (
    <>
      {/* Hero Container - this gets scrolled past */}
      <div ref={containerRef} className="relative flex h-screen w-full">
        {/* Video Background - this gets PINNED */}
        <video
          ref={videoRef}
          className="flex inset-0 w-full h-screen object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Hero/heroVid2.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div
          ref={titleRef}
          className="hidden fixed inset-0 w-full items-center justify-center rounded-xl z-1"
        >
          <div className="flex flex-col gap-20">
            <div className="flex w-full items-center justify-center">
              <TitleSection
                title={title1}
                description={description1}
                titleClassName="font-courier-prime text-4xl font-bold text-white text-center rounded-xl"
                descriptionClassName="font-courier-prime text-lg text-white text-start rounded-xl"
                containerClassName="hero-section-title-section flex flex-col justify-start gap-5 w-full max-w-2xl px-10 py-5 rounded-xl"
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="title-gradient-bg flex flex-col gap-5 justify-start w-full max-w-2xl px-10 py-5 rounded-xl">
                <h1 className="font-courier-prime text-4xl font-bold text-white text-center rounded-xl">
                  {title2}
                </h1>
                <div className="flex flex-col gap-3 w-full">
                  <div className="font-courier-prime text-lg text-white text-start rounded-xl">
                    {description2}
                  </div>
                  <div className="font-courier-prime text-lg text-white text-start rounded-xl">
                    Sources:
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    {sources2?.map((item, index) => (
                      <div
                        key={index}
                        className="font-courier-prime text-lg text-white text-start rounded-xl"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
