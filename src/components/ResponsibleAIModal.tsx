import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  FileCheck2, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Scale
} from 'lucide-react';

interface ResponsibleAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResponsibleAIModal: React.FC<ResponsibleAIModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const principles = [
    {
      title: '1. Zero Hallucination: "Source or Refuse" Architecture',
      problem: 'Generic LLMs regularly hallucinate non-existent Indian Standard numbers (e.g. inventing IS 99999 for random products).',
      solution: 'BIS Sahayak strictly matches against the indexed BIS corpus. If evidence cannot be proven with exact standard citations, it explicitly refuses to invent standard numbers.'
    },
    {
      title: '2. Verbatim Clause Provenance & Citations',
      problem: 'Summaries often omit which exact technical clause governs tensile strength, burst pressure, or thermal limits.',
      solution: 'Every recommendation is accompanied by the exact clause number, title, and excerpt available in the interactive Source Drawer.'
    },
    {
      title: '3. Mandatory QCO Legal Disclosures',
      problem: 'Manufacturers can be penalized under the BIS Act, 2016 if they mistake a mandatory Quality Control Order for a voluntary scheme.',
      solution: 'Every standard card and AI response prominently flags QCO mandatory status and gazette enforcement deadlines.'
    },
    {
      title: '4. No Fabricated Testing Laboratories',
      problem: 'AI tools often invent fictitious testing labs or recommend unaccredited commercial entities.',
      solution: 'All testing recommendations query a verified catalog of authorized BIS Central/Regional and recognized NABL labs.'
    },
    {
      title: '5. Linguistic Equity across Indian Languages',
      problem: 'MSMEs and artisans in regional industrial clusters often struggle with dense English regulatory standards.',
      solution: 'Native language localization across English, Hindi, Odia, Bengali, Telugu, Tamil, and Marathi.'
    },
    {
      title: '6. Citizen Safety & Anti-Counterfeit Verification',
      problem: 'Consumers are misled by fake ISI marks or gold jewellery sold without valid HUID.',
      solution: 'Integrated CM/L 7-digit license checker and 6-digit HUID authenticity simulator aligned with BIS CARE app functionality.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="responsible-ai-title"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-bis-blue/40 flex items-center justify-between bg-bis-navy text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-bis-slate">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="responsible-ai-title" className="text-lg font-bold">
                Responsible AI &amp; Trust Framework
              </h2>
              <p className="text-xs text-bis-slate">
                How BIS Sahayak AI solves critical hallucination &amp; regulatory risks (SIH 26107)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 rounded-xl bg-bis-blue/10 border border-bis-blue/20 text-xs text-bis-blue leading-relaxed">
            <strong>Foundational Principle: </strong>
            Indian Standards are statutory, technical publications safeguarding consumer lives and industrial quality. AI assistance in this domain must be conservative, verifiable, and strictly grounded in authorized publications.
          </div>

          <div className="space-y-4">
            {principles.map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 hover:bg-white transition-colors"
              >
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.title}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-red-50/70 p-2.5 rounded-lg border border-red-100 text-red-900">
                    <span className="text-[10px] uppercase font-bold text-red-700 block mb-0.5">Known Risk:</span>
                    {item.problem}
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 text-emerald-900">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">Engine Solution:</span>
                    {item.solution}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Advisory Footer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Statutory Advisory: </strong>
              BIS Sahayak AI is an informational guidance tool built for Smart India Hackathon. It does not replace the statutory authority of the Bureau of Indian Standards (BIS) or official gazette notifications published on manakonline.in.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
