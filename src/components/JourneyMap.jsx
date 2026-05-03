import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function JourneyMap() {
  const { t } = useLanguage();
  
  const steps = [
    {
      id: 1,
      title: t('step1Title'),
      description: t('step1Desc'),
      date: 'Oct 15, 2026',
    },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      date: 'Oct 25, 2026',
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
      date: 'Nov 1, 2026',
    },
    {
      id: 4,
      title: t('step4Title'),
      description: t('step4Desc'),
      date: 'Nov 3, 2026',
    },
  ];

  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      // Check deep link first
      const params = new URLSearchParams(window.location.search);
      if (params.has('progress')) {
        const progressIds = params.get('progress').split(',').map(Number);
        return progressIds.filter(id => !isNaN(id));
      }

      // Fallback to local storage
      const saved = localStorage.getItem('civicsync_completed_steps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('civicsync_completed_steps', JSON.stringify(completedSteps));
    
    // Auto advance active step on load if deep linked
    if (completedSteps.length > 0) {
      const maxCompleted = Math.max(...completedSteps);
      if (maxCompleted < steps.length) {
        setActiveStep(maxCompleted + 1);
      } else {
        setActiveStep(steps.length);
      }
    }
  }, [completedSteps]);

  const handleComplete = (e, id) => {
    e.stopPropagation(); // Prevent triggering the step click
    if (!completedSteps.includes(id)) {
      setCompletedSteps((prev) => [...prev, id]);
    }
    // Auto advance if not the last step
    if (id < steps.length) {
      setActiveStep(id + 1);
    }
  };

  const handleShare = () => {
    const progressParam = completedSteps.join(',');
    const shareUrl = `${window.location.origin}/?progress=${progressParam}`;
    const text = `I just finalized my 2026 election journey in Prayagraj with CivicSync! Get your non-partisan plan: ${shareUrl}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 glass-panel rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <h2 className="text-2xl font-bold text-civic-blue-900" id="journey-title">{t('journeyTitle')}</h2>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-civic-blue-600">{Math.round(progressPercentage)}{t('completeProgress')}</span>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Share your plan"
          >
            <Share2 className="w-4 h-4" />
            {t('sharePlan')}
          </button>
        </div>
      </div>
      
      <div className="relative" role="region" aria-labelledby="journey-title">
        {/* Background track */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" aria-hidden="true"></div>
        
        {/* Active progress bar */}
        <div 
          className="absolute left-6 top-8 w-0.5 bg-civic-blue-500 transition-all duration-500 ease-in-out" 
          style={{ height: `calc(${progressPercentage}% - 2rem)` }}
          aria-hidden="true"
        ></div>
        
        <div className="space-y-8 relative">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = step.id === activeStep;
            
            let statusClass = 'step-inactive';
            if (isActive) statusClass = 'step-active';
            if (isCompleted) statusClass = 'step-completed';

            return (
              <div 
                key={step.id} 
                className="flex items-start group cursor-pointer focus:outline-none"
                role="button"
                tabIndex={0}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${step.id}: ${step.title} ${isCompleted ? '(Completed)' : ''}`}
                onClick={() => setActiveStep(step.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveStep(step.id);
                  }
                }}
              >
                <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ease-in-out shrink-0 ${statusClass} group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-civic-blue-500`}>
                  {isCompleted ? <Check className="w-6 h-6" /> : <span className="text-lg font-semibold">{step.id}</span>}
                </div>
                
                <div className={`ml-6 p-4 rounded-xl transition-all duration-300 ease-in-out flex-1 border ${isActive ? 'bg-civic-blue-50 border-civic-blue-200 shadow-sm' : 'bg-white border-transparent hover:border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-semibold transition-colors duration-300 ${isActive ? 'text-civic-blue-900' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                    </div>
                    <div className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full shrink-0">
                      {step.date}
                    </div>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm font-medium text-civic-blue-600">
                        <span>{t('viewDetails')}</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                      
                      {!isCompleted && (
                        <button
                          onClick={(e) => handleComplete(e, step.id)}
                          className="px-4 py-2 bg-civic-blue-600 text-white text-sm font-medium rounded-lg hover:bg-civic-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-civic-blue-500 transition-colors duration-300"
                        >
                          {t('markComplete')}
                        </button>
                      )}
                      {isCompleted && (
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <Check className="w-4 h-4 mr-1" /> {t('completed')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
