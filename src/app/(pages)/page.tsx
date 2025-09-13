import { HOME_TEXT_SECTIONS } from "@/constants";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  const { section2 } = HOME_TEXT_SECTIONS;
  return (
    <>
      <HeroSection section1={HOME_TEXT_SECTIONS.section1} />
      {/* Next Section - this will be scrollable after title reaches apex */}

      <div className="flex flex-col gap-10 md:gap-20 py-32 px-5 md:px-20 bg-gradient-to-br from-neutral-900 via-slate-800 to-neutral-900 w-full min-h-screen">
        <h2 className="font-courier-prime font-bold text-5xl md:text-7xl text-center bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
          {section2.title}
        </h2>
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start">
          <div className="flex flex-col gap-8 w-full md:w-[65%]">
            <ul className="font-courier-prime text-xl md:text-2xl text-slate-50 list-disc list-inside space-y-8 leading-relaxed">
              {section2.description.map((item, index) => (
                <li
                  key={index}
                  className="pl-6 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-slate-700/60 hover:to-slate-600/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 flex-1 w-full md:w-auto">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-cyan-800/20 border border-blue-500/30 shadow-lg">
              <h3 className="font-courier-prime font-bold text-3xl text-blue-100 mb-6 text-center">
                Sources
              </h3>
              <ul className="flex flex-col gap-5">
                {section2.sources.map(({ title, href }, index) => (
                  <li key={index} className="pl-4">
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
          </div>
        </div>
      </div>
    </>
  );
}
