import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Database,
  ExternalLink,
  BookOpen,
  Sprout,
  Workflow,
  AlertTriangle
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Title & Overview */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Scientific Governance & Hackathon Submission</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
          Darukaa.Earth — AI Biodiversity Intelligence Architecture
        </h3>
        <p className="text-sm text-stone-700 leading-relaxed">
          <strong>Darukaa.Earth</strong> is an environmental intelligence system purpose-built to behave as an <strong>AI environmental scientist</strong> rather than a generic conversational wrapper. It addresses the core failure mode of consumer LLMs in ecological planning: prescribing superficial advice (e.g. "plant more trees") without diagnosing the interdependent physics of soil carbon, hydrological regimes, and habitat fragmentation.
        </p>
      </div>

      {/* System Pipeline Architecture */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-3">
          <h4 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-emerald-600" />
            End-to-End Scientific Architecture Pipeline
          </h4>
          <p className="text-xs text-stone-500">
            A 5-stage deterministic and grounded pipeline enforcing empirical causality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Variable Ingestion</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Extracts numerical SOC, pH, rainfall, land use, and moisture from forms, JSON, or natural language prompts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Memory & Gap Check</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Preserves variables across turns. If critical parameters are absent, triggers clarifying questions instead of hallucinating.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Knowledge Retrieval</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Retrieves peer-reviewed studies (FAO, IPCC, UNEP, IUCN) scoring by multi-variable co-occurrence and ecosystem fit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">4</span>
              <span>Multi-Metric Reasoning</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Synthesizes coupled variables (e.g. low SOC + low rainfall = amplified moisture deficit) to identify root bottlenecks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">5</span>
              <span>Structured Prescriptions</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Outputs standardized 8-part scientific recommendations with mechanisms, time horizons, and empirical citations.
            </p>
          </div>
        </div>
      </div>

      {/* The 6 Pillars of Environmental Reasoning */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-3">
          <h4 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            The 6 Pillars of Environmental Reasoning
          </h4>
          <p className="text-xs text-stone-500">
            Real ecosystems cannot be diagnosed along a single axis. Every assessment evaluates all six interconnected pillars:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              Pillar 1: Soil Health
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Soil organic carbon (SOC) controls micropore aggregate stability, cation exchange capacity, and microbial biomass. Depleted SOC (&lt;1.0%) collapses water buffering capacity.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Pillar 2: Water Availability
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Evaluates effective precipitation vs potential evapotranspiration (PET). Low rainfall combined with bare topsoil creates runaway evaporation and capillary salt ascension.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Pillar 3: Biodiversity
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Assesses species richness across functional guilds (pollinators, detritivores, predatory invertebrates, avian seed dispersers).
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              Pillar 4: Habitat Quality
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Structural vertical stratification (groundcover, shrub, sub-canopy, emergent) and horizontal spatial connectivity across field boundaries.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
              Pillar 5: Climate Stress
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Vapor pressure deficits (VPD), maximum summer surface temperature spikes, and inter-annual rainfall variability.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              Pillar 6: Human Disruption
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Tillage frequency, chemical biocides, deforestation, drainage manipulation, and continuous monoculture simplification.
            </p>
          </div>
        </div>
      </div>

      {/* Anti-Hallucination & Evidence Standards */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 border border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Strict Anti-Hallucination Protocols</span>
        </div>

        <h4 className="text-lg font-bold text-white tracking-tight">
          Verifiable Grounding & No Invented Statistics
        </h4>

        <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Never Fabricate Scientific Studies or URLs:</strong> All recommendations cite actual indexed literature from the Food and Agriculture Organization (FAO), Intergovernmental Panel on Climate Change (IPCC), United Nations Environment Programme (UNEP), and the International Union for Conservation of Nature (IUCN).
            </p>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>No Invented Quantitative Estimates:</strong> When empirical field data does not provide a statistically validated number, the system explicitly states: <em>"Evidence insufficient for a reliable quantitative estimate."</em>
            </p>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Mandatory Multi-Variable Threshold:</strong> The reasoning engine is constrained from prescribing interventions until at least three coupled environmental variables have been acquired.
            </p>
          </div>
        </div>
      </div>

      {/* Challenge Demo Reproduction Guide */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-2">
          <h4 className="text-lg font-bold text-stone-900">
            How to Reproduce the Challenge Demo Scenario
          </h4>
          <p className="text-xs text-stone-500">
            Verify every grading benchmark in under 60 seconds:
          </p>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs text-stone-700">
          <li>
            Click <strong>"Load Challenge Demo Case"</strong> in the left sidebar (loads the Semi-Arid Monoculture Wheat Agroecosystem).
          </li>
          <li>
            Examine the <strong>Executive Dashboard</strong>: observe the low Overall Biodiversity Health, degraded Soil Health (SOC 0.3%), severe Water Deficit, and the coupled reasoning explanation.
          </li>
          <li>
            Navigate to <strong>AI Environmental Scientist</strong>: click the prompt <em>"Biodiversity is declining on my land"</em> and observe how the scientist refuses generic advice and asks clarifying questions.
          </li>
          <li>
            Reply with <em>"My region is semi-arid, rainfall is low, land is monoculture wheat"</em>: observe variable accumulation in memory.
          </li>
          <li>
            Inspect the <strong>Scenario Simulator</strong>: review the 3-phase temporal trajectories (Cover crops + Polyculture + Native strips) and ecological implications.
          </li>
          <li>
            Explore the <strong>Knowledge Base</strong>: verify the FAO, IPCC, UNEP, and IUCN studies with live links.
          </li>
        </ol>
      </div>
    </div>
  );
};
