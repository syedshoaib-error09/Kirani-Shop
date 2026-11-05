import React from 'react';
import { 
  Wheat, 
  Cookie, 
  Flame, 
  Milk, 
  Utensils, 
  GlassWater, 
  Coffee, 
  Sparkles, 
  Smile, 
  Sparkle, 
  Home,
  LayoutGrid
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Icon mapping helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wheat': return Wheat;
    case 'Cookie': return Cookie;
    case 'Flame': return Flame;
    case 'Milk': return Milk;
    case 'Utensils': return Utensils;
    case 'GlassWater': return GlassWater;
    case 'Coffee': return Coffee;
    case 'Sparkles': return Sparkles;
    case 'Smile': return Smile;
    case 'Sparkle': return Sparkle;
    case 'Home': return Home;
    default: return LayoutGrid;
  }
};

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useStore();

  const handleSelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const el = document.getElementById('shop-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-8 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Explore Product Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Select a category to browse authentic Indian grocery essentials
            </p>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Show All ({products.length} items)
            </button>
          )}
        </div>

        {/* Categories Horizontal Carousel / Grid */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          
          {/* All Categories Button */}
          <button
            onClick={() => handleSelect('all')}
            className={`flex flex-col items-center justify-center min-w-[105px] sm:min-w-[120px] p-3 rounded-2xl border transition-all text-center shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 ${
              selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight line-clamp-1">All Items</span>
            <span className={`text-[10px] mt-0.5 ${selectedCategory === 'all' ? 'text-emerald-100' : 'text-stone-400'}`}>
              सभी सामान
            </span>
          </button>

          {/* 11 Categories List */}
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.icon);
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            const count = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.name)}
                className={`flex flex-col items-center justify-center min-w-[110px] sm:min-w-[128px] p-3 rounded-2xl border transition-all text-center shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-0.5'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-1">{cat.name}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                  {cat.hindiName}
                </span>
                <span className={`text-[9px] font-medium mt-1 px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                }`}>
                  {count} items
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
