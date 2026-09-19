import React from 'react';
import { Recommendation } from '../types/environmental';
import {
  Sprout,
  Clock,
  Gauge,
  Sparkles,
  ExternalLink,
  BookOpenCheck,
  CheckCircle2,
  TrendingUp,
  Layers
} from 'lucide-react';

interface RecommendationCardProps {
  rec: Recommendation;
  index?: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ rec, index }) => {
  const getConfidenceColor = (conf: 'High' | 'Medium' | 'Low') => {
    switch (conf) {
      case 'High':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div
      id={`recommendation-card-${rec.id}`}
      className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4 hover:border-emerald-300 transition"
    >
      {/* Header bar: Title, Index, Confidence */}
      <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            {index !== undefined ? `#${index + 1}` : <Sprout className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-bold text-base text-stone-900 leading-tight">
              {rec.title}
            </h4>
            <span className="text-[11px] font-mono text-stone-400">{rec.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getConfidenceColor(
              rec.confidence
            )}`}
          >
            Confidence: {rec.confidence}
          </span>
        </div>
      </div>

      {/* Mandatory Section 1: RECOMMENDATION */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          RECOMMENDATION
        </span>
        <p className="text-sm font-medium text-stone-800 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/70">
          {rec.recommendation}
        </p>
      </div>

      {/* Mandatory Section 2: WHY IT WORKS */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          WHY IT WORKS (SCIENTIFIC EXPLANATION)
        </span>
        <p className="text-xs text-stone-700 leading-relaxed">
          {rec.whyItWorks}
        </p>
      </div>

      {/* Mandatory Section 3: ENVIRONMENTAL MECHANISM */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          ENVIRONMENTAL MECHANISM (CAUSAL RELATIONSHIP)
        </span>
        <p className="text-xs text-stone-700 leading-relaxed bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
          {rec.environmentalMechanism}
        </p>
      </div>

      {/* Mandatory Section 4 & 5: IMPACTED METRICS & TIME HORIZON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            IMPACTED METRICS
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {rec.impactedMetrics.map((metric, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-600" />
            TIME HORIZON
          </span>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
            {rec.timeHorizon}
          </div>
        </div>
      </div>

      {/* Mandatory Section 6: EXPECTED OUTCOME */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-emerald-600" />
          EXPECTED OUTCOME (EVIDENCE-GROUNDED ESTIMATE)
        </span>
        <p className="text-xs text-stone-800 bg-stone-50/90 p-2.5 rounded-lg border border-stone-200/80 font-mono text-[11px]">
          {rec.expectedOutcome}
        </p>
      </div>

      {/* Mandatory Section 8: EVIDENCE */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpenCheck className="w-3.5 h-3.5 text-emerald-700" />
          SUPPORTING EVIDENCE & STUDIES
        </span>

        <div className="space-y-2">
          {rec.evidence.map((ev, i) => (
            <div
              key={i}
              className="text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200/70 space-y-1"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-semibold text-stone-900">
                  {ev.source} ({ev.year})
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100/60 text-emerald-800 border border-emerald-200/50">
                  {ev.reliability}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 italic">
                "{ev.findingQuote}"
              </p>
              {ev.url && (
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium mt-1"
                >
                  <span>{ev.studyTitle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
