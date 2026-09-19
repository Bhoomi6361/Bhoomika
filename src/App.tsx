import React, { useState, useEffect } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ScientistPage } from './pages/ScientistPage';
import { ScenarioSimulatorPage } from './pages/ScenarioSimulatorPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { HistoryPage } from './pages/HistoryPage';
import { MethodologyPage } from './pages/MethodologyPage';
import {
  EnvironmentalAssessment,
  EnvironmentalInput
} from './types/environmental';
import {
  initializeDefaultAssessments,
  createDemoAssessment,
  saveAssessment
} from './services/assessmentStorage';
import { Menu, X, CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [currentAssessment, setCurrentAssessment] = useState<EnvironmentalAssessment | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState<boolean>(false);
  const [demoLoaded, setDemoLoaded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with demo challenge assessment on startup
    initializeDefaultAssessments().then(saved => {
      if (saved.length > 0) {
        setCurrentAssessment(saved[0]);
      }
    });
  }, []);

  const handleLoadDemo = async () => {
    setIsLoadingDemo(true);
    try {
      const demo = await createDemoAssessment();
      saveAssessment(demo);
      setCurrentAssessment(demo);
      setActivePage('dashboard');
      setMobileMenuOpen(false);
      setDemoLoaded(true);
      setToastMessage('Darukaa.Earth Challenge Demo Case loaded successfully: Semi-Arid Monoculture Wheat');
      setTimeout(() => {
        setDemoLoaded(false);
      }, 4000);
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Failed to load demo scenario:', err);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const handleAssessmentCompleted = (newAssessment: EnvironmentalAssessment) => {
    setCurrentAssessment(newAssessment);
    setToastMessage(`Assessment complete: ${newAssessment.title}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const defaultFallbackInput: EnvironmentalInput = {
    region: 'Semi-arid',
    land_use: 'Monoculture wheat',
    soil: {
      organic_carbon_percent: 0.3,
      moisture_percent: 12
    },
    rainfall: 'Low',
    water_availability: 'low',
    habitat_diversity: 'low',
    species_richness: 'low'
  };

  return (
    <div className="flex h-screen w-full bg-stone-100 text-stone-900 font-sans antialiased overflow-hidden">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Persistent Sidebar (Desktop) & Slide-over Drawer (Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex shrink-0`}
      >
        <Sidebar
          activePage={activePage}
          onSelectPage={page => {
            setActivePage(page);
            setMobileMenuOpen(false);
          }}
          onLoadDemo={handleLoadDemo}
          isLoadingDemo={isLoadingDemo}
          demoLoaded={demoLoaded}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center bg-white border-b border-stone-200">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-4 text-stone-600 hover:text-stone-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1 min-w-0">
            <Header
              activePage={activePage}
              onSelectPage={setActivePage}
              activeEcosystem={currentAssessment?.input.ecosystem_type || currentAssessment?.input.region}
              hasAssessmentData={!!currentAssessment}
            />
          </div>
        </div>

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activePage === 'dashboard' && (
              <DashboardPage
                assessment={currentAssessment}
                onNavigate={setActivePage}
                onLoadDemo={handleLoadDemo}
              />
            )}

            {activePage === 'assessment' && (
              <AssessmentPage
                onAssessmentCompleted={handleAssessmentCompleted}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'scientist' && (
              <ScientistPage
                initialAssessment={currentAssessment}
                onSyncAssessment={setCurrentAssessment}
              />
            )}

            {activePage === 'simulator' && (
              <ScenarioSimulatorPage
                currentInput={currentAssessment?.input || defaultFallbackInput}
              />
            )}

            {activePage === 'knowledge' && <KnowledgeBasePage />}

            {activePage === 'history' && (
              <HistoryPage
                onSelectAssessment={setCurrentAssessment}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'methodology' && <MethodologyPage />}
          </div>
        </main>
      </div>

      {/* Floating Status / Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium text-stone-200 leading-snug flex-1">
            {toastMessage}
          </p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
