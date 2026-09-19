import React, { useState } from 'react';
import { ENVIRONMENTAL_KNOWLEDGE_BASE } from '../knowledge/knowledgeBase';
import { KnowledgeCard } from '../components/KnowledgeCard';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Database,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  const topics = [
    'all',
    'Soil Carbon & Moisture',
    'Agroforestry & Windbreaks',
    'Landscape Rewilding & Corridors',
    'Cover Cropping & Infiltration',
    'Microbial Inoculation',
    'Hedgerows & Pollinator Buffers'
  ];

  const sources = [
    'all',
    'FAO Global Soil Partnership',
    'IPCC SRCCL',
    'UNEP / FAO',
    'IUCN',
    'CABI Agriculture & Bioscience',
    'Global Change Biology'
  ];

  const filteredItems = ENVIRONMENTAL_KNOWLEDGE_BASE.filter(item => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mechanism.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.environmentalVariables.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTopic =
      selectedTopic === 'all' || item.topic.toLowerCase().includes(selectedTopic.toLowerCase());

    const matchesSource =
      selectedSource === 'all' || item.source.toLowerCase().includes(selectedSource.toLowerCase());

    return matchesSearch && matchesTopic && matchesSource;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Retrievable Scientific Repository</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            Peer-Reviewed Environmental Knowledge Base
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every recommendation and causal deduction in Darukaa.Earth is grounded in this curated scientific knowledge base. Unlike generic models that hallucinate citations, our system cites strictly verified studies from the FAO, IPCC, UNEP, IUCN, and leading agronomy journals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <span className="text-xl font-bold text-emerald-900 block">
              {ENVIRONMENTAL_KNOWLEDGE_BASE.length}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
              Studies Indexed
            </span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <span className="text-xl font-bold text-stone-900 block">100%</span>
            <span className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider">
              Empirically Verified
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              id="knowledge-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by variable (e.g. 'soil organic carbon'), mechanism, or crop type..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 outline-none"
            />
          </div>

          {/* Topic Filter */}
          <div className="sm:w-64">
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 outline-none bg-white font-medium text-stone-700"
            >
              <option value="all">All Topics ({ENVIRONMENTAL_KNOWLEDGE_BASE.length})</option>
              {topics.filter(t => t !== 'all').map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="sm:w-64">
            <select
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 outline-none bg-white font-medium text-stone-700"
            >
              <option value="all">All Global Sources</option>
              {sources.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Result Count */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>
            Showing <strong>{filteredItems.length}</strong> of{' '}
            {ENVIRONMENTAL_KNOWLEDGE_BASE.length} indexed scientific references
          </span>
          {(searchQuery || selectedTopic !== 'all' || selectedSource !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('all');
                setSelectedSource('all');
              }}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <KnowledgeCard key={item.id} item={item} compact={false} showWhyRelevant={false} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-2">
          <p className="text-sm font-semibold text-stone-700">No matching studies found.</p>
          <p className="text-xs">Try adjusting your search keywords or topic filter.</p>
        </div>
      )}
    </div>
  );
};
