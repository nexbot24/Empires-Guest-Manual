
import React, { useState } from 'react';
import { MapPin, Utensils, Train, ShoppingBag, Landmark, ExternalLink } from 'lucide-react';
import { RECOMMENDATIONS } from '../constants';

const CategoryIcon: Record<string, any> = {
  Dining: Utensils,
  Transport: Train,
  Groceries: ShoppingBag,
  Culture: Landmark
};

const LocalView: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Dining', 'Transport', 'Groceries', 'Culture'];

  const filteredItems = filter === 'All' 
    ? RECOMMENDATIONS 
    : RECOMMENDATIONS.filter(item => item.category === filter);

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-500">
      <header>
        <h1 className="font-serif text-3xl">Neighborhood Guide</h1>
        <p className="text-luxury-black/60 dark:text-luxury-off/60 text-sm">Curated local secrets and essentials.</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-widest transition-all ${
              filter === cat 
                ? 'bg-earth text-white' 
                : 'bg-luxury-light dark:bg-luxury-black border border-earth/20 text-luxury-black/50 dark:text-luxury-off/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((item) => {
          const Icon = CategoryIcon[item.category] || MapPin;
          return (
            <div key={item.id} className="glass rounded-2xl p-4 flex gap-4 items-start group shadow-sm border border-earth/5 dark:border-earth/10">
              <div className="bg-earth/10 p-3 rounded-xl text-earth group-hover:bg-earth group-hover:text-white transition-colors duration-300">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-luxury-black dark:text-luxury-light">{item.name}</h3>
                  <span className="text-[10px] text-earth uppercase font-bold tracking-tighter">{item.distance}</span>
                </div>
                <p className="text-xs text-luxury-black/70 dark:text-luxury-off/70 mt-1 leading-relaxed">
                  {item.description}
                </p>
                {item.link !== '#' && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-[10px] text-earth uppercase tracking-widest font-bold hover:underline"
                  >
                    View Website <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocalView;
