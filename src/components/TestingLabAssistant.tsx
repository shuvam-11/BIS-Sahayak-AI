import React, { useState } from 'react';
import { 
  FlaskConical, 
  Building2, 
  MapPin, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BIS_STANDARDS, BIS_LABORATORIES } from '../data/bisKnowledgeBase';
import { BISStandard, BISLaboratory } from '../types';

export const TestingLabAssistant: React.FC = () => {
  const [selectedStandardId, setSelectedStandardId] = useState<string>(BIS_STANDARDS[0].id);
  const [filterRegion, setFilterRegion] = useState<string>('All');

  const currentStandard = BIS_STANDARDS.find(s => s.id === selectedStandardId) || BIS_STANDARDS[0];

  // Eligible labs for this standard
  const eligibleLabs = BIS_LABORATORIES.filter(lab => {
    const matchesStandard = lab.recognizedStandards.some(stdNum => 
      stdNum.includes(currentStandard.standardNumber.split(':')[0])
    );
    if (filterRegion === 'All') return matchesStandard;
    return matchesStandard && (lab.category === filterRegion || lab.state.includes(filterRegion));
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold mb-3 border border-amber-200">
          <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
          <span>Quality &amp; Conformity Testing Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Testing &amp; Laboratory Assistant
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Identify essential mechanical, chemical, and electrical safety tests mandated by Indian Standards and locate authorized BIS testing laboratories.
        </p>
      </div>

      {/* Select Product / Standard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs max-w-4xl mx-auto space-y-3">
        <label htmlFor="test-standard-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Select Standard / Product to Inspect Test Protocol:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {BIS_STANDARDS.map((std) => (
            <button
              key={std.id}
              onClick={() => setSelectedStandardId(std.id)}
              className={`text-left p-3 rounded-xl border text-xs transition-all ${
                selectedStandardId === std.id
                  ? 'border-bis-blue bg-bis-blue/10 font-semibold text-bis-blue shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono font-bold block text-bis-blue">{std.standardNumber}</span>
              <span className="line-clamp-1 mt-0.5 text-slate-600">{std.productsCovered[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Standard Details & Required Tests */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Required Tests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-bis-blue bg-bis-blue/10 px-2.5 py-0.5 rounded border border-bis-blue/20">
                  {currentStandard.standardNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {currentStandard.title}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {currentStandard.testRequirements.length} Mandatory Tests
              </span>
            </div>

            <div className="space-y-3">
              {currentStandard.testRequirements.map((test, i) => (
                <div 
                  key={i}
                  className="rounded-xl border border-slate-200/90 p-3.5 bg-slate-50/50 hover:bg-white hover:border-bis-blue/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-bis-blue" />
                      <span>{test.testName}</span>
                    </h4>
                    <span className="text-[10px] font-mono font-semibold text-bis-blue bg-bis-blue/10 px-2 py-0.5 rounded">
                      {test.clauseRef}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-700">Purpose: </strong>
                    {test.purpose}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded border border-slate-100">
                    Parameters: {test.parameters}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authorized BIS Laboratories */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-bis-blue" />
                <span>Recognized Laboratories</span>
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified Directory
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Samples drawn during application processing must be sent to authorized BIS Central/Regional laboratories or BIS-recognized NABL testing institutions.
            </p>

            <div className="space-y-3">
              {eligibleLabs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                  Testing facilities currently mapped to Central Laboratory, Sahibabad.
                </div>
              ) : (
                eligibleLabs.map((lab) => (
                  <div 
                    key={lab.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-900">
                        {lab.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
                        {lab.category}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{lab.address || `${lab.city}, ${lab.state}`}</span>
                      </div>
                      {lab.contactEmail && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px] text-bis-blue">{lab.contactEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              *Never accept test certificates from unauthorized or unregistered commercial testing facilities.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
