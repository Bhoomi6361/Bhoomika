import React, { useState } from 'react';
import { EnvironmentalAssessment } from '../types/environmental';
import {
  getSavedAssessments,
  deleteAssessment
} from '../services/assessmentStorage';
import {
  History,
  GitCompare,
  Trash2,
  Download,
  Eye,
  ArrowRight,
  Sprout,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface HistoryPageProps {
  onSelectAssessment: (assessment: EnvironmentalAssessment) => void;
  onNavigate: (page: PageId) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectAssessment,
  onNavigate
}) => {
  const [assessments, setAssessments] = useState<EnvironmentalAssessment[]>(() =>
    getSavedAssessments()
  );

  const [compareId1, setCompareId1] = useState<string | null>(null);
  const [compareId2, setCompareId2] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this assessment record from local storage?')) {
      deleteAssessment(id);
      setAssessments(getSavedAssessments());
      if (compareId1 === id) setCompareId1(null);
      if (compareId2 === id) setCompareId2(null);
    }
  };

  const handleExportJson = (assessment: EnvironmentalAssessment, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(assessment, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${assessment.id}_darukaa_assessment.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const a1 = assessments.find(a => a.id === compareId1);
  const a2 = assessments.find(a => a.id === compareId2);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Ecological Audit Trail</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            Saved Environmental Assessments
          </h3>
          <p className="text-xs text-stone-500">
            Review previous multi-metric analyses, export JSON schemas, or execute side-by-side comparative audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border ${
              isComparing
                ? 'bg-emerald-800 text-white border-emerald-900'
                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>{isComparing ? 'Close Comparison View' : 'Compare 2 Assessments'}</span>
          </button>
        </div>
      </div>

      {/* Comparison View Drawer */}
      {isComparing && (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-sm border border-stone-800 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-emerald-400" />
                Side-by-Side Environmental Comparison
              </h4>
              <p className="text-xs text-stone-400">
                Select any two assessments to evaluate changes in biodiversity, soil carbon, and water resilience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slot 1 */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-300 block">Assessment A (Baseline)</label>
              <select
                value={compareId1 || ''}
                onChange={e => setCompareId1(e.target.value || null)}
                className="w-full text-xs p-2.5 rounded-lg bg-stone-800 text-stone-100 border border-stone-700 outline-none"
              >
                <option value="">-- Choose First Assessment --</option>
                {assessments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({new Date(a.timestamp).toLocaleDateString()})
                  </option>
                ))}
              </select>

              {a1 && (
                <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700 space-y-3 text-xs">
                  <div className="font-bold text-white text-sm">{a1.title}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Overall Health:</span>
                      <strong className="text-emerald-400 text-sm">
                        {a1.scores.overallBiodiversityHealth ?? 'N/A'}/100
                      </strong>
                    </div>
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Soil Health:</span>
                      <strong className="text-white text-sm">{a1.scores.soilHealth ?? 'N/A'}/100</strong>
                    </div>
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Soil Organic Carbon:</span>
                      <strong className="text-white">
                        {a1.input.soil?.organic_carbon_percent ?? 'N/A'}%
                      </strong>
                    </div>
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Rainfall:</span>
                      <strong className="text-white capitalize">{a1.input.rainfall || 'N/A'}</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-300 line-clamp-3">
                    {a1.reasoningSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Slot 2 */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-300 block">Assessment B (Comparison)</label>
              <select
                value={compareId2 || ''}
                onChange={e => setCompareId2(e.target.value || null)}
                className="w-full text-xs p-2.5 rounded-lg bg-stone-800 text-stone-100 border border-stone-700 outline-none"
              >
                <option value="">-- Choose Second Assessment --</option>
                {assessments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({new Date(a.timestamp).toLocaleDateString()})
                  </option>
                ))}
              </select>

              {a2 && (
                <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700 space-y-3 text-xs">
                  <div className="font-bold text-white text-sm">{a2.title}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Overall Health:</span>
                      <strong className="text-emerald-400 text-sm">
                        {a2.scores.overallBiodiversityHealth ?? 'N/A'}/100
                      </strong>
                    </div>
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Soil Health:</span>
                      <strong className="text-white text-sm">{a2.scores.soilHealth ?? 'N/A'}/100</strong>
                    </div>
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Soil Organic Carbon:</span>
                      <strong className="text-white">
                        {a2.input.soil?.organic_carbon_percent ?? 'N/A'}%
                      </strong>
                    </div>
                    <div className="p-2 bg-stone-900 rounded">
                      <span className="text-stone-400 block">Rainfall:</span>
                      <strong className="text-white capitalize">{a2.input.rainfall || 'N/A'}</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-300 line-clamp-3">
                    {a2.reasoningSummary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List of Assessments */}
      <div className="space-y-3">
        {assessments.map(a => (
          <div
            key={a.id}
            onClick={() => {
              onSelectAssessment(a);
              onNavigate('dashboard');
            }}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-500 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {a.id}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(a.timestamp).toLocaleString()}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {a.input.region || 'Semi-arid'}
                </span>
              </div>

              <h4 className="font-bold text-base text-stone-900 leading-snug">
                {a.title}
              </h4>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {a.reasoningSummary}
              </p>

              {/* Quick Metrics */}
              <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap pt-1">
                <span>
                  Biodiversity Score:{' '}
                  <strong className="text-stone-900">
                    {a.scores.overallBiodiversityHealth ?? 'N/A'}/100
                  </strong>
                </span>
                <span>•</span>
                <span>
                  SOC:{' '}
                  <strong className="text-stone-900">
                    {a.input.soil?.organic_carbon_percent ?? 'N/A'}%
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Recommendations:{' '}
                  <strong className="text-emerald-700">{a.recommendations.length} interventions</strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              <button
                onClick={e => handleExportJson(a, e)}
                title="Export JSON"
                className="p-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={e => handleDelete(a.id, e)}
                title="Delete Assessment"
                className="p-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectAssessment(a);
                  onNavigate('dashboard');
                }}
                className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {assessments.length === 0 && (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-2">
            <p className="text-sm font-semibold text-stone-700">No saved assessments yet.</p>
            <p className="text-xs">
              Complete an environmental assessment or launch the AI Scientist to record new ecological data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
