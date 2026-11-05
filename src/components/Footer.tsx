import React from 'react';
import { ShoppingBag, MapPin, Phone, MessageCircle, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { storeSettings, setSelectedCategory, setIsAdminOpen } = useStore();

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const el = document.getElementById('shop-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                {storeSettings.storeName}
              </span>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {storeSettings.tagline}. Delivering fresh pulses, chakki fresh flour, pure cow ghee, daily milk and household provisions within 30 minutes to your doorstep.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>FSSAI Certified Grocery Mart · 100% Genuine Brands</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">
              Staples & Essentials
            </h4>
            <ul className="space-y-2 text-xs">
              {['Rice & Dal', 'Atta & Flour', 'Oil & Ghee', 'Milk & Dairy', 'Masala & Spices', 'Biscuits & Snacks'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Store Timing */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">
              Store Timings
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Open Daily</span>
                  <span>{storeSettings.openHour} AM - {storeSettings.closeHour} PM</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Local Coverage</span>
                  <span>Up to {storeSettings.deliveryRadiusKm} km around {storeSettings.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">
              Direct Counter
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${storeSettings.phone}`} className="hover:text-white transition-colors">
                  {storeSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a 
                  href={`https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +{storeSettings.whatsappNumber}
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Store Owner Login
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {storeSettings.storeName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Accepted Payments: UPI · Cash on Delivery · NetBanking</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
