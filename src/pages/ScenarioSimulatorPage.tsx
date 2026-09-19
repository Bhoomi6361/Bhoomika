import React, { useState, useEffect } from 'react';
import {
  EnvironmentalInput,
  ScenarioSimulation
} from '../types/environmental';
import {
  PRESET_INTERVENTIONS,
  runScenarioSimulation
} from '../reasoning/scenarioEngine';
import {
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Droplets,
  Sprout,
  Trees,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Play,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface ScenarioSimulatorPageProps {
  currentInput: EnvironmentalInput;
}

export const ScenarioSimulatorPage: React.FC<ScenarioSimulatorPageProps> = ({
  currentInput
}) => {
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([
    'Legume-based Cover Crops',
    'Crop Diversification / Strip Intercropping',
    'Native Flowering Vegetation Strips'
  ]);

  const [customInputText, setCustomInputText] = useState<string>('');
  const [simulation, setSimulation] = useState<ScenarioSimulation | null>(null);

  useEffect(() => {
    // Run initial simulation
    const sim = runScenarioSimulation(currentInput, selectedInterventions);
    setSimulation(sim);
  }, [currentInput, selectedInterventions]);

  const toggleIntervention = (item: string) => {
    setSelectedInterventions(prev => {
      if (prev.includes(item)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleAddCustom = () => {
    if (customInputText.trim()) {
      if (!selectedInterventions.includes(customInputText.trim())) {
        setSelectedInterventions(prev => [...prev, customInputText.trim()]);
      }
      setCustomInputText('');
    }
  };

  const applyPreset = (interventions: string[]) => {
    setSelectedInterventions(interventions);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Ecological Transition Modeling</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            Current Condition vs. Proposed Land Interventions
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Test agro-ecological interventions against your baseline parameters. The simulator projects directional trajectories across short-, medium-, and long-term biological horizons grounded in empirical agronomy.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Challenge Recommended Presets:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_INTERVENTIONS.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.interventions)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs border border-emerald-200 transition"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side: Current Baseline vs. Proposed Scenario Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baseline / Current Condition */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-500"></span>
              Current Baseline State
            </h4>
            <span className="text-xs font-mono text-stone-500">
              {currentInput.region || 'Semi-arid'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-stone-200/80">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">
                Soil Organic Carbon
              </span>
              <span className="font-bold text-stone-900 text-base">
                {currentInput.soil?.organic_carbon_percent ?? 0.3}%
              </span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Depleted baseline</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200/80">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">
                Rainfall
              </span>
              <span className="font-bold text-stone-900 text-base capitalize">
                {currentInput.rainfall || 'Low'}
              </span>
              <span className="text-[10px] text-amber-600 block mt-0.5">High moisture stress</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200/80">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">
                Land Use
              </span>
              <span className="font-bold text-stone-900 text-sm truncate block mt-0.5">
                {currentInput.land_use || 'Monoculture wheat'}
              </span>
              <span className="text-[10px] text-stone-500 block mt-0.5">Simplified rotation</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200/80">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">
                Water Availability
              </span>
              <span className="font-bold text-stone-900 text-sm capitalize block mt-0.5">
                {currentInput.water_availability || 'Low'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200/80">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">
                Habitat Diversity
              </span>
              <span className="font-bold text-stone-900 text-sm capitalize block mt-0.5">
                {currentInput.habitat_diversity || 'Low'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200/80">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">
                Species Richness
              </span>
              <span className="font-bold text-stone-900 text-sm capitalize block mt-0.5">
                {currentInput.species_richness || 'Low'}
              </span>
            </div>
          </div>
        </div>

        {/* Proposed Interventions Toggle */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h4 className="font-bold text-sm text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Proposed Interventions Package
            </h4>
            <span className="text-xs text-stone-500">
              {selectedInterventions.length} active measures
            </span>
          </div>

          <div className="space-y-2">
            {[
              'Legume-based Cover Crops',
              'Crop Diversification / Strip Intercropping',
              'Native Flowering Vegetation Strips',
              'Agroforestry Tree Windbreaks (Perennial Legumes)',
              'No-till Surface Residue Retention'
            ].map(item => {
              const isSelected = selectedInterventions.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleIntervention(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-semibold transition border ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                      : 'bg-stone-50 text-stone-600 border-stone-200/70 hover:bg-stone-100'
                  }`}
                >
                  <span>{item}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Intervention Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customInputText}
              onChange={e => setCustomInputText(e.target.value)}
              placeholder="Add custom intervention (e.g. Biochar application)..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 outline-none"
            />
            <button
              onClick={handleAddCustom}
              className="px-3 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-700 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {simulation && (
        <div className="space-y-6">
          {/* Direction of Expected Change Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 tracking-tight">
                  Direction of Expected Change & Temporal Projections
                </h4>
                <p className="text-xs text-stone-500">
                  Grounded projections across short-, medium-, and long-term ecological horizons.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Confidence: {simulation.confidence}
              </span>
            </div>

            <div className="space-y-4">
              {simulation.directionOfChange.map((dir, i) => (
                <div
                  key={i}
                  className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm text-stone-900">{dir.metric}</span>
                    </div>

                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      Expected Direction: {dir.direction}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="bg-white p-3 rounded-lg border border-stone-200/60 space-y-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-700 block">
                        Short-Term (1–2 Years)
                      </span>
                      <p className="text-stone-700 leading-relaxed text-[11px]">{dir.shortTerm}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-stone-200/60 space-y-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-700 block">
                        Medium-Term (3–5 Years)
                      </span>
                      <p className="text-stone-700 leading-relaxed text-[11px]">{dir.mediumTerm}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-stone-200/60 space-y-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-900 block">
                        Long-Term (6–10 Years)
                      </span>
                      <p className="text-stone-700 leading-relaxed text-[11px]">{dir.longTerm}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Pillars of Ecological Implications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Soil Implications */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Soil Implications</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {simulation.soilImplications}
              </p>
            </div>

            {/* Water Implications */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Water Implications</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {simulation.waterImplications}
              </p>
            </div>

            {/* Biodiversity Implications */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Biodiversity Implications</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {simulation.biodiversityImplications}
              </p>
            </div>

            {/* Habitat Implications */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Trees className="w-4 h-4 text-emerald-600" />
                <span>Habitat Implications</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {simulation.habitatImplications}
              </p>
            </div>
          </div>

          {/* Grounding Scientific Evidence for Scenario */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Scientific Evidence Grounding Scenario Projections
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {simulation.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1"
                >
                  <div className="font-bold text-stone-900">{ev.source}</div>
                  <div className="text-stone-600 text-[11px]">{ev.study}</div>
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium pt-1"
                    >
                      <span>Institutional Reference</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
