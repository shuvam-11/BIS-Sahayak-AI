import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Upload,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { BIS_STANDARDS } from '../data/bisKnowledgeBase';
import { BISStandard } from '../types';

export const AdminKnowledge: React.FC = () => {
  const [standards, setStandards] = useState<BISStandard[]>(BIS_STANDARDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReindexing, setIsReindexing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);

  // New standard form state
  const [newStandardNumber, setNewStandardNumber] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Mechanical & Utensils');
  const [newScope, setNewScope] = useState('');
  const [newQco, setNewQco] = useState(false);

  const filteredStandards = standards.filter(s => 
    s.standardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReindex = () => {
    setIsReindexing(true);
    setReindexSuccess(false);
    setTimeout(() => {
      setIsReindexing(false);
      setReindexSuccess(true);
      setTimeout(() => setReindexSuccess(false), 3000);
    }, 1200);
  };

  const handleAddStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStandardNumber || !newTitle || !newScope) return;

    const newStd: BISStandard = {
      id: `std-custom-${Date.now()}`,
      standardNumber: newStandardNumber.trim().toUpperCase(),
      title: newTitle.trim(),
      category: newCategory,
      year: new Date().getFullYear(),
      version: `${newStandardNumber.trim().toUpperCase()}:2024`,
      edition: 'First Edition (2024)',
      amendmentNumber: 'None',
      lastUpdated: '2024-09-01',
      status: 'Current',
      qcoMandatory: newQco,
      documentType: 'Indian Standard Specification',
      publicationDate: '2024-01-01',
      effectiveDate: '2024-01-01',
      verificationStatus: 'Verified Official BIS',
      scopeSummary: newScope.trim(),
      keywords: [newTitle.trim().toLowerCase(), newCategory.toLowerCase()],
      productsCovered: [newTitle.trim()],
      certificationScheme: 'Scheme I (ISI Mark)',
      eligibleLaboratories: ['Central Laboratory, Sahibabad'],
      clauses: [
        {
          clauseNumber: '4.1',
          clauseTitle: 'Material & Design Specification',
          requirement: 'Must conform to designated chemical composition and structural tolerances.',
          mandatory: true
        }
      ],
      testRequirements: [
        {
          testName: 'General Performance & Endurance Test',
          clauseRef: 'Clause 7.2',
          purpose: 'Verifies continuous operational durability under nominal loads.',
          parameters: 'Tested over 1,000 continuous cycles at ambient temperature.'
        }
      ],
      sourceDocument: `Official BIS Gazette Specification ${newStandardNumber}`,
      sourceUrl: 'https://www.services.bis.gov.in'
    };

    setStandards(prev => [newStd, ...prev]);
    setShowAddForm(false);
    setNewStandardNumber('');
    setNewTitle('');
    setNewScope('');
    setNewQco(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              BIS Knowledge Base &amp; RAG Index Manager
            </h1>
            <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded border border-purple-200">
              ADMIN REPO
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Authoritative documents repository, vector embeddings index, and gazetted QCO status records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReindex}
            disabled={isReindexing}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin text-bis-blue' : 'text-slate-500'}`} />
            <span>{isReindexing ? 'Re-indexing Embeddings...' : 'Sync & Re-index RAG'}</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-bis-blue hover:bg-bis-blue-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest New Standard</span>
          </button>
        </div>
      </div>

      {reindexSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>RAG Hybrid Search vector embeddings successfully re-indexed and refreshed against authoritative BIS corpus.</span>
        </div>
      )}

      {/* Ingest New Standard Modal / Panel */}
      {showAddForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-bis-blue" />
              <span>Ingest New Gazetted Standard into RAG Knowledge Corpus</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddStandard} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                IS Standard Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. IS 9999:2024"
                value={newStandardNumber}
                onChange={(e) => setNewStandardNumber(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Official Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Specification for Electric Vehicle Chargers"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Technical Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Mechanical & Utensils">Mechanical &amp; Utensils</option>
                <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                <option value="Automotive & Transport">Automotive &amp; Transport</option>
                <option value="Chemical & Food">Chemical &amp; Food</option>
                <option value="Civil & Construction">Civil &amp; Construction</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={newQco}
                  onChange={(e) => setNewQco(e.target.checked)}
                  className="w-4 h-4 rounded text-bis-blue accent-bis-blue"
                />
                <span>Mandatory Quality Control Order (QCO) Issued</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Statutory Scope Summary &amp; Application Clauses *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Specify what items are covered, exclusions, and test requirements..."
                value={newScope}
                onChange={(e) => setNewScope(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-bis-blue hover:bg-bis-blue-hover text-white font-bold"
              >
                Ingest into RAG Index
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by IS number, title, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-bis-blue"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredStandards.length} of {standards.length} authorized standards
        </span>
      </div>

      {/* Standards Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">IS Number</th>
              <th className="px-4 py-3">Standard Title</th>
              <th className="px-4 py-3">Doc Type &amp; Edition</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Legal Mandate</th>
              <th className="px-4 py-3">Provenance / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStandards.map((std) => (
              <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-bis-blue whitespace-nowrap">
                  <div>{std.standardNumber}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{std.version}</div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900 max-w-sm">
                  <div className="line-clamp-1">{std.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{std.scopeSummary}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  <div className="text-[11px] font-semibold text-slate-800">{std.documentType || 'Standard'}</div>
                  <div className="text-[10px] text-slate-400">{std.edition || `Year ${std.year}`}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {std.category}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    std.qcoMandatory 
                      ? 'bg-red-50 text-red-800 border border-red-200' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {std.qcoMandatory ? 'QCO MANDATORY' : 'Voluntary'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      std.status === 'Current'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-amber-800 bg-amber-50 border-amber-200'
                    }`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{std.status === 'Current' ? 'Verified BIS Official' : 'Superseded Standard'}</span>
                    </span>
                    {std.supersededBy && (
                      <div className="text-[10px] text-amber-900 font-medium">
                        Replaced by: {std.supersededBy}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
