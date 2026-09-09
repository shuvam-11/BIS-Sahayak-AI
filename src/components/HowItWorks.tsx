import React from 'react';
import { 
  HelpCircle, 
  Cpu, 
  SearchCode, 
  ShieldCheck, 
  Sparkles, 
  FileText
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'ASK',
      desc: 'User describes a product, standard requirement, or compliance query in plain natural language.',
      icon: HelpCircle,
      highlight: 'Plain Natural Language'
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      desc: 'AI parses the product category, material grade, and user intent (standard, testing, or certification).',
      icon: Cpu,
      highlight: 'Intent & Scope Extraction'
    },
    {
      num: '03',
      title: 'RETRIEVE',
      desc: 'Hybrid Search queries authorized BIS Indian Standards, QCO orders, and laboratory specifications.',
      icon: SearchCode,
      highlight: 'Hybrid Semantic + Keyword'
    },
    {
      num: '04',
      title: 'VERIFY',
      desc: 'Source or Refuse principle evaluates retrieved evidence. No hallucinations or guessed IS numbers.',
      icon: ShieldCheck,
      highlight: 'Source or Refuse Guard'
    },
    {
      num: '05',
      title: 'EXPLAIN',
      desc: 'Converts dense bureaucratic standards language into clear, actionable steps for businesses & citizens.',
      icon: Sparkles,
      highlight: 'Simple Technical Translation'
    },
    {
      num: '06',
      title: 'SOURCE',
      desc: 'Outputs exact standard number, relevant clause citation, laboratory contacts, and official portal links.',
      icon: FileText,
      highlight: 'Verifiable Document Citations'
    },
  ];

  return (
    <section className="py-14 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How BIS Sahayak Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            A reliable 6-stage Retrieval-Augmented Generation (RAG) pipeline engineered for zero hallucination and government-grade trust.
          </p>
        </div>

        {/* 6 Step Cards with visual progression */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-blue-900/30 font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span>{step.title}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-800 flex items-center gap-1">
                  <span>Pillar:</span>
                  <span className="text-slate-700">{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
