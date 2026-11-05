export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  brand: string;
  category: string;
  unitWeight: string;
  mrp: number;
  price: number;
  discountPercent: number;
  stock: number;
  inStock: boolean;
  image: string;
  description: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  rating: number;
  reviewCount: number;
  badge?: string;
  weightOptions?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  landmark: string;
  pincode: string;
  deliverySlot: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  unitWeight: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'upi';
  paymentStatus: 'pending' | 'verified' | 'paid_on_delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  appliedCoupon?: string;
  upiRefNumber?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  upiId: string;
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  openHour: string;
  closeHour: string;
  deliveryRadiusKm: number;
  googleMapsEmbedUrl?: string;
  adminPin: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  description: string;
  color: string;
  accent: string;
  itemCount?: number;
}
