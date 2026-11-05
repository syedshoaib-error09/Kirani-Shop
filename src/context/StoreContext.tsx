import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, StoreSettings, CartItem, Coupon, CategoryInfo, Order } from '../types';
import { INITIAL_STORE_SETTINGS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '../data/initialData';
import { api } from '../services/api';

interface StoreContextType {
  storeSettings: StoreSettings;
  updateStoreSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  products: Product[];
  categories: CategoryInfo[];
  coupons: Coupon[];
  refreshProducts: () => Promise<void>;
  refreshCoupons: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, weight?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (p: Product | null) => void;
  confirmedOrder: Order | null;
  setConfirmedOrder: (o: Order | null) => void;

  // Helpers
  isStoreOpen: boolean;
  storeStatusText: string;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kirana_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist from localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kirana_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Theme from localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('kirana_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Sync theme with documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('kirana_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kirana_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kirana_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  // Initial Load from API
  const refreshSettings = async () => {
    const res = await api.getSettings();
    setStoreSettings(res);
  };

  const refreshProducts = async () => {
    const res = await api.getProducts();
    setProducts(res);
  };

  const refreshCoupons = async () => {
    const res = await api.getCoupons();
    setCoupons(res);
  };

  const refreshCategories = async () => {
    const res = await api.getCategories();
    setCategories(res);
  };

  useEffect(() => {
    refreshSettings();
    refreshProducts();
    refreshCategories();
    refreshCoupons();
  }, []);

  const updateStoreSettings = async (updates: Partial<StoreSettings>) => {
    const updated = await api.updateSettings(updates);
    setStoreSettings(updated);
    showToast('Store settings updated successfully', 'success');
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, weight?: string) => {
    if (!product.inStock || product.stock <= 0) {
      showToast('Sorry, this product is currently out of stock!', 'error');
      return;
    }

    setCart(prev => {
      const selectedW = weight || product.unitWeight;
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedWeight === selectedW);
      if (existingIndex > -1) {
        const newCart = [...prev];
        const nextQty = newCart[existingIndex].quantity + quantity;
        if (nextQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock`, 'info');
          newCart[existingIndex].quantity = product.stock;
        } else {
          newCart[existingIndex].quantity = nextQty;
          showToast(`Updated "${product.name}" in cart`, 'success');
        }
        return newCart;
      } else {
        showToast(`Added "${product.name}" to your basket`, 'success');
        return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedWeight: selectedW }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const finalQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Live Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cartDeliveryFee =
    cart.length === 0
      ? 0
      : appliedCoupon?.code === 'FREEDEL' || cartSubtotal >= storeSettings.freeDeliveryThreshold
      ? 0
      : storeSettings.deliveryFee;

  let calculatedDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      const pct = (cartSubtotal * appliedCoupon.discountValue) / 100;
      calculatedDiscount = appliedCoupon.maxDiscount ? Math.min(pct, appliedCoupon.maxDiscount) : pct;
    } else {
      calculatedDiscount = appliedCoupon.discountValue;
    }
  }

  const cartDiscount = Math.round(calculatedDiscount);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === clean && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Add ₹${found.minOrder - cartSubtotal} more to apply coupon ${found.code} (Min order: ₹${found.minOrder})`
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied! Saved ₹${found.discountType === 'flat' ? found.discountValue : `${found.discountValue}%`}`, 'success');
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist Operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Store hours check
  const checkStoreHours = (): { isOpen: boolean; statusText: string } => {
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [openH, openM] = storeSettings.openHour.split(':').map(Number);
      const [closeH, closeM] = storeSettings.closeHour.split(':').map(Number);

      const openMinutes = openH * 60 + (openM || 0);
      const closeMinutes = closeH * 60 + (closeM || 0);

      const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;

      const formatTime = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 === 0 ? 12 : h % 12;
        return `${formattedH}:${m < 10 ? `0${m}` : m} ${ampm}`;
      };

      if (isOpen) {
        return {
          isOpen: true,
          statusText: `Open Now • Closes at ${formatTime(storeSettings.closeHour)}`
        };
      } else {
        return {
          isOpen: false,
          statusText: `Opens at ${formatTime(storeSettings.openHour)}`
        };
      }
    } catch {
      return { isOpen: true, statusText: "Open Now • 7:00 AM - 10:30 PM" };
    }
  };

  const storeStatus = checkStoreHours();

  return (
    <StoreContext.Provider
      value={{
        storeSettings,
        updateStoreSettings,
        products,
        categories,
        coupons,
        refreshProducts,
        refreshCoupons,
        refreshSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        theme,
        toggleTheme,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        activeProductModal,
        setActiveProductModal,
        confirmedOrder,
        setConfirmedOrder,
        isStoreOpen: storeStatus.isOpen,
        storeStatusText: storeStatus.statusText,
        toast,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
