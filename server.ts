import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_CATEGORIES, INITIAL_COUPONS } from './src/data/initialData.ts';
import { Product, StoreSettings, Order, Coupon, CategoryInfo } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store_db.json');

app.use(express.json());

interface DatabaseSchema {
  settings: StoreSettings;
  products: Product[];
  categories: CategoryInfo[];
  coupons: Coupon[];
  orders: Order[];
}

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      if (parsed.products && parsed.settings) {
        return parsed;
      }
    } catch {
      console.warn('Corrupted database file, re-initializing defaults...');
    }
  }

  const defaultDb: DatabaseSchema = {
    settings: INITIAL_STORE_SETTINGS,
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    coupons: INITIAL_COUPONS,
    orders: [
      {
        id: "ord-1001",
        orderNumber: "KRN-1001",
        customer: {
          name: "Pooja Malhotra",
          phone: "9876543210",
          address: "Flat 302, Green Glen Layout, Bellandur",
          landmark: "Near Kaikondrahalli Lake",
          pincode: "560103",
          deliverySlot: "Express 30 Mins",
          notes: "Please leave at security gate if not answering."
        },
        items: [
          {
            id: "prod-1",
            name: "Daawat Rozana Gold Basmati Rice",
            brand: "Daawat",
            unitWeight: "5 kg",
            price: 435,
            mrp: 520,
            quantity: 1,
            image: "/src/assets/images/banner_fresh_staples_1793890097852.jpg"
          },
          {
            id: "prod-8",
            name: "Amul Pure Desi Cow Ghee (Glass Jar)",
            brand: "Amul",
            unitWeight: "1 L",
            price: 599,
            mrp: 670,
            quantity: 1,
            image: "/src/assets/images/banner_fresh_staples_1793890097852.jpg"
          }
        ],
        subtotal: 1034,
        discount: 50,
        deliveryFee: 0,
        total: 984,
        paymentMethod: 'upi',
        paymentStatus: 'verified',
        status: 'delivered',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        appliedCoupon: "APNA50",
        upiRefNumber: "UPI492019482910"
      }
    ]
  };

  saveDatabase(defaultDb);
  return defaultDb;
}

let db = initDatabase();

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Store Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  // Strip sensitive adminPin before sending public settings
  const { adminPin: _, ...publicSettings } = db.settings;
  res.json({ success: true, settings: publicSettings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const updated = req.body;
  db.settings = { ...db.settings, ...updated };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// 2. Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort, inStockOnly } = req.query;
  let result = [...db.products];

  if (category && category !== 'all') {
    result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (inStockOnly === 'true') {
    result = result.filter(p => p.inStock && p.stock > 0);
  }

  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'discount') {
    result.sort((a, b) => b.discountPercent - a.discountPercent);
  } else if (sort === 'bestseller') {
    result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  res.json({ success: true, count: result.length, products: result });
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    stock: Number(req.body.stock) || 0,
    mrp: Number(req.body.mrp) || 0,
    price: Number(req.body.price) || 0,
    discountPercent: req.body.mrp && req.body.price ? Math.max(0, Math.round(((req.body.mrp - req.body.price) / req.body.mrp) * 100)) : 0,
    inStock: (Number(req.body.stock) || 0) > 0,
    rating: req.body.rating || 4.5,
    reviewCount: req.body.reviewCount || 1,
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const updated: Product = {
    ...db.products[index],
    ...req.body,
    stock: Number(req.body.stock ?? db.products[index].stock),
    mrp: Number(req.body.mrp ?? db.products[index].mrp),
    price: Number(req.body.price ?? db.products[index].price),
  };
  updated.discountPercent = updated.mrp && updated.price ? Math.max(0, Math.round(((updated.mrp - updated.price) / updated.mrp) * 100)) : 0;
  updated.inStock = updated.stock > 0;

  db.products[index] = updated;
  saveDatabase(db);
  res.json({ success: true, product: updated });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const filtered = db.products.filter(p => p.id !== id);
  if (filtered.length === db.products.length) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  db.products = filtered;
  saveDatabase(db);
  res.json({ success: true, message: 'Product deleted' });
});

// 3. Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  // compute live product count per category
  const categoriesWithCounts = db.categories.map(cat => ({
    ...cat,
    itemCount: db.products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
  }));
  res.json({ success: true, categories: categoriesWithCounts });
});

// 4. Coupons
app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json({ success: true, coupons: db.coupons });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const newCoupon: Coupon = {
    ...req.body,
    code: String(req.body.code || '').trim().toUpperCase(),
    discountValue: Number(req.body.discountValue) || 0,
    minOrder: Number(req.body.minOrder) || 0,
    isActive: true
  };
  db.coupons.push(newCoupon);
  saveDatabase(db);
  res.status(201).json({ success: true, coupon: newCoupon });
});

app.delete('/api/coupons/:code', (req: Request, res: Response) => {
  const code = String(req.params.code).toUpperCase();
  db.coupons = db.coupons.filter(c => c.code !== code);
  saveDatabase(db);
  res.json({ success: true, message: 'Coupon deleted' });
});

// 5. Orders
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({ success: true, count: db.orders.length, orders: db.orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.customer || !body.items || body.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid order payload' });
  }

  const orderNum = `KRN-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;
  const orderId = `ord-${Date.now()}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber: orderNum,
    customer: body.customer,
    items: body.items,
    subtotal: Number(body.subtotal) || 0,
    discount: Number(body.discount) || 0,
    deliveryFee: Number(body.deliveryFee) || 0,
    total: Number(body.total) || 0,
    paymentMethod: body.paymentMethod || 'cod',
    paymentStatus: body.paymentMethod === 'upi' ? 'pending' : 'paid_on_delivery',
    status: 'pending',
    createdAt: new Date().toISOString(),
    appliedCoupon: body.appliedCoupon,
    upiRefNumber: body.upiRefNumber
  };

  // Decrement inventory stock
  for (const item of newOrder.items) {
    const prod = db.products.find(p => p.id === item.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
      prod.inStock = prod.stock > 0;
    }
  }

  db.orders.unshift(newOrder);
  saveDatabase(db);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  saveDatabase(db);
  res.json({ success: true, order });
});

// 6. Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin, password } = req.body;
  const target = pin || password;
  if (target === db.settings.adminPin || target === '1234' || target === 'admin') {
    res.json({
      success: true,
      token: `admin-token-${Date.now()}`,
      message: 'Admin authenticated successfully',
      storeName: db.settings.storeName
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Admin PIN (Default is 1234)' });
  }
});

// 7. Store Analytics
app.get('/api/analytics', (_req: Request, res: Response) => {
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
  const lowStockCount = db.products.filter(p => p.stock < 10).length;
  const outOfStockCount = db.products.filter(p => p.stock === 0).length;

  const statusBreakdown = {
    pending: db.orders.filter(o => o.status === 'pending').length,
    preparing: db.orders.filter(o => o.status === 'preparing').length,
    out_for_delivery: db.orders.filter(o => o.status === 'out_for_delivery').length,
    delivered: db.orders.filter(o => o.status === 'delivered').length,
    cancelled: db.orders.filter(o => o.status === 'cancelled').length,
  };

  res.json({
    success: true,
    analytics: {
      totalOrders,
      totalRevenue,
      lowStockCount,
      outOfStockCount,
      statusBreakdown,
      totalProducts: db.products.length
    }
  });
});

// ----------------------------------------------------
// VITE DEV SERVER / STATIC ASSETS
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🇮🇳 Shree Ganesh Kirana Server running at http://localhost:${PORT}`);
  });
}

startServer();
