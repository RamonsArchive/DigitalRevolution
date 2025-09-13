import { HOME_TEXT_SECTIONS } from "@/constants";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection section1={HOME_TEXT_SECTIONS.section1} />
      {/* Next Section - this will be scrollable after title reaches apex */}

      <div className="flex items-center justify-center h-screen bg-neutral-900 w-full mt-[calc(100dvh-42px)]">
        <h2 className="text-2xl text-white">Next Section - Now Scrollable!</h2>
      </div>
    </>
  );
}
