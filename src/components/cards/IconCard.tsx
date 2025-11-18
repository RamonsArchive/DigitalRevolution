import React from "react";

interface IconCardProps {
  icon: string;
  title: string;
  content: string | React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  iconClassName?: string;
}

const IconCard: React.FC<IconCardProps> = ({
  icon,
  title,
  content,
  gradientFrom = "from-primary-500/10",
  gradientTo = "to-secondary-500/10",
  className = "",
  iconClassName = "",
}) => {
  return (
    <div className={`group relative h-full flex flex-col ${className}`}>
      <div
        className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-400/50 overflow-hidden flex flex-col h-full`}
      >
        {/* Gradient overlay using ::before - matches card height exactly */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative flex items-start gap-6 flex-grow">
          <div
            className={`w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300 ${iconClassName}`}
          >
            <span className="text-lg">{icon}</span>
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-primary-200 transition-colors">
              {title}
            </h3>
            <div className="text-slate-300 leading-relaxed text-lg flex-grow">
              {typeof content === "string" ? <p>{content}</p> : content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconCard;
