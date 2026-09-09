import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Trash2, 
  Copy, 
  Check, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  FileText,
  Building2,
  FlaskConical,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Info,
  ExternalLink,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ListOrdered
} from 'lucide-react';
import { ChatMessage, StructuredAIResponse, LanguageCode } from '../types';
import { generateSourceGroundedResponse } from '../services/ragEngine';
import { SourcePanelDrawer } from './SourcePanelDrawer';
import { TRANSLATIONS } from '../i18n/translations';

interface ChatInterfaceProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDemoMode: boolean;
}

const SIH_DEMO_SCENARIOS = [
  {
    category: "1. Product → Standard",
    badge: "🟢 Verified Match",
    query: "I manufacture stainless steel water bottles. Which Indian Standard applies?",
    highlight: "Grounded match to IS 17526:2021 with exact scope evidence and mandatory QCO S.O. 3932(E)."
  },
  {
    category: "2. Certification & Testing",
    badge: "🟢 Tests & Clauses",
    query: "What are the mandatory safety tests, clauses, and certification scheme for domestic pressure cookers?",
    highlight: "Retrieves IS 2347:2017, hydrostatic & burst test clauses, Scheme-I ISI Mark, and recognized labs."
  },
  {
    category: "3. Complex Multi-Part",
    badge: "🟢 Multi-Step RAG",
    query: "Which standard applies, is certification mandatory, what tests are required, and which laboratory should I use for helmet?",
    highlight: "Decomposes complex multi-part compliance into 4 distinct verification findings for IS 4151:2015."
  },
  {
    category: "4. Superseded Standard",
    badge: "🟡 Critical Warning",
    query: "Is IS 4151:1993 still valid for two wheeler helmets or has it been replaced?",
    highlight: "Detects withdrawn standard, displays prominent warning banner, and redirects to active IS 4151:2015."
  },
  {
    category: "5. Source or Refuse",
    badge: "🔴 Zero Hallucination",
    query: "Which Indian Standard certifies an anti-gravity hoverboard?",
    highlight: "Strict refusal rule: Refuses to invent standard numbers, clauses, or certification rules without evidence."
  }
];

const INITIAL_SUGGESTIONS = [
  "I manufacture stainless steel water bottles. Which standard applies?",
  "Domestic pressure cooker mandatory safety tests & clauses",
  "Is IS 4151 helmet standard still valid or superseded?",
  "How does BIS certification work for electronic LED lamps?",
  "What is 6-digit HUID in gold hallmarking?"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  language,
  onLanguageChange,
  isDemoMode
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSourceModal, setActiveSourceModal] = useState<StructuredAIResponse['sources'] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const [inputNotification, setInputNotification] = useState<{ type: 'error' | 'info'; message: string } | null>(null);
  const [showJudgeScenarios, setShowJudgeScenarios] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or load chat from storage
  useEffect(() => {
    const saved = localStorage.getItem('bis_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // ignore error
      }
    }

    // Check if hero had a prefill query
    const prefill = localStorage.getItem('bis_sahayak_prefill');
    if (prefill) {
      localStorage.removeItem('bis_sahayak_prefill');
      handleSend(prefill);
    }
  }, []);

  // Save to storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('bis_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawText: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setUploadedFileName(null);
    setLoading(true);

    try {
      // Call backend /api/chat with fallback to client-side deterministic RAG
      let structuredRes: StructuredAIResponse;
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, language, isDemoMode }),
        });
        if (res.ok) {
          structuredRes = await res.json();
        } else {
          structuredRes = generateSourceGroundedResponse(query, isDemoMode);
        }
      } catch {
        // Offline / network failure fallback
        structuredRes = generateSourceGroundedResponse(query, isDemoMode);
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: structuredRes
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        errorMessage: 'The BIS knowledge service is temporarily unavailable. Please try again.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('bis_chat_history');
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (msgId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'BIS Sahayak AI Guidance',
        text: 'Source-backed answer on Indian Standards from BIS Sahayak AI',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSharedId(msgId);
      setTimeout(() => setSharedId(null), 2000);
    }
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setInputNotification({
        type: 'error',
        message: 'Voice recognition is not supported in this browser or iframe environment. Please type your query.'
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setInputNotification({
          type: 'info',
          message: 'Listening... Please speak clearly into your microphone.'
        });
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        setInputNotification(null);
      };
      recognition.onerror = (event: any) => {
        setIsListening(false);
        setInputNotification({
          type: 'error',
          message: event.error === 'not-allowed'
            ? 'Microphone permission was denied. Please allow microphone access or type your query.'
            : `Voice recognition encountered an issue (${event.error || 'unavailable'}). Please use text input.`
        });
      };
      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setInputNotification({
        type: 'error',
        message: 'Unable to initialize microphone speech recognition. Please type your query.'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce 5MB size limit
    if (file.size > 5 * 1024 * 1024) {
      setInputNotification({
        type: 'error',
        message: `File "${file.name}" exceeds the 5MB size limit. Please upload a smaller file.`
      });
      e.target.value = '';
      return;
    }

    setUploadedFileName(file.name);
    setInputNotification(null);

    const isTextFile = file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.md');

    if (isTextFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && typeof content === 'string') {
          const snippet = content.slice(0, 350).trim();
          setInputValue(`Product Spec (${file.name}): ${snippet}`);
          setInputNotification({
            type: 'info',
            message: `Loaded specification text from ${file.name}. Send to verify against Indian Standards.`
          });
        }
      };
      reader.onerror = () => {
        setInputNotification({
          type: 'error',
          message: `Could not read text content from ${file.name}. Please enter product details directly.`
        });
      };
      reader.readAsText(file);
    } else {
      // PDF, DOCX or other technical spec sheets
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setInputValue(`Product Specification: ${cleanName}. Please verify applicable Indian Standards, mandatory QCO status, and testing protocols.`);
      setInputNotification({
        type: 'info',
        message: `Attached specification document "${file.name}". Context prepared for verification.`
      });
    }
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              BIS Sahayak AI Assistant
            </h1>
            <span className="text-[10px] bg-bis-blue/10 text-bis-blue font-bold px-2 py-0.5 rounded border border-bis-blue/30">
              RAG • SOURCE OR REFUSE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ask anything about Indian Standards, certification requirements, lab testing, and hallmarking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-700 hover:border-red-200 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Clear current conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Trust Notice Bar & Quick SIH Audit Switch */}
      <div className="my-4 space-y-3">
        <div className="p-3 rounded-xl bg-bis-blue/5 border border-bis-blue/20 text-xs text-slate-800 flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-bis-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Authoritative Retrieval: </span>
              All answers are generated strictly from indexed Indian Standards (BIS catalog). The assistant adheres to the 
              <strong className="mx-1 underline decoration-bis-blue">Source or Refuse</strong> rule and refuses to fabricate standard numbers or clauses.
            </div>
          </div>
          <button
            onClick={() => setShowJudgeScenarios(!showJudgeScenarios)}
            className="text-[11px] font-bold text-bis-blue hover:text-bis-blue-hover underline shrink-0 whitespace-nowrap"
          >
            {showJudgeScenarios ? 'Hide SIH Scenarios' : 'Show SIH Audit Scenarios'}
          </button>
        </div>

        {/* Dedicated SIH Judge Demonstration Suite */}
        {showJudgeScenarios && (
          <div className="p-4 rounded-2xl bg-bis-navy text-white border border-bis-blue/40 shadow-md space-y-3 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight">
                  SIH Problem Statement 26107 — Evaluation &amp; Audit Test Suite
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-bis-blue/30 text-blue-200 border border-bis-blue/40 px-2 py-0.5 rounded">
                5 SPECIFIC TEST SCENARIOS
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SIH_DEMO_SCENARIOS.map((sc, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sc.query)}
                  className="text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-bis-blue transition-all group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">
                      {sc.category}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-amber-300">
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-bis-slate line-clamp-2 font-medium">
                    "{sc.query}"
                  </p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {sc.highlight}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="min-h-[360px] max-h-[620px] overflow-y-auto space-y-6 py-4 px-1">
        {messages.length === 0 ? (
          /* Empty State with Suggested Queries */
          <div className="text-center py-8 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-bis-blue/10 border border-bis-blue/20 mx-auto flex items-center justify-center text-bis-blue shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-800">
                Welcome to BIS Sahayak AI
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select an audit test scenario above, pick a suggested query below, or type your product specifications in natural language:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto text-left">
              {INITIAL_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="p-3 rounded-xl bg-white hover:bg-bis-blue/5 border border-slate-200 hover:border-bis-blue/40 text-xs text-slate-700 hover:text-bis-blue font-medium transition-all shadow-xs flex items-center justify-between group text-left"
                >
                  <span className="line-clamp-2">{sug}</span>
                  <span className="text-bis-blue opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const resp = msg.structuredResponse;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                {/* Role Header */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
                  <span className="font-semibold">{isUser ? 'You' : 'BIS Sahayak AI'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* User Message Bubble */}
                {isUser ? (
                  <div className="max-w-xl bg-bis-blue text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs text-sm leading-relaxed">
                    {msg.rawText}
                  </div>
                ) : msg.isError ? (
                  /* Error State Bubble */
                  <div className="max-w-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Unable to Complete Request</p>
                      <p className="mt-0.5">{msg.errorMessage}</p>
                    </div>
                  </div>
                ) : resp ? (
                  /* Structured AI Response Card */
                  <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5 rounded-tl-xs">
                    
                    {/* Top Reliability & Transparency Bar */}
                    <div className="pb-3 border-b border-slate-100 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center flex-wrap gap-2">
                          {resp.reliabilityLevel === 'VERIFIED' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>🟢 VERIFIED: Source-Backed</span>
                            </span>
                          ) : resp.reliabilityLevel === 'NEEDS_VERIFICATION' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shadow-2xs">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>🟡 NEEDS OFFICIAL VERIFICATION</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-900 border border-red-200 text-xs font-bold shadow-2xs">
                              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                              <span>🔴 NOT VERIFIED (Source or Refuse)</span>
                            </span>
                          )}

                          {resp.isDemoData && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase tracking-wider">
                              DEMO / SIMULATION — NOT OFFICIAL VERIFICATION (SIH DEMO DATA)
                            </span>
                          )}

                          {/* "Why am I seeing this answer?" Button */}
                          <button
                            onClick={() => setExpandedReasoning(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                            className="inline-flex items-center gap-1 text-xs text-bis-blue hover:text-bis-blue-hover font-medium px-2 py-0.5 rounded hover:bg-bis-blue/5 transition-colors ml-1"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-bis-blue" />
                            <span>Why this answer?</span>
                            {expandedReasoning[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(msg.id, resp.answer)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Copy Answer"
                          >
                            {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleShare(msg.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Share Answer"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Explicit Reliability Explanation Text */}
                      {resp.reliabilityReason && (
                        <p className="text-[11px] text-slate-500 font-medium pl-1">
                          <strong>Evidence State: </strong>{resp.reliabilityReason}
                        </p>
                      )}

                      {/* Expandable "Why am I seeing this answer?" Panel */}
                      {expandedReasoning[msg.id] && (
                        <div className="mt-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-200/60 pb-1.5">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-bis-blue" />
                              <span>Retrieval &amp; Verification Reasoning</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">Deterministic RAG Engine</span>
                          </div>
                          <div className="space-y-1.5 text-slate-600">
                            <div>
                              <strong className="text-slate-800">1. Query Parsing: </strong>
                              Identified product "{resp.productUnderstanding?.identifiedProduct}" with intent "{resp.productUnderstanding?.intent}".
                            </div>
                            <div>
                              <strong className="text-slate-800">2. Index Retrieval: </strong>
                              {resp.evidenceReasoning || 'Hybrid token matching matched against BIS catalog registry.'}
                            </div>
                            <div>
                              <strong className="text-slate-800">3. Verification Rule: </strong>
                              {resp.reliabilityLevel === 'VERIFIED'
                                ? 'Verified against official BIS standard catalog and Gazette Quality Control Orders. Zero speculative claims.'
                                : resp.reliabilityLevel === 'NEEDS_VERIFICATION'
                                ? 'Partial confidence or pending official classification confirmation for exact sub-grade.'
                                : 'Triggered strict Refuse rule: No official BIS record found to back this product safely.'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Superseded Standard High-Visibility Warning Banner */}
                    {(resp.applicableStandardDetails?.status === 'Superseded' || 
                      resp.applicableStandardDetails?.supersededWarning ||
                      resp.potentiallyApplicableStandards.some(s => s.status === 'Superseded')) && (
                      <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 space-y-1.5 animate-pulse-subtle">
                        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                          <span>SUPERSEDED STANDARD WARNING</span>
                        </div>
                        <p className="text-xs leading-relaxed">
                          {resp.applicableStandardDetails?.supersededWarning || 
                            'One or more standards referenced are superseded and withdrawn by the Bureau of Indian Standards. Manufacturing or applying under superseded specifications is legally invalid under Indian law.'}
                        </p>
                      </div>
                    )}

                    {/* Complex Question Multi-Task Decomposition */}
                    {resp.decomposedTasks && resp.decomposedTasks.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <ListOrdered className="w-4 h-4 text-bis-blue" />
                            <span>Query Decomposition &amp; Step-by-Step Evidence</span>
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">{resp.decomposedTasks.length} Sub-Tasks Verified</span>
                        </div>
                        <div className="space-y-2">
                          {resp.decomposedTasks.map((task, idx) => (
                            <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">{task.taskTitle}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  task.confidence === 'VERIFIED'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                                }`}>
                                  {task.confidence === 'VERIFIED' ? '🟢 Verified' : '🟡 Needs Verification'}
                                </span>
                              </div>
                              <p className="text-slate-700">{task.finding}</p>
                              {task.sourceRef && (
                                <p className="text-[10px] text-slate-400 italic">
                                  Source: {task.sourceRef}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 1: Understanding of the Query */}
                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        1. Understanding of Query
                      </span>
                      <p className="text-xs font-medium text-slate-700">
                        {resp.understandingText || `Identified product: "${resp.productUnderstanding?.identifiedProduct}" | Intent: "${resp.productUnderstanding?.intent}"`}
                      </p>
                    </div>

                    {/* Section 2: Direct Answer / Standard Determination */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        2. Direct Answer / Technical Determination
                      </h4>
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                        {resp.answer}
                      </p>
                    </div>

                    {/* Section 3: Applicable Indian Standard(s) */}
                    {resp.potentiallyApplicableStandards.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          3. Applicable Indian Standard(s)
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {resp.potentiallyApplicableStandards.map((std, i) => (
                            <div 
                              key={i}
                              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-bis-blue/40 transition-colors space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-bis-blue bg-bis-blue/10 px-2 py-0.5 rounded border border-bis-blue/25">
                                      {std.standardNumber}
                                    </span>
                                    {std.edition && (
                                      <span className="text-[10px] text-slate-500 font-medium">
                                        {std.edition}
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="text-sm font-bold text-slate-900 mt-1">
                                    {std.title}
                                  </h5>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                  std.status === 'Current' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {std.status}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600">
                                <strong className="text-slate-800">Why applicable: </strong>
                                {std.whyItMayApply}
                              </p>

                              <p className="text-xs text-slate-500 line-clamp-2">
                                <strong>Scope: </strong>{std.relevantScope}
                              </p>

                              {std.clauseRef && (
                                <div className="text-[11px] text-bis-blue bg-bis-blue/5 px-2.5 py-1 rounded border border-bis-blue/20 flex items-center justify-between">
                                  <span>Cited Reference: <strong>{std.clauseRef}</strong></span>
                                  {std.pageRef && <span>Page {std.pageRef}</span>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 4: Requirements Summary (Key Clauses & Testing Parameters) */}
                    {(resp.requirementsSummary || resp.testingGuidance) && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          4. Requirements Summary (Clauses &amp; Testing Parameters)
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Mandatory Clauses */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                              <FileText className="w-3.5 h-3.5 text-bis-blue" />
                              <span>Key Mandatory Clauses</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {resp.requirementsSummary?.keyClauses?.map((cl, idx) => (
                                <li key={idx} className="bg-white p-2 rounded-lg border border-slate-100 leading-snug">
                                  {cl}
                                </li>
                              )) || (
                                <li className="text-slate-500 italic">Clauses detailed in official standard specification.</li>
                              )}
                            </ul>
                          </div>

                          {/* Testing Parameters */}
                          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                              <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                              <span>Mandatory Testing Parameters</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {resp.testingGuidance?.requiredTests?.map((tst, idx) => (
                                <li key={idx} className="bg-white p-2 rounded-lg border border-amber-100 leading-snug">
                                  • {tst}
                                </li>
                              )) || (
                                <li className="text-slate-500 italic">Tests specified in standard test schedule.</li>
                              )}
                            </ul>
                            {resp.testingGuidance?.relevantLabs && resp.testingGuidance.relevantLabs.length > 0 && (
                              <div className="text-[11px] text-slate-600 pt-1 border-t border-amber-200/50">
                                <strong>Recognized Labs: </strong>
                                {resp.testingGuidance.relevantLabs.join('; ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section 5: Important Regulatory Notes */}
                    <div className="p-3.5 rounded-xl bg-bis-blue/5 border border-bis-blue/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-bis-blue" />
                          <span>5. Important Regulatory Notes</span>
                        </h4>
                        {resp.certificationGuidance && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            resp.certificationGuidance.isMandatoryByQCO
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {resp.certificationGuidance.isMandatoryByQCO ? 'MANDATORY QCO BY LAW' : 'Voluntary Scheme'}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {resp.importantNotes?.map((note, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-bis-blue font-bold shrink-0">•</span>
                            <span>{note}</span>
                          </li>
                        )) || (
                          <li className="leading-snug">
                            {resp.certificationGuidance?.legalMandateText || 'Compliance requirements governed by BIS Act 2016.'}
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Section 6: Verified Sources & Evidence Panel */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-bis-blue" />
                          <span>6. Verified Sources &amp; Evidence ({resp.sources.length})</span>
                        </h4>
                        {resp.sources.length > 0 && (
                          <button
                            onClick={() => setActiveSourceModal(resp.sources)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-bis-blue hover:text-bis-blue-hover underline"
                          >
                            <span>Open Full Source &amp; Clause Drawer</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {resp.sources.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {resp.sources.slice(0, 2).map((src, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 truncate">{src.standardNumber || 'Document'}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  Verified BIS
                                </span>
                              </div>
                              <p className="text-slate-600 text-[11px] line-clamp-1">{src.documentName}</p>
                              {src.clause && (
                                <p className="text-[10px] text-bis-blue bg-bis-blue/10 p-1 rounded font-mono">
                                  Clauses: {src.clause}
                                </p>
                              )}
                              <a
                                href={src.officialPortalUrl || 'https://manakonline.in'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-bis-blue hover:underline pt-1"
                              >
                                <span>Verify on BIS Portal</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                          No verified official source found. Under "Source or Refuse", unverified citations are withheld.
                        </p>
                      )}
                    </div>

                    {/* Section 7: Recommended Next Steps */}
                    {resp.nextSteps && resp.nextSteps.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>7. Recommended Next Steps for Compliance</span>
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {resp.nextSteps.map((step, idx) => (
                            <li key={idx} className="leading-snug">{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Section: Clarification Follow-up Questions (Solve Incomplete Information) */}
                    {resp.followUpQuestions && resp.followUpQuestions.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <HelpCircle className="w-3.5 h-3.5 text-bis-blue" />
                          <span>Clarification Questions to Refine Standard Determination:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {resp.followUpQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(q)}
                              className="text-xs text-left bg-white hover:bg-bis-blue/5 text-slate-700 hover:text-bis-blue px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                            >
                              "{q}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Feedback & Official Disclaimer */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400 text-[10px]">
                      <p className="italic leading-relaxed">
                        {resp.disclaimer || 'This assistant provides guidance based on retrieved sources and is not a replacement for official BIS decisions.'}
                      </p>

                      <div className="flex items-center gap-2 shrink-0">
                        <span>Helpful?</span>
                        <button
                          onClick={() => setFeedbackGiven(prev => ({ ...prev, [msg.id]: 'up' }))}
                          className={`p-1 rounded hover:bg-slate-100 ${feedbackGiven[msg.id] === 'up' ? 'text-emerald-600' : 'text-slate-400'}`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setFeedbackGiven(prev => ({ ...prev, [msg.id]: 'down' }))}
                          className={`p-1 rounded hover:bg-slate-100 ${feedbackGiven[msg.id] === 'down' ? 'text-red-600' : 'text-slate-400'}`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ) : null}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 w-fit">
            <div className="w-4 h-4 rounded-full border-2 border-bis-blue border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-slate-600 animate-pulse">
              Retrieving authorized BIS standards &amp; applying verification rules...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Upload attachment banner if attached */}
      {uploadedFileName && (
        <div className="mb-2 p-2 rounded-lg bg-bis-blue/10 border border-bis-blue/25 text-xs text-bis-blue flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" />
            <span>Attached file: <strong>{uploadedFileName}</strong></span>
          </div>
          <button
            onClick={() => setUploadedFileName(null)}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Remove
          </button>
        </div>
      )}

      {/* In-App Notification (Voice permission, file size limits, parsing status) */}
      {inputNotification && (
        <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center justify-between gap-2 animate-in fade-in ${
          inputNotification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-bis-blue/10 border-bis-blue/20 text-bis-blue'
        }`}>
          <div className="flex items-center gap-2">
            {inputNotification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-bis-blue shrink-0" />
            )}
            <span>{inputNotification.message}</span>
          </div>
          <button
            onClick={() => setInputNotification(null)}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded hover:bg-black/5 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Input Box */}
      <div className="mt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2 bg-white rounded-2xl border border-slate-300 p-2 shadow-sm focus-within:border-bis-blue focus-within:ring-2 focus-within:ring-bis-blue/20 transition-all"
        >
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Upload specification document or text sheet"
            aria-label="Upload document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-2 rounded-xl transition-colors ${
              isListening
                ? 'bg-red-100 text-red-600 animate-pulse'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isListening ? 'Stop listening' : 'Speak your question (Voice Input)'}
            aria-label="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 text-sm bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 px-2"
            disabled={loading}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            id="chat-send-btn"
            className="p-2.5 rounded-xl bg-bis-blue hover:bg-bis-blue-hover disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-2">
          Natural Language RAG • Powered by Authorized BIS Knowledge Base • Problem Statement 26107
        </p>
      </div>

      {/* Source Panel Drawer Modal */}
      <SourcePanelDrawer
        isOpen={!!activeSourceModal}
        onClose={() => setActiveSourceModal(null)}
        sources={activeSourceModal || []}
      />
    </div>
  );
};
