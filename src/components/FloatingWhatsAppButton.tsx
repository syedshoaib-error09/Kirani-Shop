import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingWhatsAppButton: React.FC = () => {
  const { storeSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('Namaste! I would like to enquire about grocery availability and delivery.');

  const cleanPhone = storeSettings.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(quickMessage)}`;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {storeSettings.storeName}
                </h4>
                <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Replies in 5 mins
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 my-3 leading-relaxed">
            Need items not listed online? Looking for loose spices, fresh milk, or instant order assistance? Chat with us directly!
          </p>

          <textarea
            rows={2}
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none mb-3"
          />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Start WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Floating Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-xs shadow-xl shadow-green-700/30 transition-all cursor-pointer group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">Order on WhatsApp</span>
      </button>

    </div>
  );
};
