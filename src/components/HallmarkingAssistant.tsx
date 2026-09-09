import React, { useState } from 'react';
import { 
  Gem, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const HallmarkingAssistant: React.FC = () => {
  const [huidInput, setHuidInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'valid' | 'invalid';
    article?: string;
    caratage?: string;
    jewellerName?: string;
    ahcCenter?: string;
    hallmarkedDate?: string;
  } | null>(null);

  const handleVerifyHUID = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const clean = huidInput.trim().toUpperCase();
    if (clean.length !== 6) {
      setErrorMessage('A valid HUID is strictly a 6-digit alphanumeric code (e.g., A8K2F9 or B4M9Z1).');
      return;
    }

    // Demonstrative verified simulation
    setVerificationResult({
      status: 'valid',
      article: 'Gold Necklace / Choker Piece',
      caratage: '22K (916 Fineness)',
      jewellerName: 'Certified BIS Registered Jeweller #DL-8849',
      ahcCenter: 'BIS Recognized AHC #AHC-042 (New Delhi)',
      hallmarkedDate: '2024-02-14'
    });
  };

  const purityGrades = [
    { carat: '24K', fineness: '995', usage: 'Gold Coins, Bars, Investment Ingots' },
    { carat: '23K', fineness: '958', usage: 'Traditional temple jewellery, high purity crafts' },
    { carat: '22K', fineness: '916', usage: 'Standard Indian bridal jewellery, chains, bangles' },
    { carat: '20K', fineness: '833', usage: 'Custom durable ornaments, gem-studded jewellery' },
    { carat: '18K', fineness: '750', usage: 'Diamond jewellery, stud earrings, designer rings' },
    { carat: '14K', fineness: '585', usage: 'Lightweight modern daily wear jewellery' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold mb-3 border border-amber-200">
          <Gem className="w-3.5 h-3.5 text-amber-600" />
          <span>Precious Metals &amp; Jewellery Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          BIS Hallmarking Assistant
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Protect your investment against gold adulteration. Learn the 3 mandatory hallmarks, verify 6-character HUID codes, and check purity fineness standards.
        </p>
      </div>

      {/* 3 Mandatory Symbols on Gold Jewellery */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-bis-blue uppercase tracking-wider">
            Statutory Consumer Rule under IS 1417:2016
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            The 3 Mandatory Marks on Every Piece of Hallmarked Gold
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Since 1st April 2023, sale of gold jewellery without 6-digit HUID is strictly prohibited across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Symbol 1 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white border border-amber-300 mx-auto flex items-center justify-center text-amber-700 font-black text-sm shadow-xs">
              △ BIS
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              1. BIS Standard Mark
            </h3>
            <p className="text-xs text-slate-600">
              The iconic triangular BIS logo certifying conformity to Indian Standards.
            </p>
          </div>

          {/* Symbol 2 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white border border-amber-300 mx-auto flex items-center justify-center text-amber-700 font-black text-xs shadow-xs font-mono">
              22K916
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              2. Purity in Carats &amp; Fineness
            </h3>
            <p className="text-xs text-slate-600">
              Indicates gold content (e.g. 22K916 means 91.6% pure gold, 18K750 means 75% gold).
            </p>
          </div>

          {/* Symbol 3 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white border border-amber-300 mx-auto flex items-center justify-center text-amber-700 font-black text-xs shadow-xs font-mono tracking-widest">
              A8K2F9
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              3. 6-Digit Alphanumeric HUID
            </h3>
            <p className="text-xs text-slate-600">
              Hallmark Unique Identification Number laser-etched on each ornament, traceable on BIS CARE.
            </p>
          </div>

        </div>
      </div>

      {/* Interactive HUID Verification Simulator */}
      <div className="max-w-3xl mx-auto bg-bis-navy text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-bis-blue/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">HUID Authenticity Verifier</h3>
              <p className="text-xs text-slate-300">Simulates real-time verification on the official BIS CARE App</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-md uppercase tracking-wider">
            DEMO / SIMULATION — NOT OFFICIAL VERIFICATION (SIH DEMO DATA)
          </span>
        </div>

        <form onSubmit={handleVerifyHUID} className="space-y-4">
          <div>
            <label htmlFor="huid-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter 6-Character HUID laser engraved on your gold jewellery:
            </label>
            <div className="flex gap-2">
              <input
                id="huid-input"
                type="text"
                maxLength={6}
                value={huidInput}
                onChange={(e) => {
                  setHuidInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="e.g. A8K2F9"
                className="flex-1 text-base sm:text-lg font-mono uppercase tracking-widest px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 focus:border-amber-400 focus:outline-none text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Verify HUID</span>
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-2">
              Sample HUIDs to test: <button type="button" onClick={() => { setHuidInput('A8K2F9'); setErrorMessage(null); }} className="text-amber-400 underline font-mono">A8K2F9</button>, <button type="button" onClick={() => { setHuidInput('B4M9Z1'); setErrorMessage(null); }} className="text-amber-400 underline font-mono">B4M9Z1</button>
            </p>
          </div>
        </form>

        {verificationResult && (
          <div className="bg-white/10 border border-amber-500/40 rounded-xl p-4 space-y-3 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>SIMULATED HUID RECORD FOUND</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                DEMO / SIMULATION — NOT OFFICIAL VERIFICATION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Article Type:</span>
                <span className="font-semibold">{verificationResult.article}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Purity Grade:</span>
                <span className="font-semibold text-amber-300">{verificationResult.caratage}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Assaying Centre (AHC):</span>
                <span>{verificationResult.ahcCenter}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Registered Jeweller:</span>
                <span>{verificationResult.jewellerName}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>For legally binding live verification, use the official <strong>BIS CARE</strong> mobile application.</span>
              <a 
                href="https://www.services.bis.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>BIS Care Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Standard Gold Purity Fineness Table */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Recognized Indian Gold Purity Grades (IS 1417)
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Caratage</th>
                <th className="px-4 py-3">Fineness (Parts per 1000)</th>
                <th className="px-4 py-3">Gold Content (%)</th>
                <th className="px-4 py-3">Typical Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {purityGrades.map((g) => (
                <tr key={g.carat} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-bis-blue font-mono">{g.carat}</td>
                  <td className="px-4 py-3 font-mono text-slate-800">{g.fineness}</td>
                  <td className="px-4 py-3 font-semibold text-amber-800">
                    {(Number(g.fineness) / 10).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-slate-600">{g.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
