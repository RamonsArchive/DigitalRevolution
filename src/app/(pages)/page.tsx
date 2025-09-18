import { HOME_TEXT_SECTIONS } from "@/constants";
import HeroSection from "@/components/HeroSection";
import ShopButton from "@/components/ShopButton";
import DonateButton from "@/components/DonateButton";
import HeroFacts from "@/components/HeroFacts";
import HeroHelp from "@/components/HeroHelp";

export default function Home() {
  const { section1, section2, section3 } = HOME_TEXT_SECTIONS;
  return (
    <>
      <HeroSection section1={section1} />
      {/* Next Section - this will be scrollable after title reaches apex */}
      <HeroFacts section2={section2} />
      <HeroHelp section3={section3} />
    </>
  );
}
