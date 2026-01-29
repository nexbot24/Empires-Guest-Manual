
import React from 'react';
import { Home, BookOpen, MapPin, MessageSquare } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: Tab.HOME, label: 'Home', icon: Home },
    { id: Tab.GUIDE, label: 'Guide', icon: BookOpen },
    { id: Tab.LOCAL, label: 'Local', icon: MapPin },
    { id: Tab.ASSISTANT, label: 'AI Host', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-earth/20 safe-area-bottom z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 ${
                isActive ? 'text-earth' : 'text-luxury-black/40 dark:text-luxury-off/50'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium tracking-wide uppercase">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
