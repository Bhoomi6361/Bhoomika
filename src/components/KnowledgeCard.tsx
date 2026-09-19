import React from 'react';
import { RetrievedKnowledgeItem } from '../types/environmental';
import { ExternalLink, BookCheck, ShieldCheck, Tag } from 'lucide-react';

interface KnowledgeCardProps {
  item: RetrievedKnowledgeItem;
  compact?: boolean;
  showWhyRelevant?: boolean;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  item,
  compact = false,
  showWhyRelevant = true
}) => {
  return (
    <div
      id={`knowledge-card-${item.id}`}
      className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs transition hover:border-emerald-300 flex flex-col justify-between gap-3 text-stone-800"
    >
      <div className="space-y-2">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <span className="font-mono font-semibold text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
            {item.id}
          </span>

          <span className="font-medium text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <BookCheck className="w-3 h-3 text-emerald-600" />
            {item.source} ({item.year})
          </span>
        </div>

        {/* Title */}
        <h4 className="font-bold text-sm text-stone-900 leading-snug">
          {item.title}
        </h4>

        {/* Topic & Condition */}
        <div className="text-xs text-stone-600 space-y-1">
          <div className="font-medium text-emerald-900">
            Topic: <span className="font-normal text-stone-700">{item.topic}</span>
          </div>
          <div className="font-medium text-stone-700">
            Condition: <span className="font-normal text-stone-600">{item.condition}</span>
          </div>
        </div>

        {/* Why relevant section if requested */}
        {showWhyRelevant && item.whyRelevant && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 text-xs text-amber-900 space-y-0.5">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-700" />
              Why It Was Retrieved
            </span>
            <p className="text-[11px] leading-relaxed text-amber-950">
              {item.whyRelevant}
            </p>
          </div>
        )}

        {/* Scientific Mechanism (if not compact) */}
        {!compact && (
          <div className="text-xs space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
            <span className="font-semibold text-stone-700 block">Scientific Mechanism:</span>
            <p className="text-stone-600 leading-relaxed text-[11px]">{item.mechanism}</p>
          </div>
        )}

        {/* Expected effect & evidence quote */}
        {!compact && (
          <div className="text-[11px] text-stone-500 italic border-l-2 border-emerald-500 pl-2">
            "{item.evidence}"
          </div>
        )}
      </div>

      {/* Footer: Variables & Source Link */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1 flex-wrap">
          {item.environmentalVariables.slice(0, 3).map((v, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200/60"
            >
              {v}
            </span>
          ))}
          {item.environmentalVariables.length > 3 && (
            <span className="text-[10px] text-stone-400">
              +{item.environmentalVariables.length - 3} more
            </span>
          )}
        </div>

        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition"
          >
            <span>Read Study</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
