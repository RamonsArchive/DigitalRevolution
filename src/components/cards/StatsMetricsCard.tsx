import React from "react";

interface StatMetric {
  number: string;
  label: string;
  description: string;
}

interface StatsMetricsCardProps {
  metrics: StatMetric[];
  className?: string;
}

const StatsMetricsCard: React.FC<StatsMetricsCardProps> = ({
  metrics,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {metrics.map((stat, idx) => (
        <div
          key={idx}
          className="stat-card w-full text-center bg-slate-800/70 border border-slate-700/60 rounded-2xl px-4 py-5 shadow-lg shadow-black/30 backdrop-blur-sm"
        >
          <div className="w-16 h-16 icon-chip rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary-50">
              {stat.number}
            </span>
          </div>
          <h4 className="text-base font-semibold text-slate-100 mb-1">
            {stat.label}
          </h4>
          <p className="text-slate-300 text-sm font-normal leading-relaxed">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsMetricsCard;
