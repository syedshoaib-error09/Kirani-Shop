import React, { useState } from 'react';
import { ShoppingBag, Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '', category }) => {
  const [error, setError] = useState(false);

  // Fallback category gradient colors
  const getCategoryColor = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'rice & dal':
        return 'from-amber-100 to-orange-100 text-amber-700 dark:from-amber-950/40 dark:to-orange-950/40 dark:text-amber-400';
      case 'atta & flour':
        return 'from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-950/40 dark:to-amber-950/40 dark:text-yellow-400';
      case 'oil & ghee':
        return 'from-orange-100 to-amber-100 text-orange-700 dark:from-orange-950/40 dark:to-amber-950/40 dark:text-orange-400';
      case 'milk & dairy':
        return 'from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-950/40 dark:to-cyan-950/40 dark:text-blue-400';
      case 'biscuits & snacks':
        return 'from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-950/40 dark:to-teal-950/40 dark:text-emerald-400';
      case 'tea & coffee':
        return 'from-amber-100 to-yellow-100 text-amber-800 dark:from-amber-950/40 dark:to-yellow-950/40 dark:text-amber-400';
      case 'masala & spices':
        return 'from-rose-100 to-orange-100 text-rose-700 dark:from-rose-950/40 dark:to-orange-950/40 dark:text-rose-400';
      default:
        return 'from-emerald-100 to-stone-100 text-emerald-800 dark:from-stone-900 dark:to-emerald-950/40 dark:text-emerald-400';
    }
  };

  if (error || !src) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${getCategoryColor(category)} p-4 text-center select-none ${className}`}>
        <Package className="w-10 h-10 mb-2 opacity-80" />
        <span className="text-xs font-semibold line-clamp-1">{alt}</span>
        <span className="text-[10px] opacity-75 mt-0.5">{category || 'Kirana Staple'}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 dark:bg-stone-900 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};
