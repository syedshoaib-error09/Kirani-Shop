import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sun, 
  Moon, 
  MapPin, 
  Phone, 
  Shield, 
  Clock, 
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    storeSettings,
    cartCount,
    cartSubtotal,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAdminOpen,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedCategory,
    setActiveProductModal,
    isStoreOpen,
    storeStatusText
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Suggestions matching query
  const suggestions = searchQuery.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-emerald-800 text-white text-xs py-2 px-4 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              {storeStatusText}
            </span>
            <span className="hidden sm:inline text-emerald-300">|</span>
            <span className="hidden sm:inline text-emerald-100">
              ⚡ Free Express Delivery on orders over ₹{storeSettings.freeDeliveryThreshold}
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-100">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span className="truncate max-w-[160px] sm:max-w-none">{storeSettings.city} ({storeSettings.pincode})</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>{storeSettings.phone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-18">
            
            {/* Zone 1: Store Wordmark & Logo */}
            <a href="#" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-emerald-900/10 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
                  {storeSettings.storeName}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 -mt-1 hidden sm:block">
                  Neighbourhood Kirana & Supermarket
                </span>
              </div>
            </a>

            {/* Zone 2: Live Search Bar with Autocomplete */}
            <div ref={searchRef} className="relative flex-1 max-w-xl mx-2 hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search basmati rice, atta, desi ghee, spices, amul butter..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-full bg-stone-100 dark:bg-stone-800/80 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden z-50">
                  <div className="p-2 border-b border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3">
                    Matching Products
                  </div>
                  <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-80 overflow-y-auto">
                    {suggestions.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveProductModal(p);
                          setIsSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.image} 
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 dark:bg-stone-800 shrink-0" 
                          />
                          <div>
                            <div className="text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                              <span>{p.brand}</span>
                              <span>·</span>
                              <span>{p.unitWeight}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            ₹{p.price}
                          </span>
                          <div className="text-[11px] text-stone-400 line-through tabular-nums">
                            ₹{p.mrp}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Zone 3: Navigation Controls & Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                title="Your Wishlist"
                className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Admin Portal Key */}
              <button
                onClick={() => setIsAdminOpen(true)}
                title="Store Owner Admin Panel"
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Admin Dashboard"
              >
                <Shield className="w-5 h-5" />
              </button>

              {/* Shopping Cart Pill Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-medium shadow-sm shadow-emerald-700/20 transition-all"
                aria-label="Open Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-stone-900 font-bold text-[10px] rounded-full flex items-center justify-center tabular-nums">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-[11px] font-normal text-emerald-100">My Basket</span>
                  <span className="text-xs font-bold tabular-nums">₹{cartSubtotal}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="pb-3 sm:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rice, atta, oil, spices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-none outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
