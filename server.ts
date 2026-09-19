import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { ENVIRONMENTAL_KNOWLEDGE_BASE } from './src/knowledge/knowledgeBase.js';
import { StructuredKnowledgeRetriever } from './src/knowledge/retrievalEngine.js';
import {
  extractVariablesFromText,
  detectMissingVariables,
  runEnvironmentalScientistPipeline
} from './src/reasoning/multiMetricEngine.js';
import { EnvironmentalInput } from './src/types/environmental.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const retriever = new StructuredKnowledgeRetriever(ENVIRONMENTAL_KNOWLEDGE_BASE);

// Lazy Gemini AI initialization with telemetry header
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------- API ROUTES -----------------

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Darukaa.Earth — AI Biodiversity Intelligence',
    version: '1.0.0',
    hasGeminiKey: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

// Knowledge Base Listing & Search
app.get('/api/knowledge', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (q && q.trim()) {
      const results = await retriever.search(q);
      return res.json({ items: results, count: results.length });
    }
    return res.json({ items: ENVIRONMENTAL_KNOWLEDGE_BASE, count: ENVIRONMENTAL_KNOWLEDGE_BASE.length });
  } catch (error: any) {
    console.error('Knowledge search error:', error);
    res.status(500).json({ error: error.message || 'Failed to query knowledge base' });
  }
});

// Multi-Variable Knowledge Retrieval (RAG)
app.post('/api/knowledge/retrieve', async (req: Request, res: Response) => {
  try {
    const { environmentalInput, textQuery, focusVariables, limit } = req.body;
    const result = await retriever.retrieve({
      environmentalInput,
      textQuery,
      focusVariables,
      limit: limit || 4
    });
    res.json(result);
  } catch (error: any) {
    console.error('Retrieval error:', error);
    res.status(500).json({ error: error.message || 'Retrieval failed' });
  }
});

// Multi-Metric Assessment Pipeline
app.post('/api/scientist/analyze', async (req: Request, res: Response) => {
  try {
    const input: EnvironmentalInput = req.body;
    const result = await runEnvironmentalScientistPipeline(input);
    res.json(result);
  } catch (error: any) {
    console.error('Assessment analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Conversational AI Environmental Scientist
app.post('/api/scientist/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], currentEnvState = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    // 1. Variable extraction from user message + retain previous state
    const { updatedState, extracted } = extractVariablesFromText(message, currentEnvState);

    // 2. Check for missing variables
    const { missing, isSufficientForRecommendation, clarifyingQuestions } = detectMissingVariables(updatedState);

    // 3. Retrieve relevant scientific knowledge grounded in current environmental variables
    const retrievalResult = await retriever.retrieve({
      environmentalInput: updatedState,
      textQuery: message,
      limit: 3
    });

    // 4. Run deterministic multi-metric reasoning pipeline
    const pipelineResult = await runEnvironmentalScientistPipeline(updatedState as EnvironmentalInput);

    const ai = getAI();

    // If Gemini is available, synthesize response grounded strictly on the retrieved evidence & variables
    if (ai) {
      try {
        const knowledgeContext = retrievalResult.items.map(k => (
          `[Source: ${k.source} (${k.year}) | Title: ${k.title}]\nCondition: ${k.condition}\nMechanism: ${k.mechanism}\nExpected effect: ${k.expectedEffect}\nEvidence: ${k.evidence}`
        )).join('\n\n');

        const systemPrompt = `You are the Lead Environmental Scientist for Darukaa.Earth AI Biodiversity Intelligence.
You behave as an empirical, rigorous environmental scientist, NOT a generic chatbot.

CRITICAL DIRECTIVES:
1. UNDERSTAND multi-variable interactions (soil carbon ↔ water retention, rainfall ↔ soil moisture, land use ↔ habitat fragmentation, etc.).
2. MEMORY: Always retain variables provided earlier in the conversation. Current environmental state: ${JSON.stringify(updatedState)}.
3. CLARIFYING QUESTIONS: If critical environmental variables are missing (current missing: ${missing.join(', ')}), DO NOT blurt generic advice like "Plant more trees". Ask the user targeted clarifying questions to accurately evaluate their soil, rainfall, and land use context.
4. ANTI-HALLUCINATION: Never fabricate studies, sources, or URLs. Only cite the retrieved evidence provided below. If evidence is insufficient for quantitative numbers, explicitly state: "Evidence insufficient for a reliable quantitative estimate."
5. If recommending actions when sufficient variables exist (>=3 variables), structure your response clearly:
   - Concise Scientific Evaluation of interacting factors
   - Explicit Section: ### RECOMMENDATION
   - Explicit Section: ### WHY IT WORKS
   - Explicit Section: ### ENVIRONMENTAL MECHANISM
   - Explicit Section: ### IMPACTED METRICS
   - Explicit Section: ### TIME HORIZON
   - Explicit Section: ### EXPECTED OUTCOME
   - Explicit Section: ### CONFIDENCE
   - Explicit Section: ### EVIDENCE (Citing specific retrieved studies)

RETRIEVED SCIENTIFIC KNOWLEDGE:
${knowledgeContext}

CONVERSATION HISTORY:
${history.slice(-4).map((h: any) => `${h.sender === 'user' ? 'User' : 'Scientist'}: ${h.content}`).join('\n')}

USER MESSAGE: "${message}"`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: systemPrompt,
        });

        const replyContent = geminiResponse.text || '';

        return res.json({
          reply: replyContent,
          extractedVariables: extracted,
          currentEnvState: updatedState,
          missingVariables: missing,
          clarificationNeeded: !isSufficientForRecommendation,
          clarifyingQuestions,
          reasoningFactors: pipelineResult.reasoningFactors,
          retrievedKnowledge: retrievalResult.items,
          recommendations: pipelineResult.recommendations,
          scientificRationale: pipelineResult.reasoningFactors.scientificRationale
        });
      } catch (geminiError: any) {
        console.warn('Gemini API execution error, falling back to local scientist engine:', geminiError.message);
      }
    }

    // Deterministic Scientist Fallback (when offline, no API key, or fallback)
    let fallbackReply = '';

    if (!isSufficientForRecommendation) {
      fallbackReply = `I am analyzing your observation: "${message}". As an environmental scientist, I cannot prescribe interventions without understanding the interacting ecological variables that drive this decline.\n\nTo conduct a rigorous multi-metric assessment, please provide:\n${clarifyingQuestions.map(q => `• ${q}`).join('\n')}`;
    } else {
      const topRec = pipelineResult.recommendations[0];
      fallbackReply = `Based on the environmental variables you've provided (Region: ${updatedState.region || 'Identified'}, Land Use: ${updatedState.land_use || 'Noted'}, SOC: ${updatedState.soil?.organic_carbon_percent ?? 'Noted'}%, Rainfall: ${updatedState.rainfall || 'Noted'}), here is the evidence-backed scientific assessment:\n\n${pipelineResult.reasoningFactors.scientificRationale}\n\n### RECOMMENDATION\n${topRec ? topRec.recommendation : 'Initiate soil carbon and vegetative cover regeneration.'}\n\n### WHY IT WORKS\n${topRec ? topRec.whyItWorks : 'Restores soil water retention and microhabitat niches.'}\n\n### ENVIRONMENTAL MECHANISM\n${topRec ? topRec.environmentalMechanism : 'Increases organic binding sites and root biological activity.'}\n\n### IMPACTED METRICS\n${topRec ? topRec.impactedMetrics.map(m => `• ${m}`).join('\n') : '• Soil organic carbon\n• Habitat diversity'}\n\n### TIME HORIZON\n${topRec ? topRec.timeHorizon : 'Medium term'}\n\n### EXPECTED OUTCOME\n${topRec ? topRec.expectedOutcome : 'Evidence insufficient for a reliable quantitative estimate.'}\n\n### CONFIDENCE\n${topRec ? topRec.confidence : 'High'}\n\n### EVIDENCE\n${topRec?.evidence.map(e => `• ${e.source} (${e.year}): "${e.findingQuote}"`).join('\n') || 'FAO Global Soil Partnership (2020)'}`;
    }

    res.json({
      reply: fallbackReply,
      extractedVariables: extracted,
      currentEnvState: updatedState,
      missingVariables: missing,
      clarificationNeeded: !isSufficientForRecommendation,
      clarifyingQuestions,
      reasoningFactors: pipelineResult.reasoningFactors,
      retrievedKnowledge: retrievalResult.items,
      recommendations: pipelineResult.recommendations,
      scientificRationale: pipelineResult.reasoningFactors.scientificRationale
    });

  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Chat processing error' });
  }
});

// ----------------- VITE / STATIC SERVING -----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 Darukaa.Earth AI Environmental Scientist server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
