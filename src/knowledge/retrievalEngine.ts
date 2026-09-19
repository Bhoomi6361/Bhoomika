import { EnvironmentalInput, RetrievedKnowledgeItem } from '../types/environmental';
import { ENVIRONMENTAL_KNOWLEDGE_BASE } from './knowledgeBase';

export interface RetrievalQuery {
  environmentalInput?: Partial<EnvironmentalInput>;
  textQuery?: string;
  focusVariables?: string[];
  limit?: number;
  minScoreThreshold?: number;
}

export interface RetrievalResult {
  items: RetrievedKnowledgeItem[];
  matchedVariables: string[];
  explanation: string;
}

export interface KnowledgeRetrievalService {
  retrieve(query: RetrievalQuery): Promise<RetrievalResult>;
  search(keyword: string): Promise<RetrievedKnowledgeItem[]>;
  getById(id: string): RetrievedKnowledgeItem | undefined;
}

/**
 * Multi-Variable Environmental Knowledge Retrieval Engine
 * Evaluates semantic and multi-variable overlap across soil, climate, land-use,
 * water, and biodiversity dimensions. Designed with an interface that can easily
 * plug into vector embeddings (e.g. pgvector or Gemini embeddings) or operate
 * as an explainable multi-metric indexed retriever.
 */
export class StructuredKnowledgeRetriever implements KnowledgeRetrievalService {
  private knowledgeBase: RetrievedKnowledgeItem[];

  constructor(customBase?: RetrievedKnowledgeItem[]) {
    this.knowledgeBase = customBase || ENVIRONMENTAL_KNOWLEDGE_BASE;
  }

  public getById(id: string): RetrievedKnowledgeItem | undefined {
    return this.knowledgeBase.find(item => item.id.toLowerCase() === id.toLowerCase());
  }

  public async search(keyword: string): Promise<RetrievedKnowledgeItem[]> {
    if (!keyword || keyword.trim() === '') {
      return [...this.knowledgeBase];
    }
    const term = keyword.toLowerCase().trim();
    return this.knowledgeBase.filter(item => {
      return (
        item.title.toLowerCase().includes(term) ||
        item.topic.toLowerCase().includes(term) ||
        item.mechanism.toLowerCase().includes(term) ||
        item.evidence.toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term) ||
        item.tags.some(t => t.toLowerCase().includes(term)) ||
        item.environmentalVariables.some(v => v.toLowerCase().includes(term))
      );
    });
  }

  public async retrieve(query: RetrievalQuery): Promise<RetrievalResult> {
    const limit = query.limit || 4;
    const env = query.environmentalInput || {};
    const text = (query.textQuery || '').toLowerCase();
    const explicitVars = (query.focusVariables || []).map(v => v.toLowerCase());

    // 1. Identify active variable signals from environmental input
    const activeSignals: string[] = [];
    if (env.region) activeSignals.push(env.region.toLowerCase());
    if (env.ecosystem_type) activeSignals.push(env.ecosystem_type.toLowerCase());
    if (env.land_use) activeSignals.push(env.land_use.toLowerCase());
    if (env.crop_vegetation_type) activeSignals.push(env.crop_vegetation_type.toLowerCase());

    if (env.soil?.organic_carbon_percent !== undefined) {
      activeSignals.push('soil organic carbon');
      if (env.soil.organic_carbon_percent < 1.0) activeSignals.push('low soil organic carbon', 'soil carbon depletion');
    }
    if (env.soil?.ph !== undefined) {
      activeSignals.push('soil ph');
      if (env.soil.ph > 7.8 || env.soil.ph < 6.0) activeSignals.push('soil ph stress', 'alkaline', 'acidic');
    }
    if (env.soil?.moisture_percent !== undefined || env.soil?.moisture_level) {
      activeSignals.push('soil moisture');
    }
    if (env.rainfall) {
      activeSignals.push('rainfall');
      const rf = env.rainfall.toLowerCase();
      if (rf.includes('low') || rf.includes('<') || parseInt(rf, 10) < 450) {
        activeSignals.push('low rainfall', 'water deficit', 'drought');
      }
    }
    if (env.temperature !== undefined) {
      activeSignals.push('temperature');
      if (env.temperature > 28) activeSignals.push('thermal stress', 'heat');
    }
    if (env.water_availability) {
      activeSignals.push('water availability');
      if (env.water_availability.toLowerCase() === 'low') activeSignals.push('water deficit', 'water stress');
    }
    if (env.species_richness) {
      activeSignals.push('species richness');
      if (env.species_richness.toLowerCase() === 'low') activeSignals.push('low species richness', 'biodiversity decline');
    }
    if (env.habitat_diversity) {
      activeSignals.push('habitat diversity');
      if (env.habitat_diversity.toLowerCase() === 'low') activeSignals.push('low habitat diversity', 'habitat simplification');
    }
    if (env.pollution_level && env.pollution_level !== 'none') {
      activeSignals.push('pollution level', 'chemical ecotoxicity');
    }
    if (env.deforestation_habitat_loss && env.deforestation_habitat_loss !== 'none') {
      activeSignals.push('deforestation', 'habitat loss', 'habitat fragmentation');
    }

    // Include explicit variable signals
    activeSignals.push(...explicitVars);

    // 2. Score knowledge entries based on multi-variable co-occurrence
    const scoredEntries = this.knowledgeBase.map(entry => {
      let score = 0;
      const matchedVars: string[] = [];

      // A. Match environmental variables (Highest Weight)
      entry.environmentalVariables.forEach(ev => {
        const evLower = ev.toLowerCase();
        for (const signal of activeSignals) {
          if (signal.includes(evLower) || evLower.includes(signal)) {
            score += 15;
            if (!matchedVars.includes(ev)) matchedVars.push(ev);
            break;
          }
        }
      });

      // B. Multi-variable synergy bonus: Reward entries addressing multiple interacting factors simultaneously
      if (matchedVars.length >= 3) {
        score += 25; // Significant bonus for multi-variable grounding
      } else if (matchedVars.length === 2) {
        score += 10;
      }

      // C. Match ecosystem and land use condition
      if (env.ecosystem_type && entry.ecosystem.toLowerCase().includes(env.ecosystem_type.toLowerCase())) {
        score += 12;
      }
      if (env.region && entry.region.toLowerCase().includes(env.region.toLowerCase())) {
        score += 10;
      }
      if (env.land_use && (entry.condition.toLowerCase().includes(env.land_use.toLowerCase()) || entry.tags.some(t => env.land_use?.toLowerCase().includes(t)))) {
        score += 14;
      }

      // D. Text query semantic relevance
      if (text) {
        const textTokens = text.split(/\s+/).filter(t => t.length > 3);
        let tokenMatches = 0;
        textTokens.forEach(token => {
          if (entry.title.toLowerCase().includes(token)) tokenMatches += 5;
          if (entry.mechanism.toLowerCase().includes(token)) tokenMatches += 3;
          if (entry.tags.some(t => t.toLowerCase().includes(token))) tokenMatches += 4;
        });
        score += Math.min(tokenMatches, 25);
      }

      // E. Generate explicit explanation of why this was retrieved
      let whyRelevant = '';
      if (matchedVars.length > 0) {
        whyRelevant = `Addresses interaction between ${matchedVars.join(', ')} under ${entry.condition.slice(0, 75)}...`;
      } else {
        whyRelevant = `Pertains to ${entry.topic} in ${entry.ecosystem}.`;
      }

      return {
        ...entry,
        relevanceScore: score,
        whyRelevant
      };
    });

    // Sort descending by relevance score
    scoredEntries.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    const selected = scoredEntries.slice(0, limit);
    const allMatchedVars = Array.from(new Set(selected.flatMap(s => s.environmentalVariables)));

    const explanation = selected.length > 0
      ? `Retrieved ${selected.length} scientific studies examining interactions across ${allMatchedVars.slice(0, 5).join(', ')}.`
      : `Standard baseline retrieved.`;

    return {
      items: selected,
      matchedVariables: allMatchedVars,
      explanation
    };
  }
}

export const defaultKnowledgeRetriever = new StructuredKnowledgeRetriever();
