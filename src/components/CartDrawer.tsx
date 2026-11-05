import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    cartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    storeSettings,
    setIsCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;
    const res = applyCoupon(code);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput('');
    setTimeout(() => setCouponMsg(null), 4000);
  };

  const freeDeliveryThreshold = storeSettings.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  // Total savings compared to MRP
  const totalMrp = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const totalSavings = Math.max(0, totalMrp - cartTotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-stone-900 dark:text-stone-100">
                  Your Grocery Basket
                </h3>
                <span className="text-xs text-stone-500">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-rose-500 transition-colors p-1"
                  title="Clear Cart"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Progress Meter */}
          {cart.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 border-b border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1.5">
                {remainingForFreeDelivery === 0 ? (
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>You've unlocked <strong>FREE Delivery</strong>!</span>
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-emerald-700 dark:text-emerald-400">₹{remainingForFreeDelivery}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                )}
                <span>{freeDeliveryPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-200 dark:bg-emerald-900 overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100 dark:divide-stone-800">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedWeight}`} className="py-3.5 flex gap-3 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      category={item.product.category}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-300 hover:text-rose-500 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                      <span>{item.product.brand}</span>
                      <span>·</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 rounded">
                        {item.selectedWeight}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                          ₹{item.product.price * item.quantity}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-[11px] text-stone-400 line-through tabular-nums">
                            ₹{item.product.mrp * item.quantity}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 transition-colors disabled:opacity-40"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Cart View */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
                  Your basket is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Add fresh atta, pulses, desi ghee, or spices from your local store to begin!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer with Bill & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              
              {/* Coupon Section */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block -mt-0.5">
                          {appliedCoupon.description}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code (e.g. APNA50)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 uppercase outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick Coupon Tags */}
                    <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                      {coupons.slice(0, 3).map(c => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-800 shrink-0 cursor-pointer"
                        >
                          +{c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {couponMsg && (
                  <p className={`text-[11px] mt-1.5 font-medium ${couponMsg.error ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 mb-4">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 tabular-nums">₹{cartSubtotal}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Coupon Discount</span>
                    <span className="font-semibold tabular-nums">-₹{cartDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Home Delivery</span>
                  <span className="font-semibold tabular-nums">
                    {cartDeliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${cartDeliveryFee}`
                    )}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-amber-700 dark:text-amber-400 font-medium pt-1">
                    <span>Total Savings on this order</span>
                    <span className="font-bold tabular-nums">₹{totalSavings}</span>
                  </div>
                )}

                <div className="border-t border-stone-200 dark:border-stone-800 pt-2 flex justify-between text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                  <span>To Pay (Grand Total)</span>
                  <span className="font-display text-emerald-700 dark:text-emerald-400 tabular-nums">₹{cartTotal}</span>
                </div>
              </div>

              {/* Min Order Check */}
              {cartTotal < storeSettings.minOrderAmount ? (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Minimum order amount is ₹{storeSettings.minOrderAmount}. Please add ₹{storeSettings.minOrderAmount - cartTotal} more.</span>
                </div>
              ) : null}

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                disabled={cartTotal < storeSettings.minOrderAmount}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-700/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery & Instant UPI Available</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
