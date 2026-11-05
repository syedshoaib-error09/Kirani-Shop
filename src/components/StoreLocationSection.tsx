import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Navigation, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const StoreLocationSection: React.FC = () => {
  const { storeSettings, isStoreOpen, storeStatusText } = useStore();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${storeSettings.storeName}, ${storeSettings.address}, ${storeSettings.city}`
  )}`;

  return (
    <section id="location-section" className="py-12 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Visit Our Local Storefront</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Neighbourhood Store Location & Delivery Zone
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-semibold flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors shadow-xs"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Store Info & Photo Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-16/9 bg-stone-100">
                <img
                  src="/src/assets/images/storefront_neighbourhood_1793890099071.jpg"
                  alt={`${storeSettings.storeName} storefront`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-800 dark:text-emerald-300 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {storeStatusText}
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                {storeSettings.storeName}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Proprietor: {storeSettings.ownerName}
              </p>

              <div className="space-y-3 mt-4 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                      {storeSettings.address}
                    </span>
                    <span className="text-stone-500">
                      Landmark: {storeSettings.landmark} · {storeSettings.city} - {storeSettings.pincode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Open Daily: <strong>{storeSettings.openHour} AM - {storeSettings.closeHour} PM</strong> (No Holiday)
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Helpline: <strong>{storeSettings.phone}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>
                    WhatsApp Counter: <strong>+{storeSettings.whatsappNumber}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Deliveries handled directly by our permanent store staff</span>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm min-h-[380px] bg-stone-100 dark:bg-stone-900 relative">
            <iframe
              title="Store Location Google Map"
              src={storeSettings.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001692131966!2d77.63854977507638!3d12.97179928734346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a77b73812b%3A0xa9ffbc84360eefb8!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
