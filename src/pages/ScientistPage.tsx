import React, { useState, useRef, useEffect } from 'react';
import {
  ChatMessage,
  EnvironmentalInput,
  EnvironmentalAssessment
} from '../types/environmental';
import { sendMessageToScientist } from '../services/aiScientistService';
import { createDemoAssessment } from '../services/assessmentStorage';
import { RecommendationCard } from '../components/RecommendationCard';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { ReasoningFactorsBadge } from '../components/ReasoningFactorsBadge';
import {
  Microscope,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Database,
  BrainCircuit,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronRight,
  BookOpenCheck,
  Play
} from 'lucide-react';

interface ScientistPageProps {
  initialAssessment?: EnvironmentalAssessment | null;
  onSyncAssessment?: (assessment: EnvironmentalAssessment) => void;
}

export const ScientistPage: React.FC<ScientistPageProps> = ({
  initialAssessment,
  onSyncAssessment
}) => {
  // Conversational state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialAssessment) {
      return [
        {
          id: 'welcome-with-data',
          sender: 'scientist',
          content: `Greetings. I am your Lead AI Environmental Scientist for Darukaa.Earth. I have pre-loaded your active assessment for the **${initialAssessment.input.region || 'Assessed'}** ecosystem.\n\nMy reasoning engine evaluates multi-variable causal interactions across soil physics, rainfall gradients, trophic food webs, and habitat fragmentation. You may query specific intervention strategies, test variable shocks, or examine the underlying empirical literature.`,
          timestamp: new Date().toISOString(),
          currentEnvState: initialAssessment.input,
          reasoningFactors: initialAssessment.reasoningFactors,
          retrievedKnowledge: initialAssessment.retrievedKnowledge,
          recommendations: initialAssessment.recommendations
        }
      ];
    }
    return [
      {
        id: 'welcome-clean',
        sender: 'scientist',
        content: `Greetings. I am your Lead AI Environmental Scientist for Darukaa.Earth. Unlike generic conversational chatbots, my system operates on empirical ecological principles, retrievable scientific literature (FAO, IPCC, UNEP, IUCN), and multi-variable reasoning.\n\nTo begin, describe the environmental conditions of your land or state an ecological problem (e.g. "Biodiversity is declining on my land"). I will extract relevant variables, retain conversational memory, detect missing variables, and formulate evidence-backed recommendations.`,
        timestamp: new Date().toISOString(),
        currentEnvState: {}
      }
    ];
  });

  // Cumulative Environmental State in Conversational Memory
  const [envMemory, setEnvMemory] = useState<Partial<EnvironmentalInput>>(() => {
    return initialAssessment?.input || {};
  });

  // Sync memory if initialAssessment changes from sidebar or dashboard
  useEffect(() => {
    if (initialAssessment?.input) {
      setEnvMemory(initialAssessment.input);
    }
  }, [initialAssessment]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleLoadDemoIntoScientist = async () => {
    setIsLoading(true);
    try {
      const demo = await createDemoAssessment();
      setEnvMemory(demo.input);

      const demoMsg: ChatMessage = {
        id: `demo-loaded-${Date.now()}`,
        sender: 'scientist',
        content: `### Challenge Reference Case Loaded: Semi-Arid Monoculture Wheat\n\nI have retrieved and calibrated all 10+ interacting environmental variables into working conversational memory:\n\n• **Biome / Region**: ${demo.input.region} (Continuous winter wheat monoculture across 45 hectares)\n• **Soil Condition**: Topsoil organic carbon severely depleted at **${demo.input.soil?.organic_carbon_percent}%**, pH ${demo.input.soil?.ph}, moisture ${demo.input.soil?.moisture_percent}%\n• **Precipitation**: Unimodal winter rainfall &lt;320 mm/yr (high hydrological deficit)\n• **Ecosystem Health**: Low habitat diversity, declining pollinator richness, high heat/thermal stress\n\n${demo.reasoningFactors.scientificRationale}`,
        timestamp: new Date().toISOString(),
        currentEnvState: demo.input,
        reasoningFactors: demo.reasoningFactors,
        retrievedKnowledge: demo.retrievedKnowledge,
        recommendations: demo.recommendations,
        scientificRationale: demo.reasoningFactors.scientificRationale
      };

      setMessages(prev => [...prev, demoMsg]);
      if (onSyncAssessment) {
        onSyncAssessment(demo);
      }
    } catch (err: any) {
      console.error('Failed to load demo into scientist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessageToScientist(text, messages, envMemory);

      // Update conversational variable memory
      if (response.currentEnvState) {
        setEnvMemory(response.currentEnvState);
      }

      // Add scientist response
      const scientistMsg: ChatMessage = {
        id: `scientist-${Date.now()}`,
        sender: 'scientist',
        content: response.reply,
        timestamp: new Date().toISOString(),
        extractedVariables: response.extractedVariables,
        currentEnvState: response.currentEnvState,
        missingVariables: response.missingVariables,
        clarifyingQuestions: response.clarifyingQuestions,
        reasoningFactors: response.reasoningFactors,
        retrievedKnowledge: response.retrievedKnowledge,
        recommendations: response.recommendations,
        scientificRationale: response.scientificRationale
      };

      setMessages(prev => [...prev, scientistMsg]);
    } catch (err: any) {
      console.error('Scientist conversation error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'scientist',
        content: `Error evaluating environmental variables: ${err.message}. Please verify your input.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'scientist',
        content: 'Conversational memory reset. Please provide new land, soil, or climate observations.',
        timestamp: new Date().toISOString(),
        currentEnvState: {}
      }
    ]);
    setEnvMemory({});
  };

  // Sample prompt chips illustrating Darukaa challenge requirements
  const samplePrompts = [
    'Biodiversity is declining on my land.',
    'My region is semi-arid, rainfall is low, land is monoculture wheat.',
    'Soil organic carbon is 0.3% and water availability is low.',
    'What scientific mechanism connects low rainfall with depleted soil organic carbon?'
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row gap-4 pb-2">
      {/* Left Column: Conversational Memory & Live Extracted Variables */}
      <div className="w-full md:w-80 shrink-0 bg-white rounded-2xl border border-stone-200 p-4 flex flex-col justify-between shadow-xs overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              <span>Scientist Memory State</span>
            </div>

            <button
              onClick={handleResetConversation}
              title="Reset memory and conversation"
              className="p-1 text-stone-400 hover:text-stone-700 rounded transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="btn-load-demo-scientist"
            onClick={handleLoadDemoIntoScientist}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold tracking-wide transition border border-emerald-600/60 shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-200" />
            <span>Load Challenge Demo Case</span>
          </button>

          <p className="text-[11px] text-stone-500 leading-relaxed">
            The AI Scientist continuously tracks and accumulates environmental variables across conversation turns.
          </p>

          {/* Active Variable Ledger */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Currently Retained Variables
            </span>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <span className="text-stone-500 text-[11px]">Region / Biome:</span>
                <span className="font-semibold text-stone-900">
                  {envMemory.region || <span className="text-stone-400 font-normal italic">Unspecified</span>}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <span className="text-stone-500 text-[11px]">Soil Carbon (SOC):</span>
                <span className="font-semibold text-stone-900">
                  {envMemory.soil?.organic_carbon_percent !== undefined ? (
                    `${envMemory.soil.organic_carbon_percent}%`
                  ) : (
                    <span className="text-stone-400 font-normal italic">Unspecified</span>
                  )}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <span className="text-stone-500 text-[11px]">Rainfall:</span>
                <span className="font-semibold text-stone-900 truncate max-w-[120px]">
                  {envMemory.rainfall || <span className="text-stone-400 font-normal italic">Unspecified</span>}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <span className="text-stone-500 text-[11px]">Land Use:</span>
                <span className="font-semibold text-stone-900 truncate max-w-[120px]">
                  {envMemory.land_use || <span className="text-stone-400 font-normal italic">Unspecified</span>}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <span className="text-stone-500 text-[11px]">Water Availability:</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {envMemory.water_availability || (
                    <span className="text-stone-400 font-normal italic">Unspecified</span>
                  )}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <span className="text-stone-500 text-[11px]">Habitat Diversity:</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {envMemory.habitat_diversity || (
                    <span className="text-stone-400 font-normal italic">Unspecified</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Guidance Card */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-950 space-y-1.5 text-xs">
            <div className="font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Variable Constraint</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-900/80">
              To prevent shallow or generic hallucinations, recommendations require at least <strong>3 coupled variables</strong> before prescribing interventions.
            </p>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Sample Inquiries
          </span>
          <div className="space-y-1">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sp)}
                className="w-full text-left p-2 rounded-lg text-[11px] text-stone-600 hover:text-emerald-900 hover:bg-emerald-50 transition border border-stone-200/60 leading-snug line-clamp-2"
              >
                "{sp}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center & Right Column: Interactive Chat Thread */}
      <div className="flex-1 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'scientist' && (
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Microscope className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl p-4 space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white shadow-xs rounded-tr-none'
                    : 'bg-stone-50 text-stone-900 border border-stone-200 rounded-tl-none'
                }`}
              >
                {/* Header label & Timestamp */}
                <div className="flex items-center justify-between gap-4 text-[10px] font-semibold tracking-wider uppercase border-b pb-1.5 border-black/10">
                  <span>{msg.sender === 'user' ? 'Environmental Field Query' : 'AI Environmental Scientist'}</span>
                  <span className="opacity-70 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Main text content */}
                <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Clarifying Questions Block if missing data */}
                {msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Missing Critical Parameters — Clarifying Questions</span>
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {msg.clarifyingQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attached Reasoning Factors */}
                {msg.reasoningFactors && (
                  <ReasoningFactorsBadge reasoning={msg.reasoningFactors} compact={true} />
                )}

                {/* Attached Retrieved Knowledge Grounding */}
                {msg.retrievedKnowledge && msg.retrievedKnowledge.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-stone-600 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <BookOpenCheck className="w-4 h-4 text-emerald-600" />
                        Retrieved Scientific Studies ({msg.retrievedKnowledge.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {msg.retrievedKnowledge.map(k => (
                        <KnowledgeCard key={k.id} item={k} compact={true} showWhyRelevant={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Evidence-Backed Recommendations */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="space-y-3 pt-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Evidence-Backed Interventions
                    </div>
                    <div className="space-y-3">
                      {msg.recommendations.map(rec => (
                        <RecommendationCard key={rec.id} rec={rec} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-emerald-950 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-stone-500 py-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center animate-spin">
                <Microscope className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <span>Extracting variables & retrieving scientific literature...</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Cross-referencing soil organic carbon, rainfall gradients, and land-use interactions.
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 md:p-4 bg-stone-50 border-t border-stone-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="scientist-chat-input"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="State an environmental observation, soil parameter, or question (e.g., 'Soil organic carbon is 0.3%')..."
              className="flex-1 text-xs md:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white shadow-2xs"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              id="btn-send-scientist-message"
              className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition shadow-xs disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
