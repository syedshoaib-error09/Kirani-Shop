import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Tag, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Save, 
  Search, 
  RefreshCw,
  LogOut,
  IndianRupee,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Product, Order, Coupon, StoreSettings, CategoryInfo } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    storeSettings,
    updateStoreSettings,
    products,
    refreshProducts,
    categories,
    coupons,
    refreshCoupons,
    showToast
  } = useStore();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'coupons' | 'settings'>('overview');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);

  // Product Add / Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    hindiName: '',
    brand: '',
    category: 'Rice & Dal',
    unitWeight: '1 kg',
    mrp: 100,
    price: 85,
    stock: 25,
    image: '/src/assets/images/banner_fresh_staples_1793890097852.jpg',
    description: '',
    badge: ''
  });

  // Coupon Add Modal
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    code: '',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 499,
    description: '',
    isActive: true
  });
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  const loadAdminData = async () => {
    setOrdersLoading(true);
    const ords = await api.getOrders();
    setOrders(ords);
    const stats = await api.getAnalytics();
    setAnalytics(stats);
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (isAdminAuthenticated && isAdminOpen) {
      loadAdminData();
    }
  }, [isAdminAuthenticated, isAdminOpen]);

  if (!isAdminOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await api.loginAdmin(pinInput);
    if (success) {
      setIsAdminAuthenticated(true);
      setPinError(false);
      setPinInput('');
      showToast('Admin logged in successfully', 'success');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Logged out of Admin Portal', 'info');
  };

  // Order Status update
  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await api.updateOrderStatus(orderId, status);
    loadAdminData();
    showToast(`Order status updated to "${status}"`, 'success');
  };

  // Product Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Name and price are required', 'error');
      return;
    }

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productForm);
      showToast(`Product "${productForm.name}" updated`, 'success');
    } else {
      await api.createProduct(productForm);
      showToast(`Product "${productForm.name}" created`, 'success');
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    await refreshProducts();
    await loadAdminData();
  };

  // Product Delete
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await api.deleteProduct(id);
      await refreshProducts();
      await loadAdminData();
      showToast(`Product "${name}" deleted`, 'info');
    }
  };

  // Quick Stock Adjustment
  const handleQuickStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    await api.updateProduct(product.id, { stock: newStock, inStock: newStock > 0 });
    await refreshProducts();
    await loadAdminData();
  };

  // Coupon Creation
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    await api.createCoupon(newCoupon);
    await refreshCoupons();
    setIsCouponModalOpen(false);
    setNewCoupon({
      code: '',
      discountType: 'flat',
      discountValue: 50,
      minOrder: 499,
      description: '',
      isActive: true
    });
    showToast('Coupon added successfully', 'success');
  };

  const handleDeleteCoupon = async (code: string) => {
    await api.deleteCoupon(code);
    await refreshCoupons();
    showToast(`Coupon ${code} removed`, 'info');
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(settingsForm);
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden min-h-[580px] max-h-[92vh] flex flex-col my-4">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                  Kirana Store Owner Portal
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Live Management
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {storeSettings.storeName} · {storeSettings.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: PIN Login Screen */}
        {!isAdminAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100 mb-1">
              Store Owner Sign-In
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Enter your 4-digit Owner PIN to manage inventory, incoming customer orders, prices and settings.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  placeholder="Enter PIN (Default: 1234)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full text-center tracking-[0.5em] text-xl font-bold py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                />
                {pinError && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium">
                    Incorrect PIN. Default is 1234.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Unlock Dashboard
              </button>

              <button
                type="button"
                onClick={() => setPinInput('1234')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Auto-fill Demo PIN (1234)
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-stone-50 dark:bg-stone-900/60 border-r border-stone-200 dark:border-stone-800 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Live Orders</span>
                {orders.length > 0 && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Coupons & Deals</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </button>
            </div>

            {/* Main Content View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-stone-900">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                      Store Performance Overview
                    </h3>
                    <p className="text-xs text-stone-500">
                      Live store metrics, revenue and inventory health
                    </p>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                        Total Sales Revenue
                      </span>
                      <div className="font-display text-2xl font-extrabold text-emerald-950 dark:text-emerald-100 mt-1 tabular-nums">
                        ₹{analytics?.totalRevenue || orders.reduce((s, o) => s + o.total, 0)}
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                        From {orders.length} completed orders
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                        Pending Deliveries
                      </span>
                      <div className="font-display text-2xl font-extrabold text-amber-950 dark:text-amber-100 mt-1 tabular-nums">
                        {orders.filter(o => o.status === 'pending' || o.status === 'preparing').length}
                      </div>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
                        Requires store dispatch
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                      <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider block">
                        Total Inventory Items
                      </span>
                      <div className="font-display text-2xl font-extrabold text-blue-950 dark:text-blue-100 mt-1 tabular-nums">
                        {products.length}
                      </div>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 block">
                        Across 11 categories
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                      <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
                        Low Stock Alerts
                      </span>
                      <div className="font-display text-2xl font-extrabold text-rose-950 dark:text-rose-100 mt-1 tabular-nums">
                        {products.filter(p => p.stock < 10).length}
                      </div>
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">
                        Stock below 10 units
                      </span>
                    </div>
                  </div>

                  {/* Recent Incoming Orders Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display font-bold text-base text-stone-900 dark:text-stone-100">
                        Recent Customer Orders
                      </h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        View All Orders →
                      </button>
                    </div>

                    <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
                      {orders.slice(0, 4).map(o => (
                        <div key={o.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-stone-900 dark:text-stone-100">
                                {o.orderNumber}
                              </span>
                              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                                {o.customer.name}
                              </span>
                              <span className="text-[11px] text-stone-400">
                                ({o.customer.phone})
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                              {o.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-bold text-sm text-stone-900 dark:text-stone-100 tabular-nums">
                              ₹{o.total}
                            </span>
                            <span className={`block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 ${
                              o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                        Customer Orders ({orders.length})
                      </h3>
                      <p className="text-xs text-stone-500">
                        Review customer grocery orders, payment verification and status
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                      >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={loadAdminData}
                        className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Refresh Orders"
                      >
                        <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {filteredOrders.length > 0 ? (
                    <div className="space-y-3">
                      {filteredOrders.map(order => (
                        <div
                          key={order.id}
                          className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-emerald-300 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-emerald-800 dark:text-emerald-400">
                                  {order.orderNumber}
                                </span>
                                <span className="text-xs text-stone-400">·</span>
                                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                  {order.customer.name}
                                </span>
                                <a
                                  href={`tel:${order.customer.phone}`}
                                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{order.customer.phone}</span>
                                </a>
                              </div>
                              <div className="text-xs text-stone-500 mt-1">
                                {order.customer.address}, {order.customer.pincode} · Slot: <strong>{order.customer.deliverySlot}</strong>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="font-display font-bold text-base text-stone-900 dark:text-stone-100 tabular-nums">
                                  ₹{order.total}
                                </span>
                                <span className="block text-[10px] uppercase font-bold text-stone-500">
                                  {order.paymentMethod} ({order.paymentStatus})
                                </span>
                              </div>

                              {/* Status Select */}
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : order.status === 'out_for_delivery'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : order.status === 'preparing'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : order.status === 'cancelled'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : 'bg-stone-200 text-stone-800 border-stone-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="preparing">Preparing</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Items summary */}
                          <div className="pt-3">
                            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                              Items Ordered:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded-lg text-stone-800 dark:text-stone-200"
                                >
                                  <strong>{item.quantity}x</strong> {item.name} ({item.unitWeight}) = ₹{item.price * item.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-stone-400">
                      No orders found under selected filter.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PRODUCTS INVENTORY */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                        Grocery Catalog & Inventory ({products.length})
                      </h3>
                      <p className="text-xs text-stone-500">
                        Add items, adjust prices, edit descriptions, or update stock
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          hindiName: '',
                          brand: '',
                          category: 'Rice & Dal',
                          unitWeight: '1 kg',
                          mrp: 120,
                          price: 99,
                          stock: 25,
                          image: '/src/assets/images/banner_fresh_staples_1793890097852.jpg',
                          description: '',
                          badge: ''
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price / MRP</th>
                          <th className="p-3">Stock Units</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {products.map(product => (
                          <tr key={product.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-9 h-9 rounded-lg object-cover bg-stone-100 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                                    {product.name}
                                  </div>
                                  <div className="text-[11px] text-stone-500">
                                    {product.brand} · {product.unitWeight}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3 text-stone-600 dark:text-stone-400">
                              {product.category}
                            </td>

                            <td className="p-3">
                              <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                                ₹{product.price}
                              </span>
                              {product.mrp > product.price && (
                                <span className="text-[11px] text-stone-400 line-through ml-1.5 tabular-nums">
                                  ₹{product.mrp}
                                </span>
                              )}
                            </td>

                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleQuickStock(product, -1)}
                                  className="w-5 h-5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                  product.stock === 0 ? 'bg-rose-100 text-rose-800' : product.stock < 10 ? 'bg-amber-100 text-amber-800' : 'text-stone-900 dark:text-stone-100'
                                }`}>
                                  {product.stock}
                                </span>
                                <button
                                  onClick={() => handleQuickStock(product, +5)}
                                  className="w-5 h-5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setProductForm({ ...product });
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: COUPONS & DEALS */}
              {activeTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                        Discounts & Coupons ({coupons.length})
                      </h3>
                      <p className="text-xs text-stone-500">
                        Manage active store coupon codes and minimum order triggers
                      </p>
                    </div>

                    <button
                      onClick={() => setIsCouponModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Coupon</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {coupons.map(coupon => (
                      <div
                        key={coupon.code}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-start justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              {coupon.code}
                            </span>
                            <span className="text-xs text-stone-500">
                              Min Order: ₹{coupon.minOrder}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-2">
                            {coupon.description}
                          </p>
                          <span className="text-[11px] text-stone-400 mt-1 block">
                            Type: {coupon.discountType === 'flat' ? `Flat ₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteCoupon(coupon.code)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                      Store Profile & Delivery Configuration
                    </h3>
                    <p className="text-xs text-stone-500">
                      Keep your neighbourhood store name, WhatsApp number, and address updated
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Store Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.storeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Store Tagline / Greeting
                      </label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        WhatsApp Order Number (without +) *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Physical Store Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={settingsForm.city}
                        onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={settingsForm.pincode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Store UPI ID (VPA) *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.upiId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Free Delivery Minimum Order (₹)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.freeDeliveryThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Opening Hour (24-hr e.g. 07:00)
                      </label>
                      <input
                        type="time"
                        value={settingsForm.openHour}
                        onChange={(e) => setSettingsForm({ ...settingsForm, openHour: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Closing Hour (24-hr e.g. 22:30)
                      </label>
                      <input
                        type="time"
                        value={settingsForm.closeHour}
                        onChange={(e) => setSettingsForm({ ...settingsForm, closeHour: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                {editingProduct ? 'Edit Grocery Item' : 'Add New Grocery Item'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daawat Rozana Gold Basmati"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hindi Name</label>
                  <input
                    type="text"
                    placeholder="e.g. बासमती चावल"
                    value={productForm.hindiName}
                    onChange={(e) => setProductForm({ ...productForm, hindiName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daawat / Amul / Tata"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Weight / Unit *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg / 500 g / 1 L"
                    value={productForm.unitWeight}
                    onChange={(e) => setProductForm({ ...productForm, unitWeight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock (Units)</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Fresh quality details..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Image URL / Asset</label>
                <input
                  type="text"
                  placeholder="Image path or URL"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-800">
            <h3 className="font-display font-bold text-base mb-3">Create New Discount Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border"
                  >
                    <option value="flat">Flat ₹ OFF</option>
                    <option value="percentage">% Percentage OFF</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={newCoupon.minOrder}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. ₹50 off on weekend groceries"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
