import { HOME_TEXT_SECTIONS } from "@/constants";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  const { section2 } = HOME_TEXT_SECTIONS;
  return (
    <>
      <HeroSection section1={HOME_TEXT_SECTIONS.section1} />
      {/* Next Section - this will be scrollable after title reaches apex */}

      <div className="flex gap-10 py-20 px-10 bg-neutral-900 w-full">
        <h2 className="font-courier-prime font-boldtext-2xl text-slate-50">
          Here are the Facts!
        </h2>
        <div className="flex gap-5"></div>
      </div>
    </>
  );
}
