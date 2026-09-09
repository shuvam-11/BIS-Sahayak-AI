import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  MessageSquareText, 
  Search, 
  FileCheck, 
  FlaskConical, 
  Gem, 
  HelpCircle, 
  LayoutDashboard, 
  Database, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  isDemoMode,
  onToggleDemoMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navLinks = [
    { id: 'home', label: t.navHome, icon: ShieldCheck },
    { id: 'chat', label: t.navAskAI, icon: MessageSquareText },
    { id: 'finder', label: t.navFindStandard, icon: Search },
    { id: 'certification', label: t.navCertification, icon: FileCheck },
    { id: 'testing', label: t.navTesting, icon: FlaskConical },
    { id: 'hallmarking', label: t.navHallmarking, icon: Gem },
    { id: 'consumer', label: t.navConsumer, icon: HelpCircle },
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'admin', label: t.navAdmin, icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bis-navy/95 backdrop-blur-md border-b border-bis-border shadow-md">
      {/* Top Ministry Banner */}
      <div className="bg-bis-navy text-bis-slate text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center tracking-wide border-b border-bis-border/60">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-bis-saffron"></span>
          <span className="font-medium text-white">Ministry of Consumer Affairs, Food & Public Distribution</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-bis-slate hidden md:inline">Department of Consumer Affairs (DoCA)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-bis-blue/30 text-bis-slate px-2 py-0.5 rounded text-[10px] font-semibold border border-bis-blue/50">
            SIH PS: 26107
          </span>
          <button 
            onClick={onToggleDemoMode}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
              isDemoMode 
                ? 'bg-amber-950/60 text-amber-300 border-amber-600' 
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-600'
            }`}
            title="Toggle between Live BIS Knowledge Engine and Sample Demo Scenarios"
          >
            {isDemoMode ? '● DEMO DATA MODE' : '● VERIFIED BIS REPO'}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-bis-blue flex items-center justify-center text-white shadow-md border border-bis-blue-light/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight">BIS Sahayak AI</span>
            </div>
            <p className="text-[10px] text-bis-slate font-medium">Standards & Services Intelligence</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => onTabChange(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm ${
                  isActive
                    ? 'text-white bg-bis-blue font-semibold shadow-xs'
                    : 'text-bis-slate hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Language & CTA) */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-bis-border bg-bis-navy-card/80 text-xs font-medium text-bis-slate hover:text-white hover:border-slate-600 transition-colors"
              id="language-selector-btn"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-bis-blue-light" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-bis-navy-card rounded-xl shadow-xl border border-bis-border py-1 z-50 animate-in fade-in zoom-in-95">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      language === lang.code
                        ? 'bg-bis-blue text-white font-semibold'
                        : 'text-bis-slate hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onTabChange('chat')}
            id="nav-ask-ai-cta"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bis-blue hover:bg-bis-blue-hover text-white text-xs font-semibold shadow-xs transition-all hover:shadow"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>{t.askAIBtn}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-bis-border text-bis-slate hover:text-white hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-bis-border bg-bis-navy px-4 pt-3 pb-6 shadow-xl space-y-1 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onTabChange(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-bis-blue text-white font-semibold'
                    : 'text-bis-slate hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                onTabChange('chat');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-bis-blue hover:bg-bis-blue-hover text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>{t.askAIBtn}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
