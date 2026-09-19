import React from 'react';
import { ReasoningFactors } from '../types/environmental';
import { AlertCircle, ArrowRight, GitFork, ShieldCheck } from 'lucide-react';

interface ReasoningFactorsProps {
  reasoning: ReasoningFactors;
  compact?: boolean;
}

export const ReasoningFactorsBadge: React.FC<ReasoningFactorsProps> = ({
  reasoning,
  compact = false
}) => {
  if (!reasoning || (!reasoning.factors.length && !reasoning.scientificRationale)) {
    return null;
  }

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <GitFork className="w-4 h-4 text-emerald-600" />
          Reasoning Factors (Multi-Variable Interaction)
        </span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          {reasoning.factors.length} Interacting Signals
        </span>
      </div>

      {/* Factors Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {reasoning.factors.map((factor, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-800 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{factor}</span>
          </div>
        ))}
      </div>

      {/* Scientific Rationale */}
      {reasoning.scientificRationale && (
        <div className="bg-white p-3 rounded-lg border border-stone-200/80 text-xs text-stone-700 space-y-1">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Interacting Ecological Rationale
          </div>
          <p className="leading-relaxed text-stone-700 text-xs">
            {reasoning.scientificRationale}
          </p>
        </div>
      )}

      {/* Detailed Interactions if not compact */}
      {!compact && reasoning.interactions && reasoning.interactions.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Causal Variable Coupling Mechanisms
          </span>
          <div className="space-y-2">
            {reasoning.interactions.map((inter, i) => (
              <div
                key={i}
                className="bg-white p-2.5 rounded-lg border border-stone-200/70 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                    <span>{inter.variables.join(' ↔ ')}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inter.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : inter.severity === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {inter.severity} Severity
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  <span className="font-medium text-stone-700">Mechanism: </span>
                  {inter.mechanism}
                </p>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  <span className="font-medium text-stone-700">Impact: </span>
                  {inter.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
