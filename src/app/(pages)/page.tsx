import Image from "next/image";
import { HOME_TEXT_SECTIONS } from "@/constants";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full items-center justify-center overflow-y-auto">
        <HeroSection heroText={HOME_TEXT_SECTIONS} />
        {/* Next Section - this will be scrollable after title reaches apex */}
        <div className="flex items-center justify-center h-screen bg-neutral-900 w-full">
          <h2 className="text-2xl text-white">
            Next Section - Now Scrollable!
          </h2>
        </div>
      </div>
    </>
  );
}
