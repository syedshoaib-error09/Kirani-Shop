import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Zap, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    cart,
    addToCart,
    updateCartQuantity,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen
  } = useStore();

  const [selectedWeight, setSelectedWeight] = useState<string>('');

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const currentWeight = selectedWeight || product.weightOptions?.[0] || product.unitWeight;
  const isFavorited = isInWishlist(product.id);

  const cartItem = cart.find(
    item => item.product.id === product.id && item.selectedWeight === currentWeight
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleBuyNow = () => {
    if (!product.inStock || product.stock <= 0) return;
    if (quantityInCart === 0) {
      addToCart(product, 1, currentWeight);
    }
    setActiveProductModal(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => setActiveProductModal(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
          
          {/* Close button */}
          <button
            onClick={() => setActiveProductModal(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left: Product Image */}
            <div className="md:col-span-5 bg-stone-50 dark:bg-stone-800/50 p-6 flex flex-col justify-center items-center relative">
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner bg-white dark:bg-stone-800">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  className="w-full h-full"
                />
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 left-4 p-2 rounded-full bg-white dark:bg-stone-800 shadow-sm transition-colors ${
                  isFavorited ? 'text-rose-500' : 'text-stone-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Right: Details & Purchase actions */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                
                {/* Brand & Stock */}
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
                  <span className="uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                    {product.brand}
                  </span>
                  <span>Category: {product.category}</span>
                </div>

                {/* Title */}
                <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {product.name}
                </h2>

                {product.hindiName && (
                  <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                    {product.hindiName}
                  </p>
                )}

                {/* Ratings */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {product.rating}
                  </span>
                  <span className="text-xs text-stone-400">
                    ({product.reviewCount} customer reviews)
                  </span>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                    ₹{product.price}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-stone-400 line-through tabular-nums">
                      MRP ₹{product.mrp}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Weight Options */}
                {product.weightOptions && product.weightOptions.length > 0 && (
                  <div className="mb-4">
                    <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      Available Pack Sizes:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.weightOptions.map(w => (
                        <button
                          key={w}
                          onClick={() => setSelectedWeight(w)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            currentWeight === w
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                              : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>30-Min Local Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Original Brand</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Doorstep Return</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Stock ({product.stock} units)</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                {quantityInCart > 0 ? (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 rounded-xl px-3 py-2.5 text-emerald-800 dark:text-emerald-300 font-bold">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantityInCart - 1)}
                      className="p-1 hover:bg-emerald-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm tabular-nums">{quantityInCart} in Basket</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantityInCart + 1)}
                      disabled={quantityInCart >= product.stock}
                      className="p-1 hover:bg-emerald-100 rounded disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product, 1, currentWeight)}
                    disabled={!product.inStock || product.stock <= 0}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>
                )}

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock || product.stock <= 0}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
