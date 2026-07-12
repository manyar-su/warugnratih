import React from 'react';
import { LayoutGrid, Flame, Cookie, Coffee, CupSoda, Percent, ShieldAlert } from 'lucide-react';
import { motion } from '../lib/motion';

interface CategoryTabsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategoryTabs({
  selectedCategory,
  setSelectedCategory
}: CategoryTabsProps) {
  const categories = [
    { id: 'Semua Menu', label: 'Semua Menu', icon: LayoutGrid, color: 'hover:text-stone-900 hover:bg-stone-100' },
    { id: 'Seblak', label: 'Seblak Pedas', icon: Flame, color: 'hover:text-brand-red hover:bg-red-50' },
    { id: 'Snack', label: 'Cemilan / Snack', icon: Cookie, color: 'hover:text-brand-orange hover:bg-orange-50' },
    { id: 'Kopi', label: 'Kopi', icon: Coffee, color: 'hover:text-amber-800 hover:bg-amber-50' },
    { id: 'Minuman', label: 'Minuman Segar', icon: CupSoda, color: 'hover:text-blue-600 hover:bg-blue-50' },
    { id: 'Rokok', label: 'Rokok (18+)', icon: ShieldAlert, color: 'hover:text-purple-600 hover:bg-purple-50' },
    { id: 'Promo', label: 'Promo Hemat', icon: Percent, color: 'hover:text-rose-600 hover:bg-rose-50' }
  ];

  return (
    <div className="w-full bg-white py-4 border-b border-brand-beige sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal scroll indicators for mobile viewports */}
        <div className="flex items-center justify-between mb-2 md:hidden">
          <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider font-mono">
            Kategori Menu
          </span>
          <span className="text-[10px] text-brand-orange font-medium flex items-center gap-1 animate-pulse">
            Geser untuk lainnya &rarr;
          </span>
        </div>

        {/* Categories Tab list container */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mb-2 snap-x snap-mandatory">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-brand-red border-brand-red text-white shadow-md shadow-brand-red/15 scale-98'
                    : 'bg-stone-50 border-brand-beige text-stone-600 ' + cat.color
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-current opacity-80'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
