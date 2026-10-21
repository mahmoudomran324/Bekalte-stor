export type UserRole = 'customer' | 'merchant' | 'admin' | 'supervisor';

export type ProductCategory = 
  | 'خضار وفواكه'
  | 'بقالة ومجففات'
  | 'جبن وألبان'
  | 'سوبرماركت كامل'
  | 'مشروبات ومجمدات';

export type ProductUnit = 'كيلو' | 'جرام' | 'قطعة' | 'علبة' | 'كرتونة' | 'ربطة' | 'لتر';

export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export type PaymentMethod = 'vodafone_cash' | 'instapay' | 'cash_on_delivery';

export interface LocationArea {
  governorate: string;
  districts: string[];
}

export interface Merchant {
  id: string;
  name: string;
  storeName: string;
  phone: string;
  email: string;
  password?: string;
  governorate: string;
  district: string;
  street: string;
  building: string;
  category: ProductCategory;
  image: string;
  isApproved: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  debtBalance: number; // মديونية التاجر للتطبيق (بالجنيه)
  totalSales: number; // إجمالي المبيعات
  completedOrdersCount: number;
  termsAcceptedAt?: string;
  debtPayments: DebtPayment[];
}

export interface DebtPayment {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  method: 'vodafone_cash' | 'instapay';
  receiptImage?: string; // صورة إثبات التحويل / لقطة الشاشة
  refNumber?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MonthlyDeliveryPackage {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  governorate: string;
  district: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  notes?: string;
  isBlocked: boolean;
  registeredAt: string;
  hasDeliverySubscription?: boolean;
  deliverySubscriptionPlan?: string;
  deliverySubscriptionExpiresAt?: string;
}

export interface Product {
  id: string;
  merchantId: string;
  merchantName: string;
  name: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  unit: ProductUnit;
  image: string;
  description: string;
  isAvailable: boolean;
  governorate: string;
  district: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  unit: ProductUnit;
  quantity: number;
  image: string;
  merchantId: string;
  merchantName: string;
}

export interface OrderCaptain {
  name: string;
  phone: string;
  whatsappUrl: string;
  assignedAt: string;
}

export interface ReturnRequest {
  id: string;
  reason: string;
  itemsDescription: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: {
    governorate: string;
    district: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    notes?: string;
  };
  items: OrderItem[];
  merchants: string[]; // List of merchant IDs involved
  merchantsSummary: { id: string; name: string; itemsCount: number; subtotal: number; shipping: number }[];
  itemsSubtotal: number;
  totalShipping: number;
  grandTotal: number;
  platformCommission: number; // عمولة التطبيق المستحقة
  paymentMethod: PaymentMethod;
  paymentRefNumber?: string;
  status: OrderStatus;
  createdAt: string;
  preparingAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  captain?: OrderCaptain;
  returnRequest?: ReturnRequest;
  customerConfirmedDelivery?: boolean;
  merchantConfirmedDelivery?: boolean;
  isSubscriptionFreeDelivery?: boolean;
}

export interface Captain {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  district: string;
  vehicleType: string;
  isActive: boolean;
}

export interface SponsoredAd {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badgeText: string;
  linkText?: string;
  targetMerchantId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  type: 'suggestion' | 'complaint' | 'support';
  senderName: string;
  senderPhone: string;
  senderRole: 'customer' | 'merchant';
  message: string;
  date: string;
  status: 'new' | 'in_progress' | 'resolved';
}

export interface PasswordResetRequest {
  id: string;
  phone: string;
  merchantName?: string;
  requestedAt: string;
  status: 'pending' | 'sent';
}

export interface AdminSettings {
  commissionRate: number; // e.g., 10%
  maxDebtLimit: number; // الحد الأقصى للمديونية قبل إيقاف المتجر (e.g. 1500 ج.م)
  defaultShippingPerStore: number; // رسوم الشحن لكل متجر (e.g. 15 ج.م)
  vodafoneCashNumber: string;
  instapayAddress: string;
  supportPhone: string;
  supportWhatsapp: string;
  monthlyPackages?: MonthlyDeliveryPackage[];
}

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  permissions: {
    canManageMerchants: boolean;
    canManageOrders: boolean;
    canManageFinancials: boolean;
    canManageAds: boolean;
    canManageSupport: boolean;
  };
  isActive: boolean;
}
