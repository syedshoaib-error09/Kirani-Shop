import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryBar } from './components/CategoryBar';
import { OffersBanner } from './components/OffersBanner';
import { ProductGrid } from './components/ProductGrid';
import { StoreLocationSection } from './components/StoreLocationSection';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { Toast } from './components/Toast';
import { Home, LayoutGrid, Heart, ShoppingBag, MessageCircle } from 'lucide-react';

function StoreLayout() {
  const { cartCount, wishlist, setIsCartOpen, setIsWishlistOpen, storeSettings } = useStore();

  const scrollToCategories = () => {
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = storeSettings.whatsappNumber.replace(/\D/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors pb-16 sm:pb-0">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <CategoryBar />
        <OffersBanner />
        <ProductGrid />
        <CustomerReviews />
        <StoreLocationSection />
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-over Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AdminDashboard />
      <ProductDetailModal />
      <WishlistDrawer />

      {/* Floating WhatsApp Contact Button */}
      <FloatingWhatsAppButton />

      {/* Notification Toast */}
      <Toast />

      {/* Mobile Bottom Navigation Bar for touch access */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-2 flex items-center justify-between">
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-1"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        <button
          onClick={scrollToCategories}
          className="flex flex-col items-center justify-center text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-1"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Categories</span>
        </button>

        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello! I would like to order groceries from your store.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-green-600 py-1"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
        </a>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center text-stone-600 dark:text-stone-400 hover:text-rose-500 py-1"
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] font-medium mt-0.5">Wishlist</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400 py-1"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-stone-950 text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-bold mt-0.5">Basket</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreLayout />
    </StoreProvider>
  );
}
