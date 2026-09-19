import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: number | null | undefined; // 0 to 100 or null
  label?: string;
  icon: LucideIcon;
  description?: string;
  inverted?: boolean; // true for stress or impact where higher is worse
  category?: 'soil' | 'water' | 'biodiversity' | 'climate' | 'human';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  label,
  icon: Icon,
  description,
  inverted = false
}) => {
  if (value === null || value === undefined) {
    return (
      <div
        id={id}
        className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col justify-between shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">{title}</span>
          <div className="p-1.5 rounded-lg bg-stone-100 text-stone-400">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="my-4">
          <span className="text-sm italic font-medium text-stone-400">No data available.</span>
        </div>
        <div className="text-[11px] text-stone-400">
          Provide inputs via Assessment form or AI Scientist.
        </div>
      </div>
    );
  }

  // Calculate status level
  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-600';
  let statusText = 'Optimal';

  if (!inverted) {
    // Higher is better
    if (value >= 75) {
      statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      barColor = 'bg-emerald-600';
      statusText = 'High / Resilient';
    } else if (value >= 45) {
      statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
      barColor = 'bg-amber-500';
      statusText = 'Moderate / Vulnerable';
    } else {
      statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
      barColor = 'bg-rose-600';
      statusText = 'Critical / Degraded';
    }
  } else {
    // Inverted: higher is worse (Stress or Impact)
    if (value >= 70) {
      statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
      barColor = 'bg-rose-600';
      statusText = 'Severe Stress';
    } else if (value >= 40) {
      statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
      barColor = 'bg-amber-500';
      statusText = 'Elevated Pressure';
    } else {
      statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      barColor = 'bg-emerald-600';
      statusText = 'Low / Controlled';
    }
  }

  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col justify-between shadow-xs transition hover:border-stone-300"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">{title}</span>
        <div className="p-1.5 rounded-lg bg-stone-100 text-stone-600">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="my-3 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-stone-900">{value}</span>
          <span className="text-xs text-stone-400 font-medium">/100</span>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
          {label || statusText}
        </span>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-1.5">
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
          />
        </div>
        {description && (
          <p className="text-[11px] text-stone-500 leading-tight">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
