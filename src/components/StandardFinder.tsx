import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Building2, 
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { searchBISKnowledge, extractProductUnderstanding } from '../services/ragEngine';
import { SearchMatch } from '../services/ragEngine';
import { SourcePanelDrawer } from './SourcePanelDrawer';
import { StructuredAIResponse } from '../types';

export const StandardFinder: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [material, setMaterial] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [industry, setIndustry] = useState('All');
  const [hasSearched, setHasSearched] = useState(false);
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [activeSources, setActiveSources] = useState<StructuredAIResponse['sources'] | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) return;

    const fullQuery = `${productName} ${material} ${intendedUse} ${industry !== 'All' ? industry : ''}`.trim();
    const results = searchBISKnowledge(fullQuery);
    setMatches(results);
    setHasSearched(true);
  };

  const industries = ['All', 'Domestic Utensils & Appliances', 'Electrical & Electronics', 'Automotive Safety', 'Food & Water', 'Construction Materials', 'Toys & Child Safety'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-3 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Product → Indian Standard Matcher</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find My Standard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Describe what you manufacture or distribute. Our hybrid RAG search identifies potentially applicable Indian Standards with exact scope evidence.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="product-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              What product do you manufacture, import, or use? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="product-name-input"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Stainless steel water bottles, domestic pressure cooker, LED lamp, bike helmet..."
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium"
                required
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Optional Refinement Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label htmlFor="material-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Material Composition (Optional)
              </label>
              <input
                id="material-input"
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Stainless steel 304, Aluminium, Plastic"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label htmlFor="intended-use-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Intended Use (Optional)
              </label>
              <input
                id="intended-use-input"
                type="text"
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
                placeholder="e.g. Drinking water storage, commercial kitchen"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label htmlFor="industry-select" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Industry Sector
              </label>
              <select
                id="industry-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-600 outline-none bg-white"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              id="standard-search-btn"
              className="px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Potentially Applicable Standards</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Search Results ({matches.length} matches found)
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Categorized &amp; Ranked by Re-ranking Engine
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                No Authoritative BIS Standard Found For This Description
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Under the "Source or Refuse" principle, BIS Sahayak does not invent standards. Try searching by broader product terms (e.g. "bottle", "cooker", "helmet", "led", "cement") or check the official BIS directory on manakonline.in.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, i) => {
                const std = match.standard;
                return (
                  <div
                    key={std.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                            {std.standardNumber}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            std.qcoMandatory 
                              ? 'bg-red-50 text-red-800 border border-red-200' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {std.qcoMandatory ? 'MANDATORY QCO' : 'Voluntary Scheme'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5">
                          {std.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Published: {std.year} • Category: {std.category} • Version: {std.version}
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveSources([{
                          documentName: std.sourceDocument,
                          standardNumber: std.standardNumber,
                          section: std.category,
                          clause: std.clauses.map(c => c.clauseNumber).join(', '),
                          version: std.version,
                          lastUpdated: std.lastUpdated,
                          officialPortalUrl: std.sourceUrl,
                          isAuthoritative: true,
                          excerpt: `Scope: "${std.scopeSummary}"\nKey Clause Requirement (${std.clauses[0]?.clauseNumber}): "${std.clauses[0]?.requirement}"`
                        }])}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 text-xs font-semibold text-blue-800 hover:bg-blue-50 transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect Sources &amp; Clauses</span>
                      </button>
                    </div>

                    {/* Scope & Applicability */}
                    <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-700 space-y-1.5">
                      <div>
                        <strong className="text-slate-900">Why Potentially Applicable: </strong>
                        <span>{match.relevanceExplanation}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900">Official Scope Summary: </strong>
                        <span>{std.scopeSummary}</span>
                      </div>
                    </div>

                    {/* Key Tested Clauses */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Key Tested Clauses &amp; Safety Mandates:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {std.clauses.map((c, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                            <span className="font-bold text-blue-900 block">{c.clauseNumber}: {c.clauseTitle}</span>
                            <span className="text-slate-600 line-clamp-2 mt-0.5">{c.requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer with Manakonline link */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Certification Scheme: <strong>{std.certificationScheme}</strong>
                      </span>
                      <a
                        href={std.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
                      >
                        <span>Official BIS Catalogue</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mandatory Statutory Disclaimer as specified in Section 13 */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Notice: </strong>
              Standard recommendations are informational and should be verified against current authoritative BIS information before making compliance decisions.
            </p>
          </div>
        </div>
      )}

      {/* Source Modal */}
      <SourcePanelDrawer
        isOpen={!!activeSources}
        onClose={() => setActiveSources(null)}
        sources={activeSources || []}
      />
    </div>
  );
};
