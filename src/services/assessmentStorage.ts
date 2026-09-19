import { EnvironmentalAssessment, EnvironmentalInput } from '../types/environmental';
import { runEnvironmentalScientistPipeline } from '../reasoning/multiMetricEngine';

const STORAGE_KEY = 'darukaa_earth_assessments';

export const DEMO_SCENARIO_INPUT: EnvironmentalInput = {
  region: 'Semi-arid',
  latitude: 31.5204,
  longitude: 34.4532,
  ecosystem_type: 'Semi-arid Dryland Agroecosystem',
  land_use: 'Monoculture wheat',
  crop_vegetation_type: 'Winter Wheat (Triticum aestivum)',
  soil: {
    ph: 6.8,
    organic_carbon_percent: 0.3,
    moisture_percent: 12,
    moisture_level: 'Low'
  },
  rainfall: 'Low (<320 mm/yr, unimodal winter precipitation)',
  temperature: 31,
  water_availability: 'low',
  species_richness: 'low',
  habitat_diversity: 'low',
  pollution_level: 'low',
  deforestation_habitat_loss: 'medium',
  additional_notes: 'Continuous winter wheat monoculture across 45 hectares with conventional deep tillage. Severe seasonal water stress and loss of wild pollinators observed.'
};

export async function createDemoAssessment(): Promise<EnvironmentalAssessment> {
  const result = await runEnvironmentalScientistPipeline(DEMO_SCENARIO_INPUT);
  return {
    id: 'DEMO-SEMIARID-WHEAT',
    timestamp: new Date().toISOString(),
    title: 'Semi-Arid Monoculture Wheat Agroecosystem (Challenge Reference)',
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
}

export function getSavedAssessments(): EnvironmentalAssessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse saved assessments:', err);
    return [];
  }
}

export function saveAssessment(assessment: EnvironmentalAssessment): void {
  try {
    const current = getSavedAssessments();
    const updated = [assessment, ...current.filter(a => a.id !== assessment.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
  } catch (err) {
    console.error('Failed to save assessment to localStorage:', err);
  }
}

export function getAssessmentById(id: string): EnvironmentalAssessment | undefined {
  const all = getSavedAssessments();
  return all.find(a => a.id === id);
}

export function deleteAssessment(id: string): void {
  try {
    const current = getSavedAssessments();
    const updated = current.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete assessment:', err);
  }
}

export async function initializeDefaultAssessments(): Promise<EnvironmentalAssessment[]> {
  const existing = getSavedAssessments();
  if (existing.length === 0) {
    const demo = await createDemoAssessment();
    saveAssessment(demo);
    return [demo];
  }
  return existing;
}
