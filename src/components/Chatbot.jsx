import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../context/LanguageContext';

// Initialize the Gemini AI Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
// SECURITY NOTE: In a production environment, this API call must be proxied through a secure backend to protect the API key.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default function Chatbot({ isOpen, setIsOpen, mode }) {
  const { language, t } = useLanguage();
  
  const DEFAULT_PROMPT = `You are CivicSync, an election assistant. By default, respond in English, but automatically adapt to हिन्दी if the user communicates in Hindi or if the UI language is set to हिन्दी. Current UI Language: ${language === 'hi' ? 'Hindi' : 'English'}. Provide concise, accurate answers about voter registration, polling stations, and election day procedures.`;
  
  const EMERGENCY_PROMPT = `You are now in Poll Day Emergency mode. Provide immediate, accurate, non-partisan legal rights information (as approved by the Election Commission of India) and present the official ECI helpline number (1950) and local Prayagraj grievance officer contact. Do not hallucinate. Current UI Language: ${language === 'hi' ? 'Hindi' : 'English'}. Respond in the language requested or implied.`;

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Re-initialize messages when mode or language changes, only if not already initialized for this mode
  useEffect(() => {
    let initialGreeting = t('chatbotGreeting');
    if (mode === 'emergency') {
      initialGreeting = language === 'hi' ? 
        "आपातकालीन मोड सक्रिय। मैं चुनाव आयोग के नियमों के अनुसार आपकी कैसे मदद कर सकता हूं? (Emergency Mode Active. How can I help you according to ECI rules?)" : 
        "Emergency Mode Active. How can I assist you with your polling place rights according to ECI rules?";
    }
    
    setMessages([
      { id: 1, type: 'bot', text: initialGreeting }
    ]);
  }, [mode, language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    
    const query = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      if (!ai) {
        throw new Error("API key missing. Please add VITE_GEMINI_API_KEY to your .env file.");
      }

      const activePrompt = mode === 'emergency' ? EMERGENCY_PROMPT : DEFAULT_PROMPT;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          systemInstruction: activePrompt,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: aiText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: "I'm having trouble connecting right now. Please make sure your Gemini API key is configured correctly." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-civic-blue-600 text-white rounded-full shadow-lg hover:bg-civic-blue-700 hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-civic-blue-500 z-50"
        aria-label="Open Election Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out transform origin-bottom-right scale-100 opacity-100">
      <div className={`${mode === 'emergency' ? 'bg-red-600' : 'bg-civic-blue-600'} p-4 text-white flex justify-between items-center transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          {mode === 'emergency' ? <AlertTriangle className="w-5 h-5 animate-pulse" /> : <Bot className="w-5 h-5" />}
          <h3 className="font-semibold text-lg">{mode === 'emergency' ? 'Emergency Helper' : t('chatbotTitle')}</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className={`text-white hover:text-gray-200 hover:bg-black/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded p-1`}
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto h-80 bg-gray-50 flex flex-col gap-3 scroll-smooth">
        {!apiKey && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">VITE_GEMINI_API_KEY is missing from the .env file.</span>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.type === 'user' 
                ? (mode === 'emergency' ? 'bg-red-600 text-white' : 'bg-civic-blue-600 text-white') + ' rounded-tr-sm' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <div className="flex space-x-1">
                <div className={`w-2 h-2 ${mode === 'emergency' ? 'bg-red-400' : 'bg-civic-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                <div className={`w-2 h-2 ${mode === 'emergency' ? 'bg-red-400' : 'bg-civic-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                <div className={`w-2 h-2 ${mode === 'emergency' ? 'bg-red-400' : 'bg-civic-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('chatbotPlaceholder')}
          className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-${mode === 'emergency' ? 'red' : 'civic-blue'}-500 focus:ring-1 focus:ring-${mode === 'emergency' ? 'red' : 'civic-blue'}-500 text-sm transition-colors duration-200`}
          aria-label="Type your question"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`p-2 ${mode === 'emergency' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-civic-blue-600 hover:bg-civic-blue-700 focus:ring-civic-blue-500'} text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]`}
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
