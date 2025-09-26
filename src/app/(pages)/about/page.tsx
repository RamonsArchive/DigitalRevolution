import React from "react";
import AboutPageClient from "@/components/AboutPageClient";
import { ABOUT_DATA } from "@/constants";

const AboutPage = () => {
  const aboutData = ABOUT_DATA;
  return <AboutPageClient aboutData={aboutData} />;
};

export default AboutPage;
