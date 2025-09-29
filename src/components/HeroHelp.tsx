"use client";
import React from "react";
import ShopButton from "./ShopButton";
import DonateButton from "./DonateButton";
import { animateTextScroll, animateCardsScroll } from "@/lib/utils";
import { useGSAP } from "@gsap/react";

const HeroHelp = ({
  section3,
}: {
  section3: {
    title: React.ReactNode;
    description: { href: string; label: string }[];
  };
}) => {
  const { title, description } = section3;

  useGSAP(() => {
    const textToAnimate = [".title-section", ".sub-title-2"];
    const cardsToAnimate = [".help-card", ".shopButtonTwo", ".donateButtonTwo"];

    animateTextScroll({
      targets: textToAnimate,
      shouldAnimateClass: true,
      animateClass: "dark-gradient-text",
      type: "words",
      duration: 1,
      ease: "power2.inOut",
      opacity: 0,
      y: 100,
      stagger: 0.1,
      scrollTrigger: {
        start: "top 90%",
        end: "bottom 90%",
        scrub: 0.3,
      },
    });

    animateCardsScroll({
      targets: cardsToAnimate,
      duration: 1,
      ease: "power2.inOut",
      opacity: 0,
      y: 100,
      stagger: 0.1,
      scrollTrigger: {
        start: "top 90%",
        end: "bottom 90%",
        scrub: 0.3,
      },
    });
  });

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-32 px-5 md:px-20 bg-gradient-to-br bg-primary-200 min-h-screen">
      {/* Main Title Section */}
      <div className="flex w-full justify-center">
        <h1 className="title-section font-courier-prime text-6xl md:text-8xl font-bold text-center dark-gradient-text">
          {title}
        </h1>
      </div>

      {/* Support Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {description.map((item, index) => (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            key={`support-${index}`}
            className="help-card group flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-secondary-800/80 to-primary-800/80 border border-secondary-600/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:from-secondary-700/80 hover:to-primary-700/80 hover:scale-105 hover:-translate-y-2"
          >
            {/* Icon placeholder - you can add icons later */}
            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300">
              <span className="text-2xl font-bold text-white">{index + 1}</span>
            </div>

            {/* Description */}
            <h2 className="font-courier-prime text-xl md:text-2xl font-bold text-center text-slate-200 group-hover:text-white transition-colors duration-300">
              {item.label}
            </h2>

            {/* Hover effect line */}
            <div className="w-0 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mt-4 group-hover:w-full transition-all duration-500 rounded-full"></div>
          </a>
        ))}
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-8">
        <div className="flex flex-col gap-10 items-center">
          <h3 className="sub-title-2 font-courier-prime text-2xl font-bold text-center dark-gradient-text">
            Ready to make a difference?
          </h3>
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <ShopButton
              title="Shop Now"
              containerClassName="flex w-full md:w-auto text-center"
              titleClassName="shopButtonTwo text-center text-xl w-full px-8 py-4"
            />
            <DonateButton
              title="Donate"
              containerClassName="flex w-full md:w-auto text-center"
              titleClassName="donateButtonTwo text-center text-xl w-full px-8 py-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHelp;
