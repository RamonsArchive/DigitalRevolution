"use client";
import React from "react";
import ShopButton from "./ShopButton";
import DonateButton from "./DonateButton";
import { useGSAP } from "@gsap/react";
import { animateTextScroll, animateCardsScroll } from "@/lib/utils";

interface HeroFactsProps {
  section2: {
    title: React.ReactNode;
    description: React.ReactNode[];
    sources: { title: string; href: string }[];
  };
}
const HeroFacts = ({ section2 }: HeroFactsProps) => {
  useGSAP(() => {
    const textToAnimate = [".section-title", ".sub-title"];
    const cardsToAnimate = [
      ".fact-card",
      ".source-card",
      ".shopButtonOne",
      ".donateButtonOne",
    ];

    animateTextScroll({
      targets: textToAnimate,
      animateClass: "gradient-text",
      type: "words",
      duration: 1,
      ease: "power2.inOut",
      delay: 0,
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
      delay: 0,
      opacity: 0,
      y: 100,
      stagger: 0.1,
      scrollTrigger: {
        start: "top 90%",
        end: "bottom 90%",
        scrub: 0.3,
      },
    });
  }, []);
  return (
    <div className="flex flex-col gap-10 md:gap-20 py-32 px-5 md:px-20 bg-gradient-to-br from-neutral-900 via-slate-800 to-neutral-900 w-full min-h-screen">
      <h2 className="section-title">{section2.title}</h2>
      <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start">
        <div className="flex flex-col gap-8 w-full md:w-[65%]">
          <ul className="font-courier-prime text-xl md:text-2xl text-slate-50 list-disc list-inside space-y-8 leading-relaxed">
            {section2.description.map((item, index) => (
              <li
                key={`description-${index}`}
                className="fact-card pl-6 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-slate-700/60 hover:to-slate-600/40"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6 flex-1 w-full md:w-auto">
          <div className="source-card p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-cyan-800/20 border border-blue-500/30 shadow-lg">
            <h3 className="font-courier-prime font-bold text-3xl text-blue-100 mb-6 text-center">
              Sources
            </h3>
            <ul className="flex flex-col gap-5">
              {section2.sources.map(({ title, href }, index) => (
                <li
                  key={`source-${index}-${title.slice(0, 10)}`}
                  className="pl-4"
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base text-cyan-300 hover:text-cyan-200 underline decoration-cyan-400 decoration-2 underline-offset-4 transition-all duration-300 hover:bg-cyan-900/20 px-3 py-2 rounded-lg break-words hover:shadow-md inline-block"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sources-card flex w-full flex-col gap-6 p-6 rounded-2xl bg-gradient-to-br shadow-lg">
            <h1 className="sub-title font-courier-prime text-2xl text-center animated-gradient-text font-bold">
              Help address the digital divide
            </h1>
            <div className="flex flex-col gap-4 justify-start items-start w-full">
              <ShopButton
                title="Shop"
                containerClassName="flex w-full text-center max-w-lg"
                titleClassName="shopButtonOne text-center text-2xl w-full"
              />
              <DonateButton
                title="Donate"
                containerClassName="flex w-full text-center max-w-lg"
                titleClassName="donateButtonOne text-center text-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFacts;
