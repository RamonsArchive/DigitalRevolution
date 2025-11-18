import React from "react";

interface ImpactCardProps {
  icon: string;
  title: string;
  description: string;
  impactLabel?: string;
  impactContent?: string;
  stemLabel?: string;
  stemContent?: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
  iconGradientFrom?: string;
  iconGradientTo?: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({
  icon,
  title,
  description,
  impactLabel,
  impactContent,
  stemLabel,
  stemContent,
  gradientFrom = "from-primary-500/10",
  gradientTo = "to-secondary-500/10",
  className = "",
  layout = "horizontal",
  iconGradientFrom = "from-primary-500",
  iconGradientTo = "to-secondary-500",
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

        {layout === "horizontal" ? (
          <div className="relative flex items-start space-x-4 flex-grow">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${iconGradientFrom} ${iconGradientTo} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300`}
            >
              <span className="text-lg">{icon}</span>
            </div>
            <div className="flex-1 flex flex-col">
              <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
                {title}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {description}
              </p>
              {(impactLabel || stemLabel) && (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  {impactLabel && impactContent && (
                    <p className="text-slate-400 text-xs font-medium mb-1">
                      {impactLabel}:
                    </p>
                  )}
                  {impactContent && (
                    <p className="text-slate-200 text-xs leading-relaxed mb-2">
                      {impactContent}
                    </p>
                  )}
                  {stemLabel && stemContent && (
                    <>
                      <p className="text-slate-400 text-xs font-medium mb-1">
                        {stemLabel}:
                      </p>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {stemContent}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative text-center flex flex-col h-full">
            <div
              className={`w-16 h-16 bg-gradient-to-r ${iconGradientFrom} ${iconGradientTo} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300`}
            >
              <span className="text-2xl font-bold text-white">{icon}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
              {title}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-3 flex-grow">
              {description}
            </p>
            {(impactLabel || stemLabel) && (
              <div className="bg-slate-700/50 rounded-lg p-3">
                {impactLabel && impactContent && (
                  <p className="text-slate-400 text-xs font-medium mb-1">
                    {impactLabel}:
                  </p>
                )}
                {impactContent && (
                  <p className="text-slate-200 text-xs leading-relaxed mb-2">
                    {impactContent}
                  </p>
                )}
                {stemLabel && stemContent && (
                  <>
                    <p className="text-slate-400 text-xs font-medium mb-1">
                      {stemLabel}:
                    </p>
                    <p className="text-slate-200 text-xs leading-relaxed">
                      {stemContent}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactCard;
