import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Scale, 
  Sparkles, 
  Search, 
  FileText, 
  FlaskConical, 
  Gem, 
  Gauge, 
  Database, 
  PhoneCall, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenResponsibleAI: () => void;
  language: LanguageCode;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenResponsibleAI,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <footer className="relative bg-bis-navy text-bis-slate text-xs border-t border-slate-800/90 selection:bg-bis-blue selection:text-white">
      {/* Subtle national identity micro-accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-bis-saffron/30 via-bis-blue/50 to-bis-emerald/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Ministry Attribution */}
          <div className="space-y-4 lg:pr-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-bis-blue/30 border border-bis-blue/50 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  BIS Sahayak AI
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase font-mono">
                  DoCA · Bureau of Indian Standards
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Intelligent regulatory guide for Indian Standards &amp; BIS conformity assessment. Developed for Smart India Hackathon (Problem Statement 26107) under the Ministry of Consumer Affairs, Food &amp; Public Distribution.
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenResponsibleAI}
                className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-bis-blue/20 text-bis-slate hover:text-white border border-slate-800 hover:border-bis-blue/60 text-[11px] font-semibold transition-all duration-150 shadow-xs"
              >
                <Scale className="w-3.5 h-3.5 text-bis-slate group-hover:text-white transition-colors" />
                <span>Responsible AI &amp; Trust Framework</span>
              </button>
            </div>
          </div>

          {/* Col 2: Services & Tools */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bis-blue" />
              <span>Services &amp; Tools</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => onNavigate('chat')} 
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left w-full"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    Ask BIS AI Assistant
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('finder')} 
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left w-full"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    Find My Standard
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('certification')} 
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left w-full"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    8-Step Certification Roadmap
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('testing')} 
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left w-full"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    Testing &amp; Laboratory Assistant
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('hallmarking')} 
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left w-full"
                >
                  <Gem className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    Gold Hallmarking &amp; HUID Verifier
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('consumer')} 
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left w-full"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    Consumer Help &amp; CM/L Check
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: MSME & Compliance */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bis-blue" />
              <span>MSME &amp; Compliance</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left w-full"
                >
                  <Gauge className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    Compliance Readiness Index
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="group flex items-start gap-2 text-left w-full"
                >
                  <Database className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0 mt-0.5" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    <span className="block text-bis-slate group-hover:text-white transition-colors font-medium">
                      Standards RAG Corpus Index
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      Verified BIS Knowledge Base
                    </span>
                  </span>
                </button>
              </li>
              <li>
                <a 
                  href="https://www.bis.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    BIS Official Website (bis.gov.in)
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="https://manakonline.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    Manakonline Portal (e-BIS)
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.services.bis.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150 text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    BIS Conformance Portal
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Grievance & Verification with Source or Refuse Guard */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bis-emerald" />
              <span>Grievance &amp; Verification</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="https://consumerhelpline.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    National Consumer Helpline (1915)
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.bis.biscare" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-bis-slate hover:text-white transition-all duration-150"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-400 group-hover:text-bis-blue transition-colors shrink-0" />
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                    BIS CARE Mobile App
                  </span>
                </a>
              </li>
            </ul>

            {/* Source or Refuse Guard & Prominent RAG Trust Card */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-bis-emerald" />
                  </span>
                  <span className="text-[11px] font-bold tracking-wider text-emerald-400 font-mono">
                    SOURCE OR REFUSE GUARD
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/90 space-y-1">
                <div className="text-[11px] font-bold tracking-wide uppercase font-mono flex items-center justify-between">
                  <span className="text-slate-300">RAG PRINCIPLE:</span>
                  <span className="text-bis-slate font-extrabold">SOURCE OR REFUSE</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-snug font-medium">
                  Zero unverified standards generated.
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Refuses to speculate without verified BIS gazette &amp; clause citations.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Trust & Source or Refuse Pipeline Strip */}
        <div className="mt-8 pt-5 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-slate-300">Trust Architecture:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Official BIS Gazette
              </span>
              <span className="text-slate-600">→</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Clause-Level Index
              </span>
              <span className="text-slate-600">→</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-bis-blue/20 border border-bis-blue/40 text-bis-slate font-medium">
                Source or Refuse Guard
              </span>
              <span className="text-slate-600">→</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-900/60 text-emerald-300 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Zero Hallucination</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              DoCA · SIH PS 26107
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Legal attribution bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-center sm:text-left leading-relaxed max-w-3xl">
            AI assistance does not replace official BIS decisions, regulations or professional advice. Verify critical information with official BIS sources.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">
              Powered by Verified BIS Knowledge
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-bis-slate font-semibold tracking-wide">
              Government-Grade AI
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

