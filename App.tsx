
import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import GuideView from './components/GuideView';
import LocalView from './components/LocalView';
import StoreView from './components/StoreView';
import AssistantView from './components/AssistantView';
import { Sun, Moon } from 'lucide-react';
import logo from './assets/logo.png';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <HomeView />;
      case Tab.GUIDE:
        return <GuideView />;
      case Tab.LOCAL:
        return <LocalView />;
      case Tab.STORE:
        return <StoreView />;
      case Tab.ASSISTANT:
        return <AssistantView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col bg-luxury-light dark:bg-luxury-black font-sans selection:bg-earth selection:text-white transition-colors duration-300">
      {/* Branding Header */}
      <header className="px-6 py-6 sticky top-0 bg-luxury-light/90 dark:bg-luxury-black/90 backdrop-blur-md z-40 border-b border-earth/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-widest text-luxury-black dark:text-luxury-light uppercase">
              Empires <span className="text-earth italic font-normal">Property</span>
            </span>
            <span className="text-[10px] tracking-[0.3em] text-earth uppercase font-bold opacity-80">
              Luxury Serviced Stays
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full border border-earth/20 text-earth hover:bg-earth/10 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pt-6 overflow-y-auto no-scrollbar">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
