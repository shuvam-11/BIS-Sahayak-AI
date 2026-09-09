import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  Smartphone, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  PhoneCall, 
  ExternalLink,
  Info
} from 'lucide-react';

export const ConsumerHelp: React.FC = () => {
  const [cmlInput, setCmlInput] = useState('');
  const [cmlError, setCmlError] = useState<string | null>(null);
  const [licenseResult, setLicenseResult] = useState<{
    status: 'valid' | 'invalid';
    manufacturer?: string;
    product?: string;
    standardNumber?: string;
    factoryLocation?: string;
    validity?: string;
  } | null>(null);

  const handleVerifyCML = (e: React.FormEvent) => {
    e.preventDefault();
    setCmlError(null);
    const clean = cmlInput.trim().replace(/[^\d]/g, '');
    if (clean.length < 7) {
      setCmlError('A valid BIS License number (CM/L) contains 7 digits (e.g., 8400123).');
      return;
    }

    setLicenseResult({
      status: 'valid',
      manufacturer: 'Prestige Domestic Utensils Pvt Ltd',
      product: 'Domestic Pressure Cookers (Aluminium Alloy)',
      standardNumber: 'IS 2347:2017',
      factoryLocation: 'Hosur Industrial Complex, Tamil Nadu',
      validity: 'Active (Valid up to 31-Dec-2027)'
    });
  };

  const consumerFaqs = [
    {
      q: 'What is the difference between ISI Mark and BIS Hallmarking?',
      a: 'The ISI Mark (Scheme I) certifies industrial and consumer manufactured goods (like helmets, water bottles, pressure cookers, and cement) for quality and safety. Hallmarking specifically certifies the precious metal purity (Gold and Silver jewellery) along with a 6-digit HUID.'
    },
    {
      q: 'What should I look for on an ISI-marked product?',
      a: 'A genuine ISI mark must always display three things: 1. The standard ISI symbol, 2. The Indian Standard number on top (e.g. IS 2347), and 3. A 7-digit License number at the bottom in the format CM/L-XXXXXXX.'
    },
    {
      q: 'Can a shopkeeper legally sell non-ISI helmets or pressure cookers in India?',
      a: 'No. Both protective helmets (IS 4151) and pressure cookers (IS 2347) are strictly under mandatory Quality Control Orders (QCOs). Selling or importing them without a genuine BIS license is a cognizable legal offense under the BIS Act, 2016.'
    },
    {
      q: 'How can I report a fake or counterfeit ISI mark?',
      a: 'You can register a formal consumer grievance directly on the BIS CARE Mobile App (Android/iOS) or report to the Department of Consumer Affairs via the National Consumer Helpline (dial 1915 or visit consumerhelpline.gov.in).'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bis-blue/10 text-bis-blue text-xs font-semibold mb-3 border border-bis-blue/20">
          <HelpCircle className="w-3.5 h-3.5 text-bis-blue" />
          <span>Consumer Empowerment &amp; Grievance Redressal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          BIS Consumer Help
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Learn how to spot authentic standards, verify 7-digit CM/L license numbers, download the BIS CARE App, and file consumer safety grievances.
        </p>
      </div>

      {/* CM/L License Number Verifier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-bis-blue/10 flex items-center justify-center text-bis-blue">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Verify ISI License Number (CM/L)</h2>
            <p className="text-xs text-slate-500">Enter the 7-digit number printed below the ISI mark on any product</p>
          </div>
        </div>

        <form onSubmit={handleVerifyCML} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={cmlInput}
              onChange={(e) => {
                setCmlInput(e.target.value);
                if (cmlError) setCmlError(null);
              }}
              placeholder="e.g. 8400123 or CM/L-8400123"
              className="flex-1 text-sm font-mono px-4 py-2.5 rounded-xl border border-slate-300 focus:border-bis-blue outline-none text-slate-900 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-bis-blue hover:bg-bis-blue-hover text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verify Licence</span>
            </button>
          </div>
          {cmlError && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{cmlError}</span>
            </p>
          )}
          <p className="text-[11px] text-slate-400">
            Sample CM/L to test: <button type="button" onClick={() => { setCmlInput('8400123'); setCmlError(null); }} className="text-bis-blue underline font-mono">8400123</button> (Pressure Cooker)
          </p>
        </form>

        {licenseResult && (
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs space-y-2.5 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SIMULATED LICENCE RECORD FOUND</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                DEMO / SIMULATION — NOT OFFICIAL VERIFICATION (SIH DEMO DATA)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Manufacturer:</span>
                <span className="font-semibold text-slate-900">{licenseResult.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Standard Conformed:</span>
                <span className="font-mono font-semibold text-bis-blue">{licenseResult.standardNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Factory Unit:</span>
                <span>{licenseResult.factoryLocation}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Status:</span>
                <span className="text-emerald-700 font-semibold">{licenseResult.validity}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Official, live licence verification is available on the BIS portal or the BIS CARE mobile app.</span>
              <a
                href="https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bis-blue hover:text-bis-blue-hover underline inline-flex items-center gap-1 font-medium shrink-0"
              >
                <span>BIS Manakonline Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* BIS CARE App Banner */}
      <div className="max-w-3xl mx-auto rounded-2xl bg-bis-navy text-white p-6 shadow-md border border-bis-blue/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold text-bis-slate uppercase tracking-wider">
            Official Citizen App
          </span>
          <h3 className="text-lg font-bold">Download the Official "BIS CARE" App</h3>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Verify ISI marks, check gold HUID, scan QR codes on electrical goods, and submit complaints against sub-standard products instantly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <a
            href="https://play.google.com/store/apps/details?id=com.bis.biscare"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Smartphone className="w-4 h-4 text-bis-blue" />
            <span>Google Play Store</span>
          </a>
        </div>
      </div>

      {/* Consumer FAQs */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Frequently Asked Consumer Questions
        </h2>
        <div className="space-y-3">
          {consumerFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                <span className="text-bis-blue">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* National Consumer Helpline Helpline Card */}
      <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">National Consumer Helpline (DoCA)</h4>
            <p className="text-xs text-slate-500">Toll-free grievance hotline: Dial <strong>1915</strong> or visit consumerhelpline.gov.in</p>
          </div>
        </div>
        <a
          href="https://consumerhelpline.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-bis-blue hover:text-bis-blue-hover underline inline-flex items-center gap-1"
        >
          <span>INGRAM Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
