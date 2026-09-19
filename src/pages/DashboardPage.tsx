import React from 'react';
import {
  EnvironmentalAssessment,
  EnvironmentalInput
} from '../types/environmental';
import { MetricCard } from '../components/MetricBadge';
import { RecommendationCard } from '../components/RecommendationCard';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { ReasoningFactorsBadge } from '../components/ReasoningFactorsBadge';
import {
  Sprout,
  Droplets,
  Activity,
  Trees,
  SunMedium,
  Factory,
  ArrowRight,
  ClipboardList,
  Microscope,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface DashboardPageProps {
  assessment: EnvironmentalAssessment | null;
  onNavigate: (page: PageId) => void;
  onLoadDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  assessment,
  onNavigate,
  onLoadDemo
}) => {
  const scores = assessment?.scores;
  const input = assessment?.input;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Assessment Summary */}
      {assessment ? (
        <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800/80 space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                Active Assessment Telemetry
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="dash-btn-reload-demo"
                onClick={onLoadDemo}
                className="px-3 py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600/50 shadow-xs transition flex items-center gap-1.5 active:scale-95"
                title="Reload the official Darukaa.Earth semi-arid wheat monoculture challenge benchmark"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                <span>Reload Challenge Demo</span>
              </button>
              <span className="text-xs font-mono text-emerald-300/80 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/80">
                {new Date(assessment.timestamp).toLocaleDateString()} • {assessment.input.region || 'Active Biome'}
              </span>
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
            {assessment.title}
          </h3>

          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-4xl">
            {assessment.reasoningSummary}
          </p>

          {/* Quick parameter summary pill bar */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-emerald-200">
            <span className="px-2.5 py-1 rounded-md bg-emerald-800/80 border border-emerald-700/60">
              SOC: <strong className="text-white">{input?.soil?.organic_carbon_percent ?? 'N/A'}%</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-800/80 border border-emerald-700/60">
              Rainfall: <strong className="text-white">{input?.rainfall || 'N/A'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-800/80 border border-emerald-700/60">
              Land Use: <strong className="text-white">{input?.land_use || 'N/A'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-800/80 border border-emerald-700/60">
              Water: <strong className="text-white capitalize">{input?.water_availability || 'N/A'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-800/80 border border-emerald-700/60">
              Habitat: <strong className="text-white capitalize">{input?.habitat_diversity || 'N/A'}</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>No Active Environmental Data Loaded</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Begin by Assessing an Ecosystem or Running the Challenge Demo
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Darukaa.Earth requires at least three interacting environmental variables (such as soil carbon, rainfall, and land use) to initiate scientific multi-metric reasoning.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              id="dash-btn-load-demo"
              onClick={onLoadDemo}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
            >
              Load Challenge Demo (Semi-Arid Wheat)
            </button>
            <button
              id="dash-btn-open-assessment"
              onClick={() => onNavigate('assessment')}
              className="px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 transition"
            >
              Enter New Land Data
            </button>
          </div>
        </div>
      )}

      {/* 6 Core Scientific Indicators */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Core Environmental Indicators
          </h3>
          <span className="text-xs text-stone-400 font-medium">
            Standardized 0–100 Ecological Health Index
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            id="metric-overall-biodiversity"
            title="Overall Biodiversity"
            value={scores?.overallBiodiversityHealth}
            icon={Activity}
            description="Multi-metric synthesis of soil, habitat & species richness"
          />

          <MetricCard
            id="metric-soil-health"
            title="Soil Health"
            value={scores?.soilHealth}
            icon={Sprout}
            description="Calculated from SOC, pH, and moisture buffering"
          />

          <MetricCard
            id="metric-water-availability"
            title="Water Availability"
            value={scores?.waterAvailabilityScore}
            icon={Droplets}
            description="Precipitation index, groundwater & surface resilience"
          />

          <MetricCard
            id="metric-habitat-quality"
            title="Habitat Quality"
            value={scores?.habitatQuality}
            icon={Trees}
            description="Landscape complexity, vegetative layers & patch sizes"
          />

          <MetricCard
            id="metric-climate-stress"
            title="Climate Stress"
            value={scores?.climateStress}
            icon={SunMedium}
            inverted={true}
            description="Thermal anomalies, drought frequency & VPD pressure"
          />

          <MetricCard
            id="metric-human-impact"
            title="Human Disruption"
            value={scores?.humanImpact}
            icon={Factory}
            inverted={true}
            description="Agrochemical ecotoxicity, monoculture & tree clearing"
          />
        </div>
      </div>

      {/* Reasoning Factors & Interdependent Mechanisms */}
      {assessment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ReasoningFactorsBadge reasoning={assessment.reasoningFactors} />

            {/* Evidence-backed Recommendations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Evidence-Backed Recommendations ({assessment.recommendations.length})
                </h3>
                <span className="text-xs text-stone-500">
                  Grounded in retrieved peer-reviewed scientific studies
                </span>
              </div>

              <div className="space-y-4">
                {assessment.recommendations.map((rec, i) => (
                  <RecommendationCard key={rec.id} rec={rec} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Retrieved Knowledge & Scientist Callout */}
          <div className="space-y-6">
            {/* Ask AI Scientist Prompt Card */}
            <div className="bg-stone-900 text-stone-100 rounded-xl p-5 border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                <Microscope className="w-4 h-4" />
                <span>AI Environmental Scientist</span>
              </div>
              <h4 className="font-bold text-base text-white">
                Investigate with Conversational Memory
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Consult the scientist to explore soil microbial dynamics, calculate cover crop seed ratios, or test hypothetical rainfall shocks.
              </p>
              <button
                onClick={() => onNavigate('scientist')}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Launch Scientist Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Retrieved Knowledge Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
                  Retrieved Knowledge ({assessment.retrievedKnowledge.length})
                </h3>
              </div>

              <div className="space-y-3">
                {assessment.retrievedKnowledge.map(item => (
                  <KnowledgeCard key={item.id} item={item} compact={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
