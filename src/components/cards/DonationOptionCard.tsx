import React from "react";

interface DonationOptionCardProps {
  id: string;
  title: string;
  description: string;
  subText?: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const DonationOptionCard: React.FC<DonationOptionCardProps> = ({
  id,
  title,
  description,
  subText,
  icon,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <div className={`group relative h-full flex flex-col ${className}`}>
      <div
        className={`relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer overflow-hidden flex flex-col h-full ${
          isSelected
            ? "border-emerald-500/50 shadow-emerald-500/20"
            : "border-slate-700/50 group-hover:shadow-2xl group-hover:border-primary-400/50"
        }`}
        onClick={onClick}
      >
        {/* Gradient overlay - matches card height exactly */}
        <div
          className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none ${
            isSelected
              ? "bg-linear-to-r from-emerald-500/40 to-cyan-500/40 opacity-100"
              : "bg-linear-to-r from-primary-500/10 to-secondary-500/10 group-hover:opacity-100"
          }`}
        />

        <div className="relative text-center flex flex-col h-full">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition duration-300 ${
              isSelected
                ? "icon-chip icon-chip-emerald scale-105"
                : "icon-chip group-hover:scale-105"
            }`}
          >
            {icon || (
              <span className="text-2xl">
                {id === "one-time" ? "💳" : "🔄"}
              </span>
            )}
          </div>
          <h4
            className={`text-xl font-bold mb-3 transition-colors ${
              isSelected
                ? "text-emerald-200"
                : "text-slate-100 group-hover:text-primary-200"
            }`}
          >
            {title}
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed mb-3 grow">
            {description}
          </p>
          {subText && (
            <p className="text-slate-400 text-xs italic">{subText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationOptionCard;
