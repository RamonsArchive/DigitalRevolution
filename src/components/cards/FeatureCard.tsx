import React from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  cardClassName?: string;
  borderColor?: string;
  centered?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradientFrom = "from-primary-500/10",
  gradientTo = "to-secondary-500/10",
  className = "",
  cardClassName = "bg-gradient-to-br from-slate-800/90 to-slate-900/90",
  borderColor = "border-slate-700/50",
  centered = true,
  iconSize = "md",
}) => {
  const iconSizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <div className={`group relative h-full flex flex-col ${className}`}>
      <div
        className={`relative ${cardClassName} backdrop-blur-sm rounded-2xl p-6 border ${borderColor} shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-400/50 overflow-hidden flex flex-col h-full`}
      >
        {/* Gradient overlay using ::before - matches card height exactly */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div
          className={`relative flex flex-col h-full ${centered ? "text-center" : ""}`}
        >
          <div
            className={`${iconSizeClasses[iconSize]} bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300`}
          >
            <span className="text-2xl">{icon}</span>
          </div>
          <h4 className="text-lg font-semibold text-slate-100 mb-3 group-hover:text-primary-200 transition-colors">
            {title}
          </h4>
          <div className="text-slate-300 text-sm font-normal leading-relaxed flex-grow">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
