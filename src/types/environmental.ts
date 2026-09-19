export type QualitativeLevel = 'Low' | 'Medium' | 'High' | 'Critically Low' | 'Severe' | 'None';

export interface SoilData {
  ph?: number;
  organic_carbon_percent?: number;
  moisture_percent?: number;
  moisture_level?: 'Low' | 'Medium' | 'High';
}

export interface EnvironmentalInput {
  region: string;
  latitude?: number;
  longitude?: number;
  ecosystem_type?: string;
  land_use?: string;
  crop_vegetation_type?: string;
  soil: SoilData;
  rainfall: string; // e.g. "low", "<300mm", "450mm"
  temperature?: number; // Celsius
  water_availability: 'low' | 'medium' | 'high' | string;
  species_richness: 'low' | 'medium' | 'high' | string;
  habitat_diversity: 'low' | 'medium' | 'high' | string;
  pollution_level?: 'low' | 'medium' | 'high' | 'none' | string;
  deforestation_habitat_loss?: 'low' | 'medium' | 'high' | 'severe' | string;
  additional_notes?: string;
}

export interface RetrievedKnowledgeItem {
  id: string;
  title: string;
  topic: string;
  environmentalVariables: string[];
  ecosystem: string;
  region: string;
  condition: string;
  mechanism: string;
  expectedEffect: string;
  timeHorizon: string;
  evidence: string;
  source: string;
  sourceUrl: string;
  year: number;
  reliability: 'Peer-reviewed Meta-analysis' | 'Global UN/FAO Assessment' | 'Global UN/IPBES Assessment' | 'IPCC Assessment Report' | 'Long-term Field Experiment' | 'IUCN Conservation Guidelines' | 'CGIAR/ICRAF Research Report';
  confidence: 'High' | 'Medium' | 'Low';
  tags: string[];
  relevanceScore?: number;
  whyRelevant?: string;
}

export interface ReasoningFactorInteraction {
  variables: string[];
  mechanism: string;
  impact: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
}

export interface ReasoningFactors {
  factors: string[];
  interactions: ReasoningFactorInteraction[];
  scientificRationale: string;
}

export interface RecommendationEvidence {
  source: string;
  year: number;
  studyTitle: string;
  url: string;
  reliability: string;
  findingQuote: string;
}

export interface Recommendation {
  id: string;
  title: string;
  recommendation: string; // What should be done
  whyItWorks: string; // Scientific explanation
  environmentalMechanism: string; // Causal relationship between variables
  impactedMetrics: string[]; // Metrics expected to improve
  timeHorizon: 'Short term' | 'Medium term' | 'Long term' | 'Short to Medium term' | 'Medium to Long term';
  expectedOutcome: string; // Measurable estimates ONLY when supported by retrieved evidence; otherwise explicit statement
  confidence: 'High' | 'Medium' | 'Low';
  evidence: RecommendationEvidence[];
}

export interface EnvironmentalScores {
  overallBiodiversityHealth: number | null; // 0 - 100 or null if no data
  soilHealth: number | null;
  waterAvailabilityScore: number | null;
  habitatQuality: number | null;
  climateStress: number | null;
  humanImpact: number | null;
}

export interface EnvironmentalAssessment {
  id: string;
  timestamp: string;
  title: string;
  input: EnvironmentalInput;
  scores: EnvironmentalScores;
  reasoningSummary: string;
  reasoningFactors: ReasoningFactors;
  retrievedKnowledge: RetrievedKnowledgeItem[];
  recommendations: Recommendation[];
  missingVariables: string[];
  clarificationNeeded: boolean;
  clarifyingQuestions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'scientist' | 'system';
  content: string;
  timestamp: string;
  extractedVariables?: Partial<EnvironmentalInput>;
  currentEnvState?: Partial<EnvironmentalInput>;
  missingVariables?: string[];
  clarifyingQuestions?: string[];
  reasoningFactors?: ReasoningFactors;
  retrievedKnowledge?: RetrievedKnowledgeItem[];
  recommendations?: Recommendation[];
  scientificRationale?: string;
  isStreaming?: boolean;
}

export interface InterventionDirection {
  metric: string;
  direction: 'Increase' | 'Decrease' | 'Stabilize';
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface ScenarioSimulation {
  id: string;
  title: string;
  timestamp: string;
  currentCondition: EnvironmentalInput;
  proposedInterventions: string[];
  affectedVariables: string[];
  directionOfChange: InterventionDirection[];
  soilImplications: string;
  waterImplications: string;
  biodiversityImplications: string;
  habitatImplications: string;
  evidence: { source: string; study: string; year: number; url: string }[];
  confidence: 'High' | 'Medium' | 'Low';
}
