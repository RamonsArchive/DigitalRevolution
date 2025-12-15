import React from "react";

interface ImpactBreakdownCardProps {
  amount: string | number;
  impact: string;
  stemConnection: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

const ImpactBreakdownCard: React.FC<ImpactBreakdownCardProps> = ({
  amount,
  impact,
  stemConnection,
  gradientFrom = "from-primary-500/10",
  gradientTo = "to-secondary-500/10",
  className = "",
}) => {
  return (
    <div className={`group relative h-full flex flex-col ${className}`}>
      <div
        className={`relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-400/50 overflow-hidden flex flex-col h-full`}
      >
        {/* Gradient overlay - matches card height exactly */}
        <div
          className={`absolute inset-0 bg-linear-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative text-center flex flex-col h-full">
          <div className="w-16 h-16 icon-chip rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
            <span className="text-2xl font-bold text-primary-50">{amount}</span>
          </div>
          <h4 className="text-lg font-semibold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
            {impact}
          </h4>
          <div className="bg-slate-700/50 rounded-lg p-3 flex-grow">
            <p className="text-slate-400 text-xs font-semibold mb-1">
              STEM Impact:
            </p>
            <p className="text-slate-200 text-xs font-normal leading-relaxed">
              {stemConnection}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactBreakdownCard;
