import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuickActionCard } from './components/QuickActionCard';
import { HowItWorks } from './components/HowItWorks';
import { ChatInterface } from './components/ChatInterface';
import { StandardFinder } from './components/StandardFinder';
import { CertificationGuide } from './components/CertificationGuide';
import { TestingLabAssistant } from './components/TestingLabAssistant';
import { HallmarkingAssistant } from './components/HallmarkingAssistant';
import { ConsumerHelp } from './components/ConsumerHelp';
import { Dashboard } from './components/Dashboard';
import { AdminKnowledge } from './components/AdminKnowledge';
import { Footer } from './components/Footer';
import { ResponsibleAIModal } from './components/ResponsibleAIModal';
import { LanguageCode } from './types';
import { Scale } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isResponsibleAIModalOpen, setIsResponsibleAIModalOpen] = useState<boolean>(false);

  // Scroll to top upon tab transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-bis-blue/20 selection:text-bis-blue">
      {/* Sticky Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onLanguageChange={setLanguage}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <HeroSection 
              onNavigate={setCurrentTab} 
              language={language} 
            />
            <QuickActionCard 
              onSelectAction={setCurrentTab} 
            />
            <HowItWorks />
          </div>
        )}

        {currentTab === 'chat' && (
          <ChatInterface 
            language={language} 
            onLanguageChange={setLanguage}
            isDemoMode={isDemoMode}
          />
        )}

        {currentTab === 'finder' && (
          <StandardFinder />
        )}

        {currentTab === 'certification' && (
          <CertificationGuide />
        )}

        {currentTab === 'testing' && (
          <TestingLabAssistant />
        )}

        {currentTab === 'hallmarking' && (
          <HallmarkingAssistant />
        )}

        {currentTab === 'consumer' && (
          <ConsumerHelp />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard onNavigate={setCurrentTab} />
        )}

        {currentTab === 'admin' && (
          <AdminKnowledge />
        )}
      </main>

      {/* Floating Trust & Responsible AI Pill Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsResponsibleAIModalOpen(true)}
          className="px-3.5 py-2 rounded-full bg-bis-navy/95 hover:bg-bis-navy text-white text-xs font-semibold shadow-lg backdrop-blur-md border border-bis-border flex items-center gap-2 hover:scale-105 transition-all"
          title="Open Responsible AI & Trust Framework"
        >
          <Scale className="w-3.5 h-3.5 text-bis-slate" />
          <span className="hidden sm:inline">Source or Refuse Guard</span>
          <span className="w-2 h-2 rounded-full bg-bis-emerald" />
        </button>
      </div>

      {/* Responsible AI Modal */}
      <ResponsibleAIModal
        isOpen={isResponsibleAIModalOpen}
        onClose={() => setIsResponsibleAIModalOpen(false)}
      />

      {/* Site Footer */}
      <Footer
        onNavigate={setCurrentTab}
        onOpenResponsibleAI={() => setIsResponsibleAIModalOpen(true)}
        language={language}
      />
    </div>
  );
}
