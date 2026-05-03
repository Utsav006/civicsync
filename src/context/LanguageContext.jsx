import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    appTitle: "CivicSync",
    addToCalendar: "Add to Calendar",
    welcomeHeading: "Your Personal Election Assistant",
    welcomeSubheading: "Navigate the election process with confidence. Track deadlines, find your polling station, and get your questions answered in real-time.",
    journeyTitle: "Your Election Journey",
    completeProgress: "% Complete",
    step1Title: "Voter Registration",
    step1Desc: "Ensure you are registered to vote before the deadline.",
    step2Title: "Understanding the Ballot",
    step2Desc: "Review the candidates and measures on your local ballot.",
    step3Title: "Find Polling Station",
    step3Desc: "Locate your assigned polling place and check its hours.",
    step4Title: "Election Day",
    step4Desc: "Cast your vote! Bring necessary ID if required.",
    viewDetails: "View details",
    markComplete: "Mark as Complete",
    completed: "Completed",
    sharePlan: "Share Your Plan",
    findPollingTitle: "Find My Polling Place",
    addressPlaceholder: "Enter your residential address",
    findBtn: "Find",
    pollingStation: "Your Polling Station",
    hours: "Hours: 7:00 AM - 6:00 PM",
    mapDisabled: "Enter your address to view your polling station map.",
    emergencyBtn: "Urgent: Having trouble at the polling place? (AI Helper)",
    getDirections: "🗺️ Get Directions to Polling Station",
    printPass: "🖨️ Print Voting Pass",
    chatbotGreeting: "Hi there! I am your CivicSync Assistant powered by Gemini. Ask me anything about the election process, deadlines, or polling stations.",
    chatbotPlaceholder: "Ask about the election...",
    chatbotTitle: "CivicSync Assistant"
  },
  hi: {
    appTitle: "सिविकसिंक (CivicSync)",
    addToCalendar: "कैलेंडर में जोड़ें",
    welcomeHeading: "आपका व्यक्तिगत चुनाव सहायक",
    welcomeSubheading: "आत्मविश्वास के साथ चुनाव प्रक्रिया को समझें। समय सीमा ट्रैक करें, अपना मतदान केंद्र खोजें, और वास्तविक समय में अपने सवालों के जवाब पाएं।",
    journeyTitle: "आपकी चुनाव यात्रा",
    completeProgress: "% पूर्ण",
    step1Title: "मतदाता पंजीकरण",
    step1Desc: "सुनिश्चित करें कि आप समय सीमा से पहले मतदान के लिए पंजीकृत हैं।",
    step2Title: "मतपत्र को समझना",
    step2Desc: "अपने स्थानीय मतपत्र पर उम्मीदवारों और उपायों की समीक्षा करें।",
    step3Title: "मतदान केंद्र खोजें",
    step3Desc: "अपना निर्धारित मतदान केंद्र खोजें और उसका समय जांचें।",
    step4Title: "चुनाव का दिन",
    step4Desc: "अपना वोट डालें! यदि आवश्यक हो तो जरूरी आईडी लाएं।",
    viewDetails: "विवरण देखें",
    markComplete: "पूर्ण के रूप में चिह्नित करें",
    completed: "पूर्ण",
    sharePlan: "अपनी योजना साझा करें",
    findPollingTitle: "अपना मतदान केंद्र खोजें",
    addressPlaceholder: "अपना आवासीय पता दर्ज करें",
    findBtn: "खोजें",
    pollingStation: "आपका मतदान केंद्र",
    hours: "समय: सुबह 7:00 बजे - शाम 6:00 बजे",
    mapDisabled: "अपना मतदान केंद्र का नक्शा देखने के लिए अपना पता दर्ज करें।",
    emergencyBtn: "ज़रूरी: क्या मतदान केंद्र पर कोई परेशानी हो रही है? (AI सहायक)",
    getDirections: "🗺️ मतदान केंद्र तक पहुंचने के निर्देश प्राप्त करें",
    printPass: "🖨️ वोटिंग पास प्रिंट करें",
    chatbotGreeting: "नमस्ते! मैं जेमिनी द्वारा संचालित आपका सिविकसिंक सहायक हूं। मुझसे चुनाव प्रक्रिया, समय सीमा या मतदान केंद्रों के बारे में कुछ भी पूछें।",
    chatbotPlaceholder: "चुनाव के बारे में पूछें...",
    chatbotTitle: "सिविकसिंक सहायक"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
