"use client";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleSection from "./TitleSection";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection({
  section1,
}: {
  section1: {
    title: React.ReactNode;
    description: React.ReactNode;
    sources?: string[];
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { title: title1, description: description1 } = section1;

  // Safari video playback fix
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Force play for Safari
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Video autoplay failed:", error);
        }
      };

      // Try to play immediately
      playVideo();

      // Also try on user interaction (Safari requirement)
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

  // Professional approach: Pin the video and animate title
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Store references to created animations for cleanup
    let scrollTrigger: ScrollTrigger | null = null;
    let timeline: gsap.core.Timeline | null = null;

    // Only run if refs are available
    if (titleRef.current && containerRef.current) {
      // Set initial state
      gsap.set(titleRef.current, {
        y: "100vh",
        opacity: 0,
        display: "flex",
      });

      // Create timeline
      timeline = gsap.timeline();
      timeline
        .to(titleRef.current, {
          y: 0,
          opacity: 1,
          duration: 10,
          display: "flex",
          ease: "power2.out",
        })
        .to(titleRef.current, {
          y: "-100vh",
          opacity: 0,
          duration: 10,
          ease: "power2.in",
        });

      // Create ScrollTrigger
      scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=600vh",
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        scrub: 0.3,
        animation: timeline,
      });
    }

    // Cleanup function
    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      if (timeline) {
        timeline.kill();
      }
      // Clear any set properties on the title element
      if (titleRef.current) {
        gsap.set(titleRef.current, { clearProps: "all" });
      }
    };
  }, []);

  return (
    <>
      {/* Hero Container - this gets scrolled past */}
      <div ref={containerRef} className="relative flex h-screen w-full">
        {/* Video Background - this gets PINNED */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          controls={false}
        >
          <source src="/Hero/heroVid3.mp4" type="video/mp4" />
          <source src="/Hero/heroVid3.MOV" type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div
          ref={titleRef}
          className="hidden fixed inset-0 w-full items-center justify-center rounded-xl z-1"
        >
          <div className="flex flex-col gap-20">
            <div className="flex h-screen items-center justify-center">
              <TitleSection
                title={title1}
                description={description1}
                titleClassName="font-courier-prime text-4xl font-bold gradient-text text-center rounded-xl"
                descriptionClassName="font-courier-prime text-lg text-white text-start rounded-xl"
                containerClassName="hero-section-title-section flex flex-col justify-start gap-5 w-full max-w-2xl px-10 py-10 px-5 rounded-xl"
                shouldAnimate={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
