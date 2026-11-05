import { Product, StoreSettings, Order, Coupon, CategoryInfo } from '../types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '../data/initialData';

// Fallback localStorage keys for offline / client resilience
const STORAGE_KEYS = {
  SETTINGS: 'kirana_store_settings',
  PRODUCTS: 'kirana_store_products',
  ORDERS: 'kirana_store_orders',
  COUPONS: 'kirana_store_coupons',
  WISHLIST: 'kirana_store_wishlist',
  CART: 'kirana_store_cart'
};

function getLocalData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const api = {
  // Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setLocalData(STORAGE_KEYS.SETTINGS, data.settings);
        return data.settings;
      }
    } catch {
      // ignore
    }
    return getLocalData(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        setLocalData(STORAGE_KEYS.SETTINGS, data.settings);
        return data.settings;
      }
    } catch {
      // ignore
    }
    const current = getLocalData(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
    const updated = { ...current, ...settings };
    setLocalData(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; sort?: string; inStockOnly?: boolean }): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sort) searchParams.set('sort', params.sort);
      if (params?.inStockOnly) searchParams.set('inStockOnly', 'true');

      const res = await fetch(`/api/products?${searchParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLocalData(STORAGE_KEYS.PRODUCTS, data.products);
        return data.products;
      }
    } catch {
      // ignore
    }

    let products = getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (params?.category && params.category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (params?.inStockOnly) {
      products = products.filter(p => p.inStock && p.stock > 0);
    }
    if (params?.sort === 'price-low') products.sort((a, b) => a.price - b.price);
    if (params?.sort === 'price-high') products.sort((a, b) => b.price - a.price);
    if (params?.sort === 'discount') products.sort((a, b) => b.discountPercent - a.discountPercent);

    return products;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch {
      // ignore
    }

    const current = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: product.name || 'New Product',
      brand: product.brand || 'Kirana Choice',
      category: product.category || 'Household Essentials',
      unitWeight: product.unitWeight || '1 kg',
      mrp: Number(product.mrp) || 100,
      price: Number(product.price) || 90,
      discountPercent: Math.max(0, Math.round((((Number(product.mrp) || 100) - (Number(product.price) || 90)) / (Number(product.mrp) || 100)) * 100)),
      stock: Number(product.stock) || 10,
      inStock: (Number(product.stock) || 10) > 0,
      image: product.image || '/src/assets/images/banner_fresh_staples_1793890097852.jpg',
      description: product.description || 'Quality grocery product.',
      rating: 4.5,
      reviewCount: 1,
      ...product
    };
    current.unshift(newProd);
    setLocalData(STORAGE_KEYS.PRODUCTS, current);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch {
      // ignore
    }

    const current = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updates };
      setLocalData(STORAGE_KEYS.PRODUCTS, current);
      return current[index];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // ignore
    }

    const current = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setLocalData(STORAGE_KEYS.PRODUCTS, current.filter(p => p.id !== id));
    return true;
  },

  // Categories
  async getCategories(): Promise<CategoryInfo[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        return data.categories;
      }
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setLocalData(STORAGE_KEYS.COUPONS, data.coupons);
        return data.coupons;
      }
    } catch {
      // ignore
    }
    return getLocalData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  async createCoupon(coupon: Coupon): Promise<Coupon> {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon)
      });
      if (res.ok) {
        const data = await res.json();
        return data.coupon;
      }
    } catch {
      // ignore
    }

    const current = getLocalData<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    current.push(coupon);
    setLocalData(STORAGE_KEYS.COUPONS, current);
    return coupon;
  },

  async deleteCoupon(code: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // ignore
    }

    const current = getLocalData<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    setLocalData(STORAGE_KEYS.COUPONS, current.filter(c => c.code !== code));
    return true;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setLocalData(STORAGE_KEYS.ORDERS, data.orders);
        return data.orders;
      }
    } catch {
      // ignore
    }
    return getLocalData(STORAGE_KEYS.ORDERS, []);
  },

  async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const data = await res.json();
        const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
        orders.unshift(data.order);
        setLocalData(STORAGE_KEYS.ORDERS, orders);
        return data.order;
      }
    } catch {
      // ignore
    }

    const orderNum = `KRN-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customer: orderPayload.customer!,
      items: orderPayload.items || [],
      subtotal: orderPayload.subtotal || 0,
      discount: orderPayload.discount || 0,
      deliveryFee: orderPayload.deliveryFee || 0,
      total: orderPayload.total || 0,
      paymentMethod: orderPayload.paymentMethod || 'cod',
      paymentStatus: orderPayload.paymentMethod === 'upi' ? 'pending' : 'paid_on_delivery',
      status: 'pending',
      createdAt: new Date().toISOString(),
      appliedCoupon: orderPayload.appliedCoupon,
      upiRefNumber: orderPayload.upiRefNumber
    };

    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    orders.unshift(newOrder);
    setLocalData(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (res.ok) return true;
    } catch {
      // ignore
    }

    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const target = orders.find(o => o.id === id);
    if (target) {
      target.status = status;
      if (paymentStatus) target.paymentStatus = paymentStatus;
      setLocalData(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  },

  // Admin Auth
  async loginAdmin(pin: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      return data.success;
    } catch {
      return pin === '1234' || pin === 'admin';
    }
  },

  // Analytics
  async getAnalytics() {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        return data.analytics;
      }
    } catch {
      // ignore
    }
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      lowStockCount: products.filter(p => p.stock < 10).length,
      outOfStockCount: products.filter(p => p.stock === 0).length,
      statusBreakdown: {
        pending: orders.filter(o => o.status === 'pending').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      },
      totalProducts: products.length
    };
  }
};
