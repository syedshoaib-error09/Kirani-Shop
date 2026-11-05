import React from 'react';
import { Zap, ShieldCheck, MessageCircle, CreditCard, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { storeSettings, isStoreOpen, storeStatusText } = useStore();

  const scrollToShop = () => {
    const el = document.getElementById('shop-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToOffers = () => {
    const el = document.getElementById('offers-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-stone-50 to-stone-50 dark:from-stone-900/60 dark:via-stone-950 dark:to-stone-950 py-8 md:py-14 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Status & Trust Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-3 tracking-wide">
              <span className="flex items-center gap-1.5 py-1 px-3 bg-emerald-100/80 dark:bg-emerald-950/60 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Clock className="w-3.5 h-3.5" />
                {storeStatusText}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600 dark:text-stone-400">Indiranagar & 5km Radius</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15] text-balance mb-4">
              Fresh Daily Groceries, Pure Staples & Fast Local Delivery
            </h1>

            {/* Subheading / Tagline */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 mb-6 max-w-2xl leading-relaxed">
              {storeSettings.tagline}. Order everyday chakki atta, pure desi ghee, aromatic basmati, dairy & household needs online or directly over WhatsApp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <button
                onClick={scrollToShop}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-emerald-700/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Shop Everyday Staples</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToOffers}
                className="px-6 py-3.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 active:scale-95 text-stone-900 dark:text-stone-100 font-semibold rounded-xl border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Today's Offers & Coupons</span>
              </button>
            </div>

            {/* Trust Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">30-Min</div>
                  <div className="text-[11px] text-stone-500">Express Delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">100% Shuddh</div>
                  <div className="text-[11px] text-stone-500">Genuine Brands</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">WhatsApp</div>
                  <div className="text-[11px] text-stone-500">Direct Ordering</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">COD & UPI</div>
                  <div className="text-[11px] text-stone-500">Pay on Arrival</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 group">
              <img
                src="/src/assets/images/hero_kirana_market_1793890096253.jpg"
                alt="Shree Ganesh Kirana & Supermarket Interior with fresh pulses, spices and groceries"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Neighbourhood Pride
                </div>
                <h3 className="font-display text-xl font-bold">
                  {storeSettings.storeName}
                </h3>
                <p className="text-xs text-stone-200 mt-1 line-clamp-1">
                  Serving over 4,500+ happy households with fresh monthly ration and daily milk.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
