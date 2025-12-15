import React from "react";

interface PathwayCardProps {
  icon?: string;
  step?: number;
  title: string;
  description: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  iconGradientFrom?: string;
  iconGradientTo?: string;
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  icon,
  step: _step, // eslint-disable-line @typescript-eslint/no-unused-vars
  title,
  description,
  gradientFrom = "from-secondary-500/10",
  gradientTo = "to-primary-500/10",
  className = "",
  iconGradientFrom = "from-secondary-500",
  iconGradientTo = "to-primary-500",
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
          <div
            className={`w-16 h-16 icon-chip rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300`}
          >
            {icon && <span className="text-2xl text-primary-50">{icon}</span>}
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-3 group-hover:text-secondary-200 transition-colors">
            {title}
          </h3>
          <p className="text-slate-300 text-sm font-normal leading-relaxed flex-grow">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PathwayCard;
