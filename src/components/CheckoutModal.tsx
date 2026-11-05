import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    clearCart,
    appliedCoupon,
    storeSettings,
    setConfirmedOrder,
    refreshProducts,
    showToast
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState(storeSettings.pincode || '560038');
  const [deliverySlot, setDeliverySlot] = useState('Express 30 Mins');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const validatePhone = (p: string) => {
    const cleaned = p.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const validatePincode = (pin: string) => {
    const cleaned = pin.replace(/\D/g, '');
    return cleaned.length === 6;
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (!address.trim() || address.trim().length < 8) {
      setError('Please provide a complete delivery street address (House/Flat No. & Street)');
      return;
    }

    if (!validatePincode(pincode)) {
      setError('Please enter a valid 6-digit Pincode');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: Partial<Order> = {
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          landmark: landmark.trim(),
          pincode: pincode.trim(),
          deliverySlot,
          notes: notes.trim()
        },
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          unitWeight: item.selectedWeight,
          price: item.product.price,
          mrp: item.product.mrp,
          quantity: item.quantity,
          image: item.product.image
        })),
        subtotal: cartSubtotal,
        discount: cartDiscount,
        deliveryFee: cartDeliveryFee,
        total: cartTotal,
        paymentMethod,
        appliedCoupon: appliedCoupon?.code,
        upiRefNumber: paymentMethod === 'upi' ? upiRefNumber.trim() : undefined
      };

      const created = await api.createOrder(orderPayload);
      await refreshProducts(); // update live inventory stocks

      clearCart();
      setIsCheckoutOpen(false);
      setConfirmedOrder(created);
      showToast('Order placed successfully! Preparing your delivery.', 'success');
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPI deep link for quick payment
  const upiPayLink = `upi://pay?pa=${encodeURIComponent(storeSettings.upiId)}&pn=${encodeURIComponent(storeSettings.storeName)}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent('Kirana Order')}`;
  const upiQrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayLink)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCheckoutOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/60 dark:bg-stone-900/60">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                Checkout & Delivery Details
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Local delivery from {storeSettings.storeName}
              </p>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleConfirmOrder} className="p-4 sm:p-6 space-y-6">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Customer & Delivery Address */}
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>1. Customer & Delivery Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs font-bold rounded-l-xl border border-r-0 border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9845012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-r-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Complete Address (Flat / House No, Building, Street) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302, Sai Residency, 14th Main, HAL 2nd Stage"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near BDA Complex / Opposite Ganesh Temple"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Delivery Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="560038"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Slot */}
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>2. Select Delivery Slot</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'Express 30 Mins', title: '⚡ Express (30 Mins)', desc: 'Immediate store dispatch' },
                  { id: 'Morning Slot', title: '🌅 Morning Slot', desc: '7:00 AM - 10:00 AM' },
                  { id: 'Evening Slot', title: '🌆 Evening Slot', desc: '5:00 PM - 8:30 PM' }
                ].map(slot => (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setDeliverySlot(slot.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      deliverySlot === slot.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{slot.title}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{slot.desc}</div>
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Special instructions (e.g. Leave with guard / Call upon arrival)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Section 3: Payment Options */}
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>3. Payment Method</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Pay cash or UPI to delivery boy
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant UPI Scan & Pay */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        UPI (GPay / PhonePe / Paytm)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Scan QR & Pay directly
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* UPI QR Display when UPI is selected */}
              {paymentMethod === 'upi' && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 rounded-xl bg-white p-2 shadow-sm border border-stone-200 shrink-0 flex items-center justify-center">
                    <img 
                      src={upiQrApi} 
                      alt="Store UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                      Scan & Pay ₹{cartTotal}
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Store UPI ID: <strong className="font-mono text-stone-900 dark:text-stone-100 select-all">{storeSettings.upiId}</strong>
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Open Google Pay, PhonePe, or Paytm and scan the QR code to make payment directly to the store account.
                    </p>

                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="UPI Reference / UTR Number (optional)"
                        value={upiRefNumber}
                        onChange={(e) => setUpiRefNumber(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Order Summary Strip */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                <span>Items Subtotal ({cart.length} unique items)</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100 tabular-nums">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold tabular-nums">-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mb-2">
                <span>Delivery Charge</span>
                <span className="font-semibold">
                  {cartDeliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${cartDeliveryFee}`}
                </span>
              </div>
              <div className="border-t border-stone-200 dark:border-stone-700 pt-2 flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-stone-100">Total Payable Amount</span>
                <span className="font-display text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="px-5 py-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Back to Basket
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-700/25 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order (₹{cartTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
