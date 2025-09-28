import { HOME_TEXT_SECTIONS } from "@/constants";
import HeroSection from "@/components/HeroSection";
import HomePageClient from "../../components/HomePageClient";

export default function Home() {
  const homeData = HOME_TEXT_SECTIONS;
  return (
    <>
      <HeroSection section1={homeData.section1} />
      <HomePageClient homeData={homeData} />
    </>
  );
}
