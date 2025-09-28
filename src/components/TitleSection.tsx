"use client";
import React from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";

interface TitleSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
}

gsap.registerPlugin(SplitText);
const TitleSection = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
  containerClassName,
}: TitleSectionProps) => {
  useGSAP(() => {
    const titleSplit = new SplitText(".title", { type: "chars" });
    gsap.set(titleSplit.chars, {
      opacity: 0,
      y: 100,
    });
    gsap.to(titleSplit.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 1,
      ease: "power2.inOut",
    });

    return () => {
      titleSplit.chars.forEach((char: Element) => {
        char.remove();
      });
    };
  });

  return (
    <div
      className={`title bg-gradient-to-b from-bg-primary via-secondary-900 to-bg-primary ${containerClassName}`}
    >
      <h1 className={`text-white ${titleClassName}`}>{title}</h1>
      <p className={`text-white/90 ${descriptionClassName}`}>{description}</p>
    </div>
  );
};

export default TitleSection;
