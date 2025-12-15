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
        <div key={idx} className="stat-card text-center w-fit mx-auto">
          <div className="w-20 h-20 bg-linear-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">{stat.number}</span>
          </div>
          <h4 className="text-lg font-semibold text-slate-100 mb-2">
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
