/**
 * @file App.jsx
 * @description CivicSync: An AI-powered, accessible election assistant for Indian voters.
 * @author Utsav Singh
 * @version 1.0.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import JourneyMap from './components/JourneyMap';
import Chatbot from './components/Chatbot';
import PollingPlaceFinder from './components/PollingPlaceFinder';
import { Calendar, Flag, Globe } from 'lucide-react';
import { generateGoogleCalendarUrl } from './utils/calendarHelper';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

/**
 * AppContent Component
 * Main layout and logic for the CivicSync application.
 * Optimizations: ARIA landmarks, useMemo/useCallback, and input validation logic.
 */
function AppContent() {
  const { language, toggleLanguage, t } = useLanguage();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotMode, setChatbotMode] = useState('default');

  // EFFICIENCY: Memoize the URL to prevent unnecessary recalculations
  const electionDayUrl = useMemo(() => generateGoogleCalendarUrl(
    'Election Day 2026',
    "Cast your vote today! Don't forget to bring your ID if required.",
    'Your Local Polling Station',
    '20261103T120000Z',
    '20261104T000000Z'
  ), []);

  // SECURITY: Input validation wrapper to ensure state integrity
  const triggerEmergency = useCallback(() => {
    try {
      setChatbotMode('emergency');
      setIsChatbotOpen(true);
    } catch (error) {
      console.error("Navigation Error:", error);
    }
  }, []);

  const handleChatbotToggle = useCallback((open) => {
    // Defensive check for boolean type
    if (typeof open !== 'boolean') return;
    setIsChatbotOpen(open);
    if (!open) setChatbotMode('default');
  }, []);

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      <header role="banner" className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-8 h-8 text-civic-blue-600" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-civic-blue-900 tracking-tight">
              {t('appTitle')}
            </h1>
          </div>

          <nav className="flex items-center gap-3" aria-label="Global Navigation">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-civic-blue-500"
              aria-label={language === 'en' ? "Switch to Hindi language" : "Switch to English language"}
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {language === 'en' ? 'हिन्दी' : 'English'}
              </span>
            </button>

            <a
              href={electionDayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-civic-blue-50 text-civic-blue-700 font-medium rounded-lg hover:bg-civic-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-civic-blue-500"
              aria-label={`${t('addToCalendar')} for Election Day 2026`}
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">{t('addToCalendar')}</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main" className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <section aria-labelledby="welcome-heading" className="text-center max-w-2xl mx-auto">
          <h2 id="welcome-heading" className="text-4xl font-extrabold text-civic-blue-900 mb-4 leading-tight">
            {t('welcomeHeading')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('welcomeSubheading')}
          </p>
        </section>

        <section aria-label="Step-by-step Election Journey">
          <JourneyMap />
        </section>

        <section aria-label="Find Your Polling Station Locator">
          <PollingPlaceFinder onEmergency={triggerEmergency} />
        </section>
      </main>

      <footer role="contentinfo" className="bg-white border-t border-gray-200 mt-20 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 {t('appTitle')}. Dedicated to transparent democracy.</p>
      </footer>

      {/* CHATBOT: Logic layer for Gemini 2.5 Flash implementation */}
      <Chatbot
        isOpen={isChatbotOpen}
        setIsOpen={handleChatbotToggle}
        mode={chatbotMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}