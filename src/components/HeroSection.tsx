"use client";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleSection from "./TitleSection";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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
    });

    // Create scroll trigger that activates when you reach the bottom of the video
    // Create scroll-triggered animation with scrub
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom top",
      scrub: 1, // This ties animation directly to scroll progress
      animation: gsap
        .timeline()
        .to(titleRef.current, {
          y: 0, // Animate to center
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        })
        .to(titleRef.current, {
          y: "-100vh", // Continue animating past the top
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        }),
      onEnter: () => {
        // // Allow normal scrolling after animation
        // document.body.style.overflow = "hidden";
      },
      onLeave: () => {
        // Allow normal scrolling after animation
        document.body.style.overflow = "unset";
      },
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
          <source src="/Hero/heroVid3.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Title Section - starts below, animates up */}

      <div
        ref={titleRef}
        className="fixed inset-0 w-full flex items-center justify-center"
      >
        <TitleSection
          title={title}
          description={description}
          titleClassName="font-courier-prime text-4xl font-bold text-white text-center"
          descriptionClassName="font-courier-prime text-lg text-white text-center"
          containerClassName="hero-section-title-section w-full max-w-2xl px-10 py-5"
        />
      </div>
    </>
  );
}
