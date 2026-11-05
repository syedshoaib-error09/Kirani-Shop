import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  Check, 
  Printer, 
  MapPin, 
  Phone, 
  Clock, 
  ShoppingBag,
  ExternalLink,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const { confirmedOrder, setConfirmedOrder, storeSettings, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  if (!confirmedOrder) return null;

  // Format WhatsApp message
  const generateWhatsAppMessage = () => {
    const itemsList = confirmedOrder.items
      .map((item, idx) => `${idx + 1}. *${item.name}* (${item.unitWeight}) x ${item.quantity} = ₹${item.price * item.quantity}`)
      .join('\n');

    return `🛒 *NEW GROCERY ORDER: ${confirmedOrder.orderNumber}*
🏪 *Store:* ${storeSettings.storeName}
----------------------------------
👤 *Customer:* ${confirmedOrder.customer.name}
📱 *Phone:* ${confirmedOrder.customer.phone}
📍 *Address:* ${confirmedOrder.customer.address}
🏷️ *Landmark:* ${confirmedOrder.customer.landmark || 'N/A'}
📮 *Pincode:* ${confirmedOrder.customer.pincode}
⏰ *Delivery Slot:* ${confirmedOrder.customer.deliverySlot}
${confirmedOrder.customer.notes ? `📝 *Notes:* ${confirmedOrder.customer.notes}\n` : ''}----------------------------------
📦 *ITEMS ORDERED:*
${itemsList}
----------------------------------
💰 *Item Subtotal:* ₹${confirmedOrder.subtotal}
${confirmedOrder.discount > 0 ? `🏷️ *Coupon Discount:* -₹${confirmedOrder.discount}\n` : ''}🚚 *Delivery Fee:* ${confirmedOrder.deliveryFee === 0 ? 'FREE' : `₹${confirmedOrder.deliveryFee}`}
💵 *GRAND TOTAL TO PAY:* ₹${confirmedOrder.total}
💳 *Payment Mode:* ${confirmedOrder.paymentMethod.toUpperCase()} (${confirmedOrder.paymentStatus})
${confirmedOrder.upiRefNumber ? `🔖 *UPI Ref:* ${confirmedOrder.upiRefNumber}\n` : ''}----------------------------------
_Order placed via ${storeSettings.storeName} Online Store_`;
  };

  const whatsappMessage = generateWhatsAppMessage();
  const cleanPhone = storeSettings.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    showToast('WhatsApp order summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => setConfirmedOrder(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
          
          {/* Header Celebration */}
          <div className="p-6 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white text-center relative">
            <button
              onClick={() => setConfirmedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full text-emerald-100 mb-2 inline-block">
              Order Placed Successfully!
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              Thank You, {confirmedOrder.customer.name.split(' ')[0]}!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Order ID: <strong className="font-mono text-white text-base">{confirmedOrder.orderNumber}</strong>
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            
            {/* WhatsApp Integration Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-green-50 dark:bg-green-950/40 border-2 border-green-500/40 dark:border-green-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-green-950 dark:text-green-200">
                    Send Order Directly via WhatsApp
                  </h4>
                  <p className="text-xs text-green-800/80 dark:text-green-300 mt-0.5">
                    Click below to open WhatsApp with your itemized grocery list ready to send to our store counter.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleCopyMessage}
                  title="Copy WhatsApp Order Text"
                  className="p-2.5 rounded-xl border border-green-300 dark:border-green-800 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-green-100 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Delivery Timeline Status */}
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                Delivery Tracker
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                  <span className="block mb-1">✓</span>
                  Order Placed
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200">
                  <span className="block mb-1">⏳</span>
                  Packing Staples
                </div>
                <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                  <span className="block mb-1">🛵</span>
                  Out for Delivery
                </div>
                <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                  <span className="block mb-1">🏠</span>
                  Delivered
                </div>
              </div>
            </div>

            {/* Order Details & Address Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">
                  Delivery Destination
                </span>
                <div className="font-semibold text-stone-900 dark:text-stone-100">{confirmedOrder.customer.name}</div>
                <div className="text-stone-600 dark:text-stone-400 mt-0.5">{confirmedOrder.customer.address}</div>
                {confirmedOrder.customer.landmark && (
                  <div className="text-stone-500 mt-0.5">Landmark: {confirmedOrder.customer.landmark}</div>
                )}
                <div className="text-stone-500 mt-0.5">Pincode: {confirmedOrder.customer.pincode}</div>
                <div className="text-stone-500 mt-1 font-medium">📞 +91 {confirmedOrder.customer.phone}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">
                  Order Summary
                </span>
                <div className="flex justify-between py-0.5 text-stone-600 dark:text-stone-400">
                  <span>Subtotal ({confirmedOrder.items.length} items):</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 tabular-nums">₹{confirmedOrder.subtotal}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between py-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount:</span>
                    <span className="tabular-nums">-₹{confirmedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between py-0.5 text-stone-600 dark:text-stone-400">
                  <span>Delivery Fee:</span>
                  <span>{confirmedOrder.deliveryFee === 0 ? 'FREE' : `₹${confirmedOrder.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-stone-200 dark:border-stone-700 font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                  <span>Grand Total:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 tabular-nums">₹{confirmedOrder.total}</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Payment: <strong className="uppercase">{confirmedOrder.paymentMethod}</strong>
                </div>
              </div>
            </div>

            {/* Itemized Receipt Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Ordered Items ({confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)} Units)
                </h4>
                <button
                  onClick={handlePrintReceipt}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 max-h-48 overflow-y-auto text-xs">
                {confirmedOrder.items.map((item, index) => (
                  <div key={index} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">{item.name}</span>
                      <span className="text-[11px] text-stone-500 block">
                        {item.unitWeight} · Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close / Continue Shopping Button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setConfirmedOrder(null)}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
