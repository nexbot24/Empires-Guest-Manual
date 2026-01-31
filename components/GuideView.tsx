
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Key, Utensils, Thermometer, Trash2, Tv } from 'lucide-react';
import { MANUAL_SECTIONS } from '../constants';

const IconMap: Record<string, any> = {
  Key, Utensils, Thermometer, Trash2, Tv
};

const GuideView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4 pb-24 animate-in slide-in-from-right duration-500">
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Property Manual</h1>
        <p className="text-luxury-black/60 dark:text-luxury-off/60 text-sm">Everything you need to know about your stay.</p>
      </header>

      {MANUAL_SECTIONS.map((section) => {
        const Icon = IconMap[section.icon] || Key;
        const isExpanded = expandedId === section.id;

        return (
          <div
            key={section.id}
            className={`glass rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${isExpanded ? 'ring-1 ring-earth/40' : ''
              }`}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors duration-300 ${isExpanded ? 'bg-earth text-white' : 'bg-earth/10 text-earth'
                  }`}>
                  <Icon size={20} />
                </div>
                <span className="font-medium">{section.title}</span>
              </div>
              {isExpanded ? <ChevronUp size={20} className="text-earth" /> : <ChevronDown size={20} className="text-luxury-black/30 dark:text-luxury-off/30" />}
            </button>

            <div className={`px-5 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 pb-5' : 'max-h-0'
              }`}>
              <ul className="space-y-3 border-t border-earth/10 pt-4">
                {section.content.map((item, idx) => (
                  <li key={idx} className="text-sm text-luxury-black/80 dark:text-luxury-off/80 leading-relaxed flex gap-3">
                    <span className="text-earth font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GuideView;
