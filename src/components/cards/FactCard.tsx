import React from "react";

interface FactCardProps {
  icon?: string;
  fact: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

const FactCard: React.FC<FactCardProps> = ({
  icon,
  fact,
  gradientFrom = "from-primary-500/20",
  gradientTo = "to-secondary-500/20",
  className = "",
}) => {
  return (
    <div className={`group relative h-full flex flex-col ${className}`}>
      <div
        className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-400/50 overflow-hidden flex flex-col h-full`}
      >
        {/* Gradient overlay - matches card height exactly */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative flex items-start gap-4 flex-grow">
          {icon && (
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
              <span className="text-2xl">{icon}</span>
            </div>
          )}
          <div className="flex-1 flex flex-col">
            <div className="text-slate-200 leading-relaxed text-lg flex-grow">
              {fact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactCard;
