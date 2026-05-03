import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, Mic } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PollingPlaceFinder({ onEmergency }) {
  const { language, t } = useLanguage();
  const [submittedLocation, setSubmittedLocation] = useState("New Delhi");
  const [searchInput, setSearchInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchInput(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const input = searchInput.trim();
    if (input) {
      setSubmittedLocation(input);
      setHasSearched(true);
    }
  };

  const handleGetDirections = () => {
    // Construct directions using the "smart" polling station query
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("polling stations near " + submittedLocation + ", India")}`;
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 glass-panel rounded-2xl mt-8 print-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 hide-on-print">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-civic-blue-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-civic-blue-900" id="polling-title">{t('findPollingTitle')}</h2>
        </div>
        
        <button
          onClick={onEmergency}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 animate-pulse border border-red-200"
          aria-label="Emergency AI Helper"
        >
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm">{t('emergencyBtn')}</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6 hide-on-print" aria-labelledby="polling-title">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('addressPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-civic-blue-500 focus:ring-2 focus:ring-civic-blue-200 transition-all pr-12"
            aria-label="Residential address"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-gray-100 hover:text-civic-blue-600'}`}
            aria-label="Voice Search"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-civic-blue-600 text-white font-medium rounded-xl hover:bg-civic-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-civic-blue-500 flex items-center gap-2 disabled:opacity-50"
          disabled={!searchInput.trim()}
          aria-label="Search for polling place"
        >
          <Navigation className="w-4 h-4" />
          {t('findBtn')}
        </button>
      </form>

      {hasSearched && (
        <div className="bg-civic-blue-50 border border-civic-blue-100 rounded-xl p-4 mb-6 animate-in fade-in duration-300 print-header">
          <h3 className="font-semibold text-civic-blue-900">Showing map area for:</h3>
          <p className="text-civic-blue-800 mt-1 capitalize">{submittedLocation}</p>
          <p className="text-sm text-civic-blue-600 mt-1">{t('hours')}</p>
        </div>
      )}

      <div className="w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative h-80 sm:h-96 shadow-inner print-map">
        <iframe
          title="Polling Station Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(submittedLocation + ", India")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full animate-in fade-in duration-500"
        ></iframe>
      </div>

      {hasSearched && (
        <div className="flex flex-col sm:flex-row justify-center mt-6 gap-4 animate-in fade-in duration-300 hide-on-print">
          <button
            onClick={handleGetDirections}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            aria-label="Get Directions to Polling Station"
          >
            {t('getDirections')}
          </button>
          
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-900 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            aria-label="Print Voting Pass"
          >
            {t('printPass')}
          </button>
        </div>
      )}
    </div>
  );
}
