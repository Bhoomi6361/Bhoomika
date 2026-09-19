import React, { useState } from 'react';
import {
  EnvironmentalInput,
  EnvironmentalAssessment
} from '../types/environmental';
import { runEnvironmentalScientistPipeline } from '../reasoning/multiMetricEngine';
import {
  saveAssessment,
  DEMO_SCENARIO_INPUT,
  createDemoAssessment
} from '../services/assessmentStorage';
import {
  FileSpreadsheet,
  Code,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface AssessmentPageProps {
  onAssessmentCompleted: (assessment: EnvironmentalAssessment) => void;
  onNavigate: (page: PageId) => void;
}

const SAMPLE_JSON_INPUT = JSON.stringify(DEMO_SCENARIO_INPUT, null, 2);

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  onAssessmentCompleted,
  onNavigate
}) => {
  const [tab, setTab] = useState<'form' | 'json'>('form');

  // Form state
  const [formData, setFormData] = useState<EnvironmentalInput>({
    region: 'Semi-arid',
    latitude: 31.52,
    longitude: 34.45,
    ecosystem_type: 'Semi-arid Dryland Agroecosystem',
    land_use: 'Monoculture wheat',
    crop_vegetation_type: 'Winter wheat',
    soil: {
      ph: 6.8,
      organic_carbon_percent: 0.3,
      moisture_percent: 12
    },
    rainfall: 'low',
    temperature: 31,
    water_availability: 'low',
    species_richness: 'low',
    habitat_diversity: 'low',
    pollution_level: 'low',
    deforestation_habitat_loss: 'medium',
    additional_notes: ''
  });

  // JSON input state
  const [jsonText, setJsonText] = useState<string>(SAMPLE_JSON_INPUT);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation function
  const validateInput = (data: EnvironmentalInput): string[] => {
    const errors: string[] = [];

    if (!data.region || !data.region.trim()) {
      errors.push('Region / Location is mandatory.');
    }

    if (data.soil?.ph !== undefined && data.soil.ph !== null) {
      if (data.soil.ph < 0 || data.soil.ph > 14) {
        errors.push('Soil pH must be between 0.0 and 14.0.');
      }
    }

    if (data.soil?.organic_carbon_percent !== undefined && data.soil.organic_carbon_percent !== null) {
      if (data.soil.organic_carbon_percent < 0 || data.soil.organic_carbon_percent > 100) {
        errors.push('Soil Organic Carbon (%) must be between 0% and 100%.');
      }
    }

    if (data.soil?.moisture_percent !== undefined && data.soil.moisture_percent !== null) {
      if (data.soil.moisture_percent < 0 || data.soil.moisture_percent > 100) {
        errors.push('Soil moisture (%) must be between 0% and 100%.');
      }
    }

    if (data.temperature !== undefined && data.temperature !== null) {
      if (data.temperature < -60 || data.temperature > 65) {
        errors.push('Average temperature (°C) must be in plausible terrestrial range (-60°C to 65°C).');
      }
    }

    if (data.latitude !== undefined && data.latitude !== null) {
      if (data.latitude < -90 || data.latitude > 90) {
        errors.push('Latitude must be between -90 and 90.');
      }
    }

    if (data.longitude !== undefined && data.longitude !== null) {
      if (data.longitude < -180 || data.longitude > 180) {
        errors.push('Longitude must be between -180 and 180.');
      }
    }

    return errors;
  };

  const handleFormChange = (field: string, value: any) => {
    if (field.startsWith('soil.')) {
      const subField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        soil: {
          ...prev.soil,
          [subField]: value === '' ? undefined : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value === '' ? undefined : value
      }));
    }
  };

  const executeAssessment = async (inputData: EnvironmentalInput) => {
    const errs = validateInput(inputData);
    if (errs.length > 0) {
      setValidationErrors(errs);
      return;
    }
    setValidationErrors([]);
    setIsSubmitting(true);

    try {
      const result = await runEnvironmentalScientistPipeline(inputData);
      const newAssessment: EnvironmentalAssessment = {
        id: `ASSESS-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: `${inputData.region} ${inputData.ecosystem_type || inputData.land_use || 'Ecosystem'} Assessment`,
        input: result.input,
        scores: result.scores,
        reasoningSummary: result.reasoningSummary,
        reasoningFactors: result.reasoningFactors,
        retrievedKnowledge: result.retrievedKnowledge,
        recommendations: result.recommendations,
        missingVariables: result.missingVariables,
        clarificationNeeded: result.clarificationNeeded,
        clarifyingQuestions: result.clarifyingQuestions
      };

      saveAssessment(newAssessment);
      onAssessmentCompleted(newAssessment);
      onNavigate('dashboard');
    } catch (err: any) {
      console.error('Assessment pipeline execution failure:', err);
      setValidationErrors([`Pipeline failure: ${err.message}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadDemoIntoForm = () => {
    setFormData({ ...DEMO_SCENARIO_INPUT });
    setJsonText(JSON.stringify(DEMO_SCENARIO_INPUT, null, 2));
    setValidationErrors([]);
  };

  const handleRunDemoDirectly = async () => {
    handleLoadDemoIntoForm();
    await executeAssessment(DEMO_SCENARIO_INPUT);
  };

  const handleJsonSubmit = () => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonText);
      // Normalize JSON to internal environmental model
      const normalized: EnvironmentalInput = {
        region: parsed.region || 'Unspecified Region',
        latitude: parsed.latitude !== undefined ? Number(parsed.latitude) : undefined,
        longitude: parsed.longitude !== undefined ? Number(parsed.longitude) : undefined,
        ecosystem_type: parsed.ecosystem_type || parsed.ecosystem || 'Agroecosystem',
        land_use: parsed.land_use || parsed.landCover || 'Monoculture agricultural cropping',
        crop_vegetation_type: parsed.crop_vegetation_type || parsed.crop || parsed.vegetation,
        soil: {
          ph: parsed.soil?.ph !== undefined ? Number(parsed.soil.ph) : undefined,
          organic_carbon_percent:
            parsed.soil?.organic_carbon_percent !== undefined
              ? Number(parsed.soil.organic_carbon_percent)
              : parsed.soil?.soc !== undefined
              ? Number(parsed.soil.soc)
              : undefined,
          moisture_percent:
            parsed.soil?.moisture_percent !== undefined
              ? Number(parsed.soil.moisture_percent)
              : undefined,
          moisture_level: parsed.soil?.moisture_level
        },
        rainfall: String(parsed.rainfall || 'low'),
        temperature: parsed.temperature !== undefined ? Number(parsed.temperature) : undefined,
        water_availability: String(parsed.water_availability || parsed.water || 'low').toLowerCase(),
        species_richness: String(parsed.species_richness || parsed.species || 'low').toLowerCase(),
        habitat_diversity: String(parsed.habitat_diversity || parsed.habitat || 'low').toLowerCase(),
        pollution_level: parsed.pollution_level || parsed.pollution || 'low',
        deforestation_habitat_loss: parsed.deforestation_habitat_loss || parsed.deforestation || 'none',
        additional_notes: parsed.additional_notes || parsed.notes
      };

      executeAssessment(normalized);
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Selector: Form vs JSON input */}
      <div className="bg-white rounded-xl border border-stone-200 p-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            id="tab-structured-form"
            onClick={() => setTab('form')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              tab === 'form'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Structured Assessment Form</span>
          </button>

          <button
            id="tab-json-input"
            onClick={() => setTab('json')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              tab === 'json'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>JSON Object Input</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 hidden sm:flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
          <span>Both inputs feed the unified environmental scientist model</span>
        </div>
      </div>

      {/* Challenge Demo Quick-Load Banner */}
      <div className="bg-emerald-900/90 text-white rounded-2xl p-5 border border-emerald-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Darukaa.Earth Challenge Case Reference</span>
          </div>
          <h4 className="text-base font-bold text-white tracking-tight">
            Semi-Arid Monoculture Wheat Agroecosystem (45 ha)
          </h4>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Pre-load the official benchmark with degraded SOC (0.3%), low precipitation (&lt;320 mm/yr), and conventional tillage directly into this form, or run scientific reasoning with one click.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            id="btn-populate-demo-form"
            onClick={handleLoadDemoIntoForm}
            className="px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold border border-emerald-600/60 transition flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
            <span>Populate Fields</span>
          </button>
          <button
            type="button"
            id="btn-run-demo-direct"
            onClick={handleRunDemoDirectly}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Load & Run Challenge Demo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Errors Box */}
      {validationErrors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Validation Errors</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2">
            {validationErrors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Mode */}
      {tab === 'form' && (
        <form
          id="environmental-form"
          onSubmit={e => {
            e.preventDefault();
            executeAssessment(formData);
          }}
          className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6"
        >
          {/* Section 1: Geography & Location */}
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                1. Geographical & Ecosystem Context
              </h3>
              <p className="text-xs text-stone-500">
                Define the macro-biome and spatial attributes of the land parcel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Location / Region <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-region"
                  value={formData.region}
                  onChange={e => handleFormChange('region', e.target.value)}
                  placeholder="e.g. Semi-arid, Mediterranean"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Latitude <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  id="input-latitude"
                  value={formData.latitude ?? ''}
                  onChange={e =>
                    handleFormChange('latitude', e.target.value === '' ? undefined : parseFloat(e.target.value))
                  }
                  placeholder="e.g. 31.5204"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Longitude <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  id="input-longitude"
                  value={formData.longitude ?? ''}
                  onChange={e =>
                    handleFormChange('longitude', e.target.value === '' ? undefined : parseFloat(e.target.value))
                  }
                  placeholder="e.g. 34.4532"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ecosystem Type
                </label>
                <input
                  type="text"
                  id="input-ecosystem"
                  value={formData.ecosystem_type || ''}
                  onChange={e => handleFormChange('ecosystem_type', e.target.value)}
                  placeholder="e.g. Semi-arid dryland shrub, Grassland"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Land Use / Land Cover
                </label>
                <input
                  type="text"
                  id="input-land-use"
                  value={formData.land_use || ''}
                  onChange={e => handleFormChange('land_use', e.target.value)}
                  placeholder="e.g. Monoculture wheat, Pasture, Agroforestry"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop / Vegetation Type
                </label>
                <input
                  type="text"
                  id="input-crop"
                  value={formData.crop_vegetation_type || ''}
                  onChange={e => handleFormChange('crop_vegetation_type', e.target.value)}
                  placeholder="e.g. Winter wheat, Maize, Mixed annuals"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Soil Health Metrics */}
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                2. Soil Health Variables
              </h3>
              <p className="text-xs text-stone-500">
                Critical indicators regulating water capacity, microbial ecology, and nutrient availability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Soil pH <span className="text-stone-400 font-normal">(0 - 14)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  id="input-soil-ph"
                  value={formData.soil?.ph ?? ''}
                  onChange={e =>
                    handleFormChange('soil.ph', e.target.value === '' ? undefined : parseFloat(e.target.value))
                  }
                  placeholder="e.g. 6.8"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Soil Organic Carbon (%) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="100"
                  id="input-soil-soc"
                  value={formData.soil?.organic_carbon_percent ?? ''}
                  onChange={e =>
                    handleFormChange(
                      'soil.organic_carbon_percent',
                      e.target.value === '' ? undefined : parseFloat(e.target.value)
                    )
                  }
                  placeholder="e.g. 0.3"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Soil Moisture (%) <span className="text-stone-400 font-normal">(volumetric)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  id="input-soil-moisture"
                  value={formData.soil?.moisture_percent ?? ''}
                  onChange={e =>
                    handleFormChange(
                      'soil.moisture_percent',
                      e.target.value === '' ? undefined : parseFloat(e.target.value)
                    )
                  }
                  placeholder="e.g. 12"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Climate & Water */}
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                3. Climate & Water Availability
              </h3>
              <p className="text-xs text-stone-500">
                Hydrological input and atmospheric thermal stress indices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Rainfall Pattern / Quantity
                </label>
                <input
                  type="text"
                  id="input-rainfall"
                  value={formData.rainfall}
                  onChange={e => handleFormChange('rainfall', e.target.value)}
                  placeholder="e.g. low, <300mm, 450mm"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Average Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  id="input-temp"
                  value={formData.temperature ?? ''}
                  onChange={e =>
                    handleFormChange('temperature', e.target.value === '' ? undefined : parseFloat(e.target.value))
                  }
                  placeholder="e.g. 31"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Water Availability
                </label>
                <select
                  id="input-water-avail"
                  value={formData.water_availability}
                  onChange={e => handleFormChange('water_availability', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  <option value="low">Low (Acute Deficit / Rainfed only)</option>
                  <option value="medium">Medium (Seasonal / Moderate)</option>
                  <option value="high">High (Secure Groundwater / Surface access)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Biodiversity & Anthropogenic Impact */}
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                4. Biodiversity Indicators & Environmental Stress
              </h3>
              <p className="text-xs text-stone-500">
                Ecological complexity, fragmentation status, and human pressure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Species Richness
                </label>
                <select
                  id="input-species-richness"
                  value={formData.species_richness}
                  onChange={e => handleFormChange('species_richness', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  <option value="low">Low (Very few wild flora/fauna)</option>
                  <option value="medium">Medium (Moderate presence)</option>
                  <option value="high">High (Diverse ecological guilds)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Habitat Diversity
                </label>
                <select
                  id="input-habitat-diversity"
                  value={formData.habitat_diversity}
                  onChange={e => handleFormChange('habitat_diversity', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  <option value="low">Low (Monoculture / Simplified)</option>
                  <option value="medium">Medium (Patches / Hedgerows present)</option>
                  <option value="high">High (Heterogeneous mosaic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pollution Level
                </label>
                <select
                  id="input-pollution"
                  value={formData.pollution_level || 'low'}
                  onChange={e => handleFormChange('pollution_level', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  <option value="none">None / Nil</option>
                  <option value="low">Low (Controlled)</option>
                  <option value="medium">Medium (Routine agrochemical runoff)</option>
                  <option value="high">High (Severe pesticide/industrial contamination)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Deforestation / Habitat Loss
                </label>
                <select
                  id="input-deforestation"
                  value={formData.deforestation_habitat_loss || 'none'}
                  onChange={e => handleFormChange('deforestation_habitat_loss', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  <option value="none">None / Preserved Native Cover</option>
                  <option value="low">Low (&lt;10% loss)</option>
                  <option value="medium">Medium (10–40% loss / Edge fragmentation)</option>
                  <option value="high">High (&gt;40% lost / Isolated patches)</option>
                  <option value="severe">Severe (Complete canopy removal)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Additional Field Observations
              </label>
              <textarea
                rows={2}
                value={formData.additional_notes || ''}
                onChange={e => handleFormChange('additional_notes', e.target.value)}
                placeholder="Optional notes regarding historical tillage, erosion gullies, or microclimate observations..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLoadDemoIntoForm}
              className="px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
              <span>Reset / Populate Challenge Scenario</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-run-form-assessment"
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs active:scale-[0.98] disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSubmitting ? 'Evaluating Multi-Metric Interactions...' : 'Run Multi-Metric Environmental Assessment'}</span>
            </button>
          </div>
        </form>
      )}

      {/* JSON Mode */}
      {tab === 'json' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Raw JSON Environmental Schema
              </h3>
              <p className="text-xs text-stone-500">
                Input structured environmental data directly matching the Darukaa.Earth schema specification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setJsonText(SAMPLE_JSON_INPUT)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Load Challenge JSON Sample
            </button>
          </div>

          {jsonError && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{jsonError}</span>
            </div>
          )}

          <div className="rounded-xl overflow-hidden border border-stone-300">
            <textarea
              id="json-input-textarea"
              rows={16}
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              className="w-full p-4 font-mono text-xs bg-stone-950 text-emerald-300 outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">
              Validates numerical ranges and missing values before execution.
            </span>

            <button
              type="button"
              onClick={handleJsonSubmit}
              disabled={isSubmitting}
              id="btn-run-json-assessment"
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSubmitting ? 'Parsing & Reasoning...' : 'Validate JSON & Run Scientific Reasoning'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
