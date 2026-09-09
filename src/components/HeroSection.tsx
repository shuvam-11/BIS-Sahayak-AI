import React from 'react';
import { 
  MessageSquareText, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  FileCheck2, 
  FlaskConical, 
  Gem, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { KnowledgeCore3D } from './KnowledgeCore3D';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  language: LanguageCode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white pt-6 pb-14 border-b border-slate-200/70">
      {/* Background Subtle Geometry */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-100/40 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Ministry Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-bis-blue animate-pulse" />
              <span className="text-bis-blue font-semibold">DoCA Ministry Initiative</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Intelligent Guide to{' '}
                <span className="text-bis-blue">
                  Indian Standards
                </span>{' '}
                &amp; BIS Services
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Ask questions, discover relevant standards, understand certification requirements, explore testing guidance, and get source-backed BIS information — all in one place.
              </p>
            </div>

            {/* Core Trust Pillar: Source or Refuse Badge */}
            <div className="flex flex-wrap items-center gap-3 py-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source or Refuse Engine</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bis-blue/5 border border-bis-blue/20 text-xs font-semibold text-bis-blue">
                <ShieldCheck className="w-3.5 h-3.5 text-bis-blue" />
                <span>Zero Hallucinated Standards</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Exact Clause Citations</span>
              </div>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('chat')}
                id="hero-ask-ai-btn"
                className="px-6 py-3.5 rounded-xl bg-bis-blue hover:bg-bis-blue-hover text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group"
              >
                <MessageSquareText className="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform" />
                <span>{t.askAIBtn}</span>
                <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('finder')}
                id="hero-find-standard-btn"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-600" />
                <span>{t.findStandardBtn}</span>
              </button>
            </div>

            {/* Fast Example Queries */}
            <div className="pt-2 border-t border-slate-200/80">
              <p className="text-xs font-medium text-slate-500 mb-2">Try asking directly:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Stainless steel water bottle standard',
                  'Domestic pressure cooker safety tests',
                  'Two-wheeler helmet certification',
                  'How does gold hallmarking work?'
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      // Store into query transfer and navigate
                      localStorage.setItem('bis_sahayak_prefill', example);
                      onNavigate('chat');
                    }}
                    className="text-xs bg-white hover:bg-bis-blue/5 text-slate-700 hover:text-bis-blue px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: 3D BIS Knowledge Core Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-white/90 to-blue-50/50 border border-slate-200 shadow-lg p-2 overflow-hidden backdrop-blur-xs">
              <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 bg-white/70 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-semibold text-slate-600 ml-2">BIS Knowledge Core 3D</span>
                </div>
                <span className="text-[10px] text-bis-blue bg-bis-blue/10 px-2 py-0.5 rounded font-mono font-semibold">
                  RAG • HYBRID SEARCH
                </span>
              </div>

              {/* Three.js Canvas */}
              <KnowledgeCore3D 
                onNodeClick={(cat) => {
                  if (cat === 'Indian Standards') onNavigate('finder');
                  else if (cat === 'Certification') onNavigate('certification');
                  else if (cat === 'Testing') onNavigate('testing');
                  else onNavigate('chat');
                }} 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
