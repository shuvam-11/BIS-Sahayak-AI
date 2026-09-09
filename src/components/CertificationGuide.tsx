import React, { useState } from 'react';
import { 
  FileCheck, 
  Building2, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ChevronRight,
  Calculator,
  ExternalLink
} from 'lucide-react';

export const CertificationGuide: React.FC = () => {
  const [selectedScheme, setSelectedScheme] = useState<'scheme1' | 'scheme2' | 'fmcs' | 'hallmarking'>('scheme1');
  const [isMSME, setIsMSME] = useState(true);

  const steps = [
    {
      num: 1,
      title: 'Identify Product & Specifications',
      desc: 'Accurately specify your manufactured or imported product, its raw materials, dimensions, and designated target use.'
    },
    {
      num: 2,
      title: 'Identify Applicable Indian Standard (IS)',
      desc: 'Obtain the latest gazetted Indian Standard version with all published amendments from the BIS portal.'
    },
    {
      num: 3,
      title: 'Check Legal Mandate (QCO Status)',
      desc: 'Verify if your product is covered under a mandatory Quality Control Order (QCO) issued by the relevant Ministry.'
    },
    {
      num: 4,
      title: 'Setup In-House Testing Laboratory',
      desc: 'Install required testing equipment and calibrate gauges per the Scheme of Inspection and Testing (SIT) stipulated by BIS.'
    },
    {
      num: 5,
      title: 'Prepare Compliance Documentation',
      desc: 'Compile factory layout, list of manufacturing machinery, test personnel qualifications, and raw material test certificates.'
    },
    {
      num: 6,
      title: 'Submit Application on Manakonline',
      desc: 'File Form-I on manakonline.in along with the statutory application fee and technical documentation.'
    },
    {
      num: 7,
      title: 'Factory Audit & Independent Testing',
      desc: 'A designated BIS Technical Officer inspects the plant, witnesses in-house testing, and draws an independent sample for BIS lab testing.'
    },
    {
      num: 8,
      title: 'Grant of Licence (CM/L Number)',
      desc: 'Upon satisfactory test report and audit clearance, BIS issues the Certification Marks Licence (CM/L number) to apply the ISI mark.'
    }
  ];

  const schemes = [
    {
      id: 'scheme1',
      name: 'Scheme I — Product Certification (ISI Mark)',
      applicableTo: 'Over 1,000 industrial, consumer, civil and electrical products (e.g. pressure cookers, cement, helmets, cables)',
      auditRequired: 'Yes, on-site physical factory inspection by BIS auditor',
      testingRequired: 'Both in-house testing capability and independent BIS laboratory test',
      markType: 'Standard ISI Mark with CM/L XXXXXXX licence number'
    },
    {
      id: 'scheme2',
      name: 'Scheme II — Compulsory Registration Scheme (CRS)',
      applicableTo: 'IT, electronics, and LED products under MeitY orders (e.g. laptops, LED lamps, mobile phones, smartwatches)',
      auditRequired: 'No factory audit required; purely document and lab-report based',
      testingRequired: 'Testing exclusively at BIS-recognized NABL laboratories in India',
      markType: 'Standard Registration Mark with R-XXXXXXXX number'
    },
    {
      id: 'fmcs',
      name: 'Foreign Manufacturers Certification Scheme (FMCS)',
      applicableTo: 'Overseas manufacturing units located outside India intending to export goods into India',
      auditRequired: 'Yes, international factory audit by BIS delegation team',
      testingRequired: 'Drawal of samples during audit and testing at BIS laboratories in India',
      markType: 'Standard ISI Mark with FMCS licence code'
    },
    {
      id: 'hallmarking',
      name: 'Hallmarking Scheme',
      applicableTo: 'Gold and silver jewellery and precious metal artefacts sold by registered jewellers',
      auditRequired: 'Assaying & Hallmarking Centres (AHC) audit and jeweller portal registration',
      testingRequired: 'Fire assay / XRF testing performed at BIS-recognized AHCs',
      markType: '3 Mandatory Marks: BIS Triangle + Purity (e.g. 22K916) + 6-character HUID'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-3 border border-blue-200">
          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Complete Regulatory Roadmap</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          BIS Certification Guide
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Step-by-step roadmap to obtain a BIS licence, understand Quality Control Orders (QCO), prepare testing infrastructure, and avoid compliance penalties.
        </p>
      </div>

      {/* Statutory Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5 max-w-4xl mx-auto">
        <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Guidance Note: </strong>
          Requirements, audit protocols, and testing fees vary significantly by product category, factory location, and certification scheme. Always verify current statutory forms on the official BIS portal (<strong>manakonline.in</strong>).
        </p>
      </div>

      {/* 8-Step Visual Process */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span>8-Step BIS Certification Roadmap</span>
          <span className="text-xs font-normal text-slate-500 font-mono">(Scheme I — ISI Mark)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st) => (
            <div 
              key={st.num}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-400 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                  {st.num}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheme Explorer Section */}
      <div className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          BIS Certification Schemes Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((sch) => (
            <div 
              key={sch.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-bis-blue/40 transition-all space-y-3"
            >
              <h3 className="text-sm font-bold text-bis-blue">
                {sch.name}
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scope &amp; Coverage:</span>
                  <p className="text-slate-700 font-medium">{sch.applicableTo}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Factory Audit:</span>
                  <p className="text-slate-700">{sch.auditRequired}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mark / Identification:</span>
                  <p className="text-emerald-800 font-semibold">{sch.markType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MSME Fee Estimator Card */}
      <div className="max-w-3xl mx-auto bg-bis-navy text-white rounded-2xl p-6 shadow-md border border-bis-blue/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Indicative Fee &amp; Timeline Estimator</h3>
          </div>
          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-600 px-2.5 py-1 rounded-md uppercase tracking-wider">
            DEMO / SIMULATION — NOT OFFICIAL STATUTORY QUOTE (SIH DEMO DATA)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span>Enterprise Classification:</span>
          <button
            onClick={() => setIsMSME(true)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              isMSME ? 'bg-bis-blue text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Micro / Small Enterprise (50% Concession)
          </button>
          <button
            onClick={() => setIsMSME(false)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              !isMSME ? 'bg-bis-blue text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Large / Medium Enterprise
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <span className="text-slate-300 block text-[11px]">Application Fee</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {isMSME ? '₹ 500' : '₹ 1,000'}
            </span>
            <span className="text-[10px] text-slate-400">Non-refundable filing charge</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <span className="text-slate-300 block text-[11px]">Annual Marking Fee</span>
            <span className="text-lg font-bold text-amber-300 mt-1 block">
              {isMSME ? '₹ 25,000*' : '₹ 50,000*'}
            </span>
            <span className="text-[10px] text-slate-400">*Varies by production quantity</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <span className="text-slate-300 block text-[11px]">Target Timeline</span>
            <span className="text-lg font-bold text-emerald-300 mt-1 block">
              30 – 60 Days
            </span>
            <span className="text-[10px] text-slate-400">Normal track under Citizen Charter</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Actual testing fees are billed separately based on independent laboratory price schedules.</span>
          <a
            href="https://manakonline.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bis-slate hover:text-white underline inline-flex items-center gap-1"
          >
            <span>Manakonline Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};
