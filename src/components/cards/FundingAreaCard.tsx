import React from "react";

interface FundingAreaCardProps {
  percentage: string;
  area: string;
  description: string;
  stemImpact: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  iconGradientFrom?: string;
  iconGradientTo?: string;
}

const FundingAreaCard: React.FC<FundingAreaCardProps> = ({
  percentage,
  area,
  description,
  stemImpact,
  gradientFrom = "from-secondary-500/10",
  gradientTo = "to-primary-500/10",
  className = "",
  iconGradientFrom = "from-secondary-500",
  iconGradientTo = "to-primary-500",
}) => {
  return (
    <div className={`group relative h-full flex flex-col ${className}`}>
      <div
        className={`relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-secondary-500/30 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-400/50 overflow-hidden flex flex-col h-full`}
      >
        {/* Gradient overlay - matches card height exactly */}
        <div
          className={`absolute inset-0 bg-linear-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative flex items-start space-x-4 flex-grow">
          <div
            className={`w-12 h-12 icon-chip rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300`}
          >
            <span className="text-lg font-bold text-primary-50">{percentage}</span>
          </div>
          <div className="flex-1 flex flex-col">
            <h4 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-secondary-200 transition-colors">
              {area}
            </h4>
            <p className="text-slate-300 text-sm font-normal leading-relaxed mb-3">
              {description}
            </p>
            <div className="bg-slate-700/50 rounded-lg p-3 flex-grow">
              <p className="text-slate-400 text-xs font-semibold mb-1">
                STEM Impact:
              </p>
              <p className="text-slate-200 text-xs font-normal leading-relaxed">
                {stemImpact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingAreaCard;
