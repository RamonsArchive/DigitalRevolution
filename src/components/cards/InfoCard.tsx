import React from "react";

interface InfoCardProps {
  icon: string;
  title: string;
  description: string | React.ReactNode;
  children?: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  borderColor?: string;
  iconBgClassName?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  description,
  children,
  gradientFrom = "from-primary-500",
  gradientTo = "to-secondary-500",
  className = "",
  borderColor = "border-primary-500/30",
  iconBgClassName = "bg-gradient-to-r from-primary-500 to-secondary-500",
}) => {
  return (
    <div className={`group relative ${className}`}>
      <div
        className={`relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 border ${borderColor} shadow-2xl transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary-400/50 overflow-hidden`}
      >
        {/* Gradient overlay - matches card height exactly */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none blur-sm`}
        />

        <div className="relative">
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 ${iconBgClassName} rounded-2xl flex items-center justify-center mx-auto mb-6`}
            >
              <span className="text-3xl">{icon}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent mb-4">
              {title}
            </h2>
            {description && (
              <div className="text-slate-300 text-lg font-medium leading-relaxed max-w-3xl mx-auto">
                {description}
              </div>
            )}
          </div>
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
