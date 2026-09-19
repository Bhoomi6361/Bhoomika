import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Microscope,
  SlidersHorizontal,
  BookOpen,
  History,
  Info,
  Sprout,
  ShieldCheck,
  Play,
  Loader2,
  Check
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'assessment'
  | 'scientist'
  | 'simulator'
  | 'knowledge'
  | 'history'
  | 'methodology';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  onLoadDemo: () => void;
  isLoadingDemo?: boolean;
  demoLoaded?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  onLoadDemo,
  isLoadingDemo = false,
  demoLoaded = false
}) => {
  const navItems = [
    {
      id: 'dashboard' as PageId,
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Biodiversity health & indicators'
    },
    {
      id: 'assessment' as PageId,
      label: 'Environmental Assessment',
      icon: ClipboardList,
      desc: 'Structured & JSON inputs'
    },
    {
      id: 'scientist' as PageId,
      label: 'AI Environmental Scientist',
      icon: Microscope,
      highlight: true,
      desc: 'Central reasoning conversation'
    },
    {
      id: 'simulator' as PageId,
      label: 'Scenario Simulator',
      icon: SlidersHorizontal,
      desc: 'Compare land interventions'
    },
    {
      id: 'knowledge' as PageId,
      label: 'Knowledge Base',
      icon: BookOpen,
      desc: 'FAO, IPCC & peer-reviewed data'
    },
    {
      id: 'history' as PageId,
      label: 'Assessment History',
      icon: History,
      desc: 'Saved records & comparisons'
    },
    {
      id: 'methodology' as PageId,
      label: 'About / Methodology',
      icon: Info,
      desc: 'System architecture & guidelines'
    }
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-64 md:w-72 bg-emerald-950 text-emerald-100 flex flex-col shrink-0 border-r border-emerald-800/60 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-emerald-800/70">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/80 text-emerald-100 flex items-center justify-center shadow-inner border border-emerald-500/30 shrink-0">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-tight">
              Darukaa<span className="text-emerald-400">.Earth</span>
            </h1>
            <p className="text-[11px] text-emerald-300/80 font-medium tracking-wide uppercase">
              AI Biodiversity Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-emerald-800/90 text-white font-medium shadow-sm border border-emerald-600/40'
                  : 'text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  isActive ? 'text-emerald-300' : 'text-emerald-400/70'
                } ${item.highlight && !isActive ? 'text-amber-300' : ''}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium leading-snug">{item.label}</span>
                  {item.highlight && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Core
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-400/60 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Demo Action & Grounding Badge */}
      <div className="p-3.5 border-t border-emerald-800/70 bg-emerald-950/60 space-y-3">
        <button
          id="btn-load-demo-scenario"
          onClick={onLoadDemo}
          disabled={isLoadingDemo}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition border shadow-sm active:scale-[0.98] ${
            isLoadingDemo
              ? 'bg-emerald-900/80 text-emerald-300 border-emerald-700/60 cursor-wait'
              : demoLoaded
              ? 'bg-emerald-600 text-white border-emerald-400/80 ring-1 ring-emerald-400/50'
              : 'bg-emerald-700/80 hover:bg-emerald-700 text-white border-emerald-500/40'
          }`}
        >
          {isLoadingDemo ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300" />
              <span>Analyzing Scenario...</span>
            </>
          ) : demoLoaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-200" />
              <span>Challenge Demo Loaded!</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-emerald-200" />
              <span>Load Challenge Demo Case</span>
            </>
          )}
        </button>

        <div className="bg-emerald-900/40 rounded-lg p-2.5 border border-emerald-800/60 text-[11px] space-y-1.5 text-emerald-300/80">
          <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Scientist Protocol Active</span>
          </div>
          <p className="leading-relaxed text-emerald-300/70">
            Multi-variable reasoning grounded in FAO, IPCC, UNEP & IUCN scientific literature.
          </p>
        </div>
      </div>
    </aside>
  );
};
