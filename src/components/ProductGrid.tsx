import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, RefreshCw, Sparkles, Flame, Tag, SearchX } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'bestsellers' | 'offers' | 'new'>('all');

  // Filtering products
  let filtered = products.filter(p => {
    // Category filter
    if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    // In stock filter
    if (inStockOnly && (!p.inStock || p.stock <= 0)) {
      return false;
    }
    // Tab filter
    if (activeTab === 'bestsellers' && !p.isBestSeller) return false;
    if (activeTab === 'offers' && !p.isSpecialOffer && p.discountPercent < 12) return false;
    if (activeTab === 'new' && !p.isNewArrival) return false;

    return true;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    filtered.sort((a, b) => b.discountPercent - a.discountPercent);
  } else {
    // popular
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setActiveTab('all');
    setSortBy('popular');
  };

  return (
    <section id="shop-section" className="py-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                {selectedCategory === 'all' ? 'All Daily Groceries' : selectedCategory}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                {filtered.length} items
              </span>
            </div>
            {searchQuery && (
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                Showing results for <span className="font-semibold text-emerald-700 dark:text-emerald-400">"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="underline text-stone-400 hover:text-stone-600">Clear</button>
              </p>
            )}
          </div>

          {/* Tab Filter Buttons (Segmented Controls) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  activeTab === 'bestsellers'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Bestsellers</span>
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  activeTab === 'offers'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Top Deals</span>
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>New</span>
              </button>
            </div>

            {/* In-Stock Filter Toggle */}
            <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 outline-none cursor-pointer"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount %</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State Illustration */
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              No grocery products found
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              We couldn't find items matching your active category or search terms. Try clearing filters or search for another pantry item.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-2 mx-auto transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
