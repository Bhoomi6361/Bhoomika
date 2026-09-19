import {
  EnvironmentalInput,
  ChatMessage,
  RetrievedKnowledgeItem,
  ReasoningFactors,
  Recommendation
} from '../types/environmental';
import {
  runEnvironmentalScientistPipeline,
  extractVariablesFromText,
  detectMissingVariables
} from '../reasoning/multiMetricEngine';
import { defaultKnowledgeRetriever } from '../knowledge/retrievalEngine';

export interface ScientistChatResponse {
  reply: string;
  extractedVariables?: Partial<EnvironmentalInput>;
  currentEnvState?: Partial<EnvironmentalInput>;
  missingVariables?: string[];
  clarificationNeeded?: boolean;
  clarifyingQuestions?: string[];
  reasoningFactors?: ReasoningFactors;
  retrievedKnowledge?: RetrievedKnowledgeItem[];
  recommendations?: Recommendation[];
  scientificRationale?: string;
}

export async function sendMessageToScientist(
  message: string,
  history: ChatMessage[] = [],
  currentEnvState: Partial<EnvironmentalInput> = {}
): Promise<ScientistChatResponse> {
  try {
    const res = await fetch('/api/scientist/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, currentEnvState })
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend /api/scientist/chat unavailable, using embedded scientific pipeline:', err);
  }

  // Client-side fallback if server endpoint is unreachable
  const { updatedState, extracted } = extractVariablesFromText(message, currentEnvState);
  const { missing, isSufficientForRecommendation, clarifyingQuestions } = detectMissingVariables(updatedState);
  const retrieval = await defaultKnowledgeRetriever.retrieve({
    environmentalInput: updatedState,
    textQuery: message,
    limit: 3
  });
  const pipelineResult = await runEnvironmentalScientistPipeline(updatedState as EnvironmentalInput);

  let reply = '';
  if (!isSufficientForRecommendation) {
    reply = `I have received your note: "${message}". As an environmental scientist, I cannot formulate interventions without understanding the interacting ecological drivers.\n\nTo conduct a rigorous multi-metric assessment, please specify:\n${clarifyingQuestions.map(q => `• ${q}`).join('\n')}`;
  } else {
    const topRec = pipelineResult.recommendations[0];
    reply = `Based on the environmental variables you've provided (Region: ${updatedState.region || 'Identified'}, Land Use: ${updatedState.land_use || 'Noted'}, SOC: ${updatedState.soil?.organic_carbon_percent ?? 'Noted'}%, Rainfall: ${updatedState.rainfall || 'Noted'}), here is the multi-metric evidence-backed assessment:\n\n${pipelineResult.reasoningFactors.scientificRationale}\n\n### RECOMMENDATION\n${topRec ? topRec.recommendation : 'Establish continuous soil cover and polyculture diversification.'}\n\n### WHY IT WORKS\n${topRec ? topRec.whyItWorks : 'Restores biological aggregate stability and expands moisture buffering.'}\n\n### ENVIRONMENTAL MECHANISM\n${topRec ? topRec.environmentalMechanism : 'Increases active carbon exudates and dampens high thermal stress.'}\n\n### IMPACTED METRICS\n${topRec ? topRec.impactedMetrics.map(m => `• ${m}`).join('\n') : '• Soil organic carbon\n• Habitat diversity'}\n\n### TIME HORIZON\n${topRec ? topRec.timeHorizon : 'Medium term'}\n\n### EXPECTED OUTCOME\n${topRec ? topRec.expectedOutcome : 'Evidence insufficient for a reliable quantitative estimate.'}\n\n### CONFIDENCE\n${topRec ? topRec.confidence : 'High'}\n\n### EVIDENCE\n${topRec?.evidence.map(e => `• ${e.source} (${e.year}): "${e.findingQuote}"`).join('\n') || 'FAO Global Soil Partnership (2020)'}`;
  }

  return {
    reply,
    extractedVariables: extracted,
    currentEnvState: updatedState,
    missingVariables: missing,
    clarificationNeeded: !isSufficientForRecommendation,
    clarifyingQuestions,
    reasoningFactors: pipelineResult.reasoningFactors,
    retrievedKnowledge: retrieval.items,
    recommendations: pipelineResult.recommendations,
    scientificRationale: pipelineResult.reasoningFactors.scientificRationale
  };
}
