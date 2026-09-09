import React from 'react';
import { X, ExternalLink, Copy, Check, FileCheck, ShieldAlert, BookOpen } from 'lucide-react';
import { StructuredAIResponse } from '../types';

interface SourcePanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: StructuredAIResponse['sources'];
  selectedStandardNumber?: string;
}

export const SourcePanelDrawer: React.FC<SourcePanelDrawerProps> = ({
  isOpen,
  onClose,
  sources,
  selectedStandardNumber
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyCitation = (source: StructuredAIResponse['sources'][0], idx: number) => {
    const citation = `${source.documentName} | Standard: ${source.standardNumber || 'N/A'} | Clause: ${source.clause || 'General Scope'} | Portal: ${source.officialPortalUrl || 'https://manakonline.in'}`;
    navigator.clipboard.writeText(citation);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-drawer-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-bis-blue/10 flex items-center justify-center text-bis-blue">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 id="source-drawer-title" className="text-base font-bold text-slate-900">
                Authoritative BIS Sources
              </h3>
              <p className="text-xs text-slate-500">Grounded evidence and clause verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close Source Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sources Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {sources.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No Authoritative BIS Source Found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Under the "Source or Refuse" principle, BIS Sahayak does not generate citations unless verifiable records exist.
              </p>
            </div>
          ) : (
            sources.map((src, i) => (
              <div 
                key={i} 
                className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        src.isAuthoritative 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {src.isAuthoritative ? '🟢 Authoritative BIS Source' : '🟡 Needs Verification'}
                      </span>
                      {src.isDemoData && (
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                          DEMO / SIMULATION — NOT OFFICIAL VERIFICATION (SIH DEMO DATA)
                        </span>
                      )}
                      {src.documentType && (
                        <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {src.documentType}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {src.documentName}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopyCitation(src, i)}
                    className="p-1.5 rounded-md hover:bg-white text-slate-500 hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all text-xs flex items-center gap-1 shrink-0"
                    title="Copy formal citation"
                  >
                    {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-medium">{copiedIndex === i ? 'Copied' : 'Cite'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Standard No</span>
                    <span className="font-semibold text-slate-800">{src.standardNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Section / Division</span>
                    <span className="font-semibold text-slate-800">{src.section || 'General'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Version / Edition</span>
                    <span className="font-semibold text-slate-800">{src.version || 'Current Edition'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Page Reference</span>
                    <span className="font-semibold text-slate-800">{src.page ? `Page ${src.page}` : 'Document Scope'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Last Updated</span>
                    <span className="font-semibold text-slate-800">{src.lastUpdated || 'Current'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verified / Retrieved</span>
                    <span className="font-semibold text-slate-800">{src.retrievalDate || new Date().toISOString().split('T')[0]}</span>
                  </div>
                </div>

                {src.clause && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-semibold mb-1">
                      Cited Clauses:
                    </span>
                    <p className="text-xs font-mono text-bis-blue bg-bis-blue/5 p-2 rounded border border-bis-blue/20">
                      {src.clause}
                    </p>
                  </div>
                )}

                {src.excerpt && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                    <span className="text-slate-500 block text-[11px] font-semibold mb-1">
                      Verbatim Document Excerpt:
                    </span>
                    <pre className="text-[11px] whitespace-pre-wrap font-sans text-slate-600 italic bg-slate-50 p-2 rounded">
                      {src.excerpt}
                    </pre>
                  </div>
                )}

                {/* Verification CTA Link */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> Authoritative BIS Reference
                  </span>
                  <a
                    href={src.officialPortalUrl || 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-bis-blue hover:text-bis-blue-hover underline"
                  >
                    <span>Verify on Manakonline</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
          Official Indian Standards are copyrighted publications of the Bureau of Indian Standards. Standards can be viewed and purchased through the official portal at{' '}
          <a href="https://manakonline.in" target="_blank" rel="noopener noreferrer" className="text-bis-blue hover:underline">
            manakonline.in
          </a>.
        </div>
      </div>
    </div>
  );
};
