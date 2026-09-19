import React from 'react';
import { Sparkles, Database, ShieldAlert, Cpu } from 'lucide-react';
import { PageId } from './Sidebar';

interface HeaderProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  activeEcosystem?: string;
  hasAssessmentData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onSelectPage,
  activeEcosystem,
  hasAssessmentData
}) => {
  const getPageInfo = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return {
          title: 'Executive Biodiversity & Environmental Dashboard',
          subtitle: 'Multi-variable ecological telemetry, risk synthesis, and intervention readiness'
        };
      case 'assessment':
        return {
          title: 'Structured Environmental Assessment Form',
          subtitle: 'Unified parameter capture across soil, climate, water, land use, and biodiversity metrics'
        };
      case 'scientist':
        return {
          title: 'AI Environmental Scientist (Conversational Intelligence)',
          subtitle: 'Multi-turn reasoning, clarifying inquiry, variable memory, and scientific evidence grounding'
        };
      case 'simulator':
        return {
          title: 'Environmental Scenario Simulator',
          subtitle: 'Compare baseline conditions against proposed agro-ecological interventions'
        };
      case 'knowledge':
        return {
          title: 'Peer-Reviewed Environmental Knowledge Base',
          subtitle: 'Retrievable scientific repository with FAO, IPCC, UNEP, and IUCN literature indexing'
        };
      case 'history':
        return {
          title: 'Environmental Assessment History & Comparisons',
          subtitle: 'Audit past multi-variable assessments and compare ecological trajectories'
        };
      case 'methodology':
        return {
          title: 'System Architecture & Scientific Methodology',
          subtitle: 'Darukaa.Earth AI challenge compliance, 6-pillar reasoning matrix, and anti-hallucination protocols'
        };
    }
  };

  const info = getPageInfo(activePage);

  return (
    <header
      id="app-header"
      className="bg-white border-b border-stone-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0"
    >
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          {info.title}
        </h2>
        <p className="text-xs text-stone-500 mt-0.5 max-w-3xl">
          {info.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Active Context Badge */}
        {hasAssessmentData && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="truncate max-w-[180px]">
              {activeEcosystem || 'Loaded Ecosystem'}
            </span>
          </div>
        )}

        {/* AI & Knowledge Base Status Indicators */}
        <div className="flex items-center gap-2 text-xs">
          <div
            title="12 peer-reviewed studies and global institutional reports indexed"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px]"
          >
            <Database className="w-3.5 h-3.5 text-stone-500" />
            <span>RAG Active (12 Studies)</span>
          </div>

          <div
            title="Reasoning engine requires at least 3 interacting environmental metrics"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px]"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Metric Engine</span>
          </div>
        </div>
      </div>
    </header>
  );
};
