import React from 'react';
import { Tag, Sparkles, Copy, Check, Percent } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OffersBanner: React.FC = () => {
  const { coupons, applyCoupon, appliedCoupon, showToast } = useStore();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyOrApply = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    const result = applyCoupon(code);
    if (!result.success) {
      showToast(`Copied code "${code}" to clipboard! (${result.message})`, 'info');
    }
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers-section" className="py-8 bg-stone-100/70 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-stone-200 dark:border-stone-800 bg-gradient-to-r from-amber-700 via-amber-800 to-emerald-900 text-white p-6 sm:p-10">
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-200 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Store Offers & Vouchers</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
              Bumper Kirana Savings On Everyday Staples
            </h2>
            <p className="text-sm sm:text-base text-amber-100/90 mb-6">
              Use our verified coupon codes at checkout or click below to auto-apply. Free home delivery on all carts above ₹499!
            </p>

            {/* Coupons List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {coupons.map((coupon) => {
                const isApplied = appliedCoupon?.code === coupon.code;
                return (
                  <div
                    key={coupon.code}
                    className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-base text-amber-300 tracking-wider">
                          {coupon.code}
                        </span>
                        {isApplied && (
                          <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/90 font-medium line-clamp-2">
                        {coupon.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyOrApply(coupon.code)}
                      className="mt-3 w-full py-1.5 px-3 rounded-xl bg-white text-stone-900 hover:bg-amber-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedCode === coupon.code || isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isApplied ? 'Applied' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-600" />
                          <span>Tap to Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Decorative Background Stamp / Corner Accent */}
          <div className="hidden lg:block absolute -right-10 -bottom-10 w-96 h-96 opacity-30 pointer-events-none rounded-full bg-gradient-to-tl from-emerald-500 via-amber-400 to-transparent blur-3xl"></div>
        </div>

      </div>
    </section>
  );
};
