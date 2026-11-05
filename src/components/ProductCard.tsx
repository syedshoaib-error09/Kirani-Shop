import React, { useState } from 'react';
import { Heart, Plus, Minus, ShoppingBag, Eye, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    toggleWishlist,
    isInWishlist,
    setActiveProductModal,
    setIsCheckoutOpen
  } = useStore();

  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions?.[0] || product.unitWeight
  );

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find(
    item => item.product.id === product.id && item.selectedWeight === selectedWeight
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleBuyNow = () => {
    if (!product.inStock || product.stock <= 0) return;
    if (quantityInCart === 0) {
      addToCart(product, 1, selectedWeight);
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="perspective-card group">
      <div className="card-3d-hover relative flex flex-col justify-between h-full bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700">
        
        {/* Top Badges & Wishlist Action */}
        <div className="flex items-start justify-between gap-1 mb-2">
          <div className="flex flex-wrap gap-1">
            {product.discountPercent > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                {product.discountPercent}% OFF
              </span>
            )}
            {product.badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                {product.badge}
              </span>
            )}
            {!product.inStock && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                Out of Stock
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveProductModal(product)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-1.5 rounded-full transition-colors ${
                isFavorited
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Image Area */}
        <div 
          onClick={() => setActiveProductModal(product)}
          className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 cursor-pointer bg-stone-50 dark:bg-stone-800"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
            className="w-full h-full"
          />
        </div>

        {/* Brand & Category Info */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
            <span className="uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400">
              {product.brand}
            </span>
            <span>★ {product.rating} ({product.reviewCount})</span>
          </div>

          <h3 
            onClick={() => setActiveProductModal(product)}
            className="font-display font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 mt-1 line-clamp-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {product.hindiName && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1 font-medium">
              {product.hindiName}
            </p>
          )}
        </div>

        {/* Weight Selector / Badge */}
        <div className="mb-3">
          {product.weightOptions && product.weightOptions.length > 1 ? (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {product.weightOptions.map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-all ${
                    selectedWeight === w
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          ) : (
            <span className="inline-block text-xs font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
              {selectedWeight}
            </span>
          )}
        </div>

        {/* Pricing Area */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            ₹{product.price}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-stone-400 line-through tabular-nums">
              ₹{product.mrp}
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 ml-auto">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {/* Add to Cart / Quantity Stepper */}
          {quantityInCart > 0 ? (
            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 rounded-xl px-2 py-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
              <button
                onClick={() => updateCartQuantity(product.id, quantityInCart - 1)}
                className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm tabular-nums">{quantityInCart}</span>
              <button
                onClick={() => updateCartQuantity(product.id, quantityInCart + 1)}
                disabled={quantityInCart >= product.stock}
                className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1, selectedWeight)}
              disabled={!product.inStock || product.stock <= 0}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock || product.stock <= 0}
            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
