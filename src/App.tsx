import React, { useState, useEffect } from 'react';
import {
  AdminSettings,
  Captain,
  CartItem,
  Customer,
  Merchant,
  MonthlyDeliveryPackage,
  Order,
  PasswordResetRequest,
  Product,
  ReturnRequest,
  SponsoredAd,
  Suggestion,
  Supervisor,
  UserRole,
} from './types';
import { StorageService } from './utils/storage';
import { orderAudio } from './utils/audioAlert';

// Components
import { TermsModal } from './components/TermsModal';
import { Header } from './components/CustomerView/Header';
import { AdsBanner } from './components/CustomerView/AdsBanner';
import { CategoryBar } from './components/CustomerView/CategoryBar';
import { StoresList } from './components/CustomerView/StoresList';
import { ProductsGrid } from './components/CustomerView/ProductsGrid';
import { CartModal } from './components/CustomerView/CartModal';
import { CheckoutModal } from './components/CustomerView/CheckoutModal';
import { CustomerOrdersModal } from './components/CustomerView/CustomerOrdersModal';
import { SupportModal } from './components/CustomerView/SupportModal';
import { PackagesModal } from './components/CustomerView/PackagesModal';

import { MerchantAuth } from './components/MerchantView/MerchantAuth';
import { MerchantDashboard } from './components/MerchantView/MerchantDashboard';

import { AdminAuth } from './components/AdminView/AdminAuth';
import { AdminDashboard } from './components/AdminView/AdminDashboard';

import {
  Store,
  ShoppingBag,
  Shield,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  // Initialize storage
  useEffect(() => {
    StorageService.init();
  }, []);

  // Database State
  const [merchants, setMerchants] = useState<Merchant[]>(() => StorageService.getMerchants());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [captains, setCaptains] = useState<Captain[]>(() => StorageService.getCaptains());
  const [ads, setAds] = useState<SponsoredAd[]>(() => StorageService.getAds());
  const [settings, setSettings] = useState<AdminSettings>(() => StorageService.getSettings());
  const [supervisors, setSupervisors] = useState<Supervisor[]>(() => StorageService.getSupervisors());
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => StorageService.getSuggestions());
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>(() =>
    StorageService.getPasswordResetRequests()
  );

  // Admin credentials state (customizable by Admin)
  const [adminEmail, setAdminEmail] = useState('admin@bekala.com');
  const [adminPass, setAdminPass] = useState('admin123456');

  // Active Role and Auth State
  const [currentRole, setCurrentRole] = useState<'customer' | 'merchant' | 'admin'>('customer');
  const [loggedInMerchant, setLoggedInMerchant] = useState<Merchant | null>(null);
  const [adminUserType, setAdminUserType] = useState<'admin' | 'supervisor' | null>(null);
  const [currentSupervisor, setCurrentSupervisor] = useState<Supervisor | undefined>();

  // Location filter for customer view
  const [selectedGov, setSelectedGov] = useState<string>('القاهرة');
  const [selectedDist, setSelectedDist] = useState<string>('المعادي');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Customer Cart & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);

  // Customer Monthly Subscription state
  const [customerSubscription, setCustomerSubscription] = useState<{
    isSubscribed: boolean;
    planName?: string;
    expiresAt?: string;
  }>(() => {
    const saved = localStorage.getItem('bekala_customer_subscription');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { isSubscribed: false };
      }
    }
    return { isSubscribed: false };
  });

  const handleSubscribePackage = (pkg: MonthlyDeliveryPackage, paymentMethod: string, proof: string) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const newSub = {
      isSubscribed: true,
      planName: pkg.name,
      expiresAt: expiry.toISOString(),
      paymentMethod,
      proof,
    };
    setCustomerSubscription(newSub);
    localStorage.setItem('bekala_customer_subscription', JSON.stringify(newSub));
  };

  // Mandatory Charter / Terms Modal State
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsReadOnly, setTermsReadOnly] = useState(false);

  // Sync state helpers
  const handleUpdateMerchants = (list: Merchant[]) => {
    setMerchants(list);
    StorageService.saveMerchants(list);
    if (loggedInMerchant) {
      const refreshed = list.find((m) => m.id === loggedInMerchant.id);
      if (refreshed) setLoggedInMerchant(refreshed);
    }
  };

  const handleUpdateOrders = (list: Order[]) => {
    setOrders(list);
    StorageService.saveOrders(list);
  };

  const handleUpdateProducts = (list: Product[]) => {
    setProducts(list);
    StorageService.saveProducts(list);
  };

  const handleUpdateCustomers = (list: Customer[]) => {
    setCustomers(list);
    StorageService.saveCustomers(list);
  };

  const handleUpdateCaptains = (list: Captain[]) => {
    setCaptains(list);
    StorageService.saveCaptains(list);
  };

  const handleUpdateAds = (list: SponsoredAd[]) => {
    setAds(list);
    StorageService.saveAds(list);
  };

  const handleUpdateSettings = (s: AdminSettings) => {
    setSettings(s);
    StorageService.saveSettings(s);
  };

  const handleUpdateSupervisors = (list: Supervisor[]) => {
    setSupervisors(list);
    StorageService.saveSupervisors(list);
  };

  const handleUpdateSuggestions = (list: Suggestion[]) => {
    setSuggestions(list);
    localStorage.setItem('bekala_suggestions', JSON.stringify(list));
  };

  const handleUpdateResetRequests = (list: PasswordResetRequest[]) => {
    setResetRequests(list);
    localStorage.setItem('bekala_reset_requests', JSON.stringify(list));
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order submission
  const handleOrderPlaced = (newOrder: Order) => {
    StorageService.addOrder(newOrder);
    setOrders(StorageService.getOrders());
    setMerchants(StorageService.getMerchants());
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsOrdersOpen(true);

    // Audio alarm starts immediately for the merchant!
    orderAudio.startAlarm();
  };

  // Customer confirms delivery
  const handleConfirmCustomerDelivery = (orderId: string) => {
    const list = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'delivered' as const,
          deliveredAt: new Date().toISOString(),
          customerConfirmedDelivery: true,
        };
      }
      return o;
    });
    handleUpdateOrders(list);
  };

  // Customer requests return of damaged item (Free, zero shipping fee)
  const handleRequestReturn = (
    orderId: string,
    returnData: Omit<ReturnRequest, 'id' | 'requestedAt' | 'status'>
  ) => {
    const list = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          returnRequest: {
            id: `ret-${Date.now()}`,
            reason: returnData.reason,
            itemsDescription: returnData.itemsDescription,
            requestedAt: new Date().toISOString(),
            status: 'pending' as const,
          },
        };
      }
      return o;
    });
    handleUpdateOrders(list);
  };

  // Suggestion submit
  const handleAddSuggestion = (s: Suggestion) => {
    StorageService.addSuggestion(s);
    setSuggestions(StorageService.getSuggestions());
  };

  // Location selector change
  const handleLocationChange = (gov: string, dist: string) => {
    setSelectedGov(gov);
    setSelectedDist(dist);
    setSelectedStoreId(null);
    StorageService.setSelectedLocation({ governorate: gov, district: dist });
  };

  const activeCustomerOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'delivering'
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Cairo',sans-serif] selection:bg-emerald-500 selection:text-white">
      {/* Top Universal Role Switcher Toolbar */}
      <div className="bg-slate-950 text-white px-4 py-2 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-slate-300">منصة بقالة ستور المتكاملة:</span>
            <span className="text-slate-400 hidden sm:inline">
              تنقل بنقرة واحدة بين واجهة العميل ولوحة التاجر ولوحة الإدارة
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentRole('customer')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                currentRole === 'customer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>متجر العميل</span>
            </button>

            <button
              onClick={() => setCurrentRole('merchant')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                currentRole === 'merchant'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>لوحة التاجر</span>
            </button>

            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: CUSTOMER EXPERIENCE */}
        {currentRole === 'customer' && (
          <div>
            <Header
              selectedGov={selectedGov}
              selectedDist={selectedDist}
              onLocationChange={handleLocationChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenOrders={() => setIsOrdersOpen(true)}
              onOpenSupport={() => setIsSupportOpen(true)}
              onOpenRoleSwitch={() => setCurrentRole('merchant')}
              activeOrdersCount={activeCustomerOrders.length}
              onOpenPledge={() => {
                setTermsReadOnly(true);
                setIsTermsOpen(true);
              }}
              onOpenPackages={() => setIsPackagesOpen(true)}
              hasSubscription={customerSubscription.isSubscribed}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* Sponsored Banner Slider */}
              <AdsBanner
                ads={ads}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />

              {/* Category Quick Bar */}
              <CategoryBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Nearby Stores in district */}
              <StoresList
                merchants={merchants}
                selectedGov={selectedGov}
                selectedDist={selectedDist}
                selectedMerchantId={selectedStoreId}
                onSelectMerchant={setSelectedStoreId}
              />

              {/* Products Catalog */}
              <ProductsGrid
                products={products}
                merchants={merchants}
                selectedGov={selectedGov}
                selectedDist={selectedDist}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                selectedMerchantId={selectedStoreId}
                onAddToCart={handleAddToCart}
                cartProductIds={cartItems.map((i) => i.product.id)}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: MERCHANT EXPERIENCE */}
        {currentRole === 'merchant' && (
          <div>
            {!loggedInMerchant ? (
              <MerchantAuth
                onLoginSuccess={(m) => setLoggedInMerchant(m)}
                merchants={merchants}
                onRegisterMerchant={(m) => {
                  handleUpdateMerchants([m, ...merchants]);
                  setLoggedInMerchant(m);
                }}
                onRequestPasswordReset={(req) => {
                  StorageService.addPasswordResetRequest(req);
                  setResetRequests(StorageService.getPasswordResetRequests());
                }}
                onOpenTerms={() => {
                  setTermsReadOnly(false);
                  setIsTermsOpen(true);
                }}
              />
            ) : (
              <MerchantDashboard
                merchant={loggedInMerchant}
                orders={orders}
                products={products}
                captains={captains}
                settings={settings}
                onUpdateMerchant={(updated) => {
                  handleUpdateMerchants(
                    merchants.map((m) => (m.id === updated.id ? updated : m))
                  );
                }}
                onUpdateOrder={(updatedOrder) => {
                  handleUpdateOrders(
                    orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
                  );
                }}
                onAddProduct={(newProd) => {
                  handleUpdateProducts([newProd, ...products]);
                }}
                onUpdateProduct={(updatedProd) => {
                  handleUpdateProducts(
                    products.map((p) => (p.id === updatedProd.id ? updatedProd : p))
                  );
                }}
                onDeleteProduct={(pId) => {
                  handleUpdateProducts(products.filter((p) => p.id !== pId));
                }}
                onLogout={() => {
                  orderAudio.stopAlarm();
                  setLoggedInMerchant(null);
                }}
                onOpenTerms={() => {
                  setTermsReadOnly(true);
                  setIsTermsOpen(true);
                }}
              />
            )}
          </div>
        )}

        {/* VIEW 3: ADMIN & SUPERVISOR EXPERIENCE */}
        {currentRole === 'admin' && (
          <div>
            {!adminUserType ? (
              <AdminAuth
                onAdminLogin={(type, supervisor) => {
                  setAdminUserType(type);
                  setCurrentSupervisor(supervisor);
                }}
                supervisors={supervisors}
                adminEmail={adminEmail}
                adminPass={adminPass}
              />
            ) : (
              <AdminDashboard
                currentUserType={adminUserType}
                currentSupervisor={currentSupervisor}
                merchants={merchants}
                customers={customers}
                orders={orders}
                products={products}
                captains={captains}
                ads={ads}
                supervisors={supervisors}
                suggestions={suggestions}
                resetRequests={resetRequests}
                settings={settings}
                adminEmail={adminEmail}
                adminPass={adminPass}
                onUpdateMerchants={handleUpdateMerchants}
                onUpdateCustomers={handleUpdateCustomers}
                onUpdateOrders={handleUpdateOrders}
                onUpdateProducts={handleUpdateProducts}
                onUpdateCaptains={handleUpdateCaptains}
                onUpdateAds={handleUpdateAds}
                onUpdateSupervisors={handleUpdateSupervisors}
                onUpdateSettings={handleUpdateSettings}
                onUpdateSuggestions={handleUpdateSuggestions}
                onUpdateResetRequests={handleUpdateResetRequests}
                onChangeAdminCredentials={(newEmail, newPass) => {
                  setAdminEmail(newEmail);
                  setAdminPass(newPass);
                }}
                onLogout={() => {
                  setAdminUserType(null);
                  setCurrentSupervisor(undefined);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Modals for Customer Flow */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        shippingPerStore={settings.defaultShippingPerStore}
        hasDeliverySubscription={customerSubscription.isSubscribed}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        shippingPerStore={settings.defaultShippingPerStore}
        vodafoneNumber={settings.vodafoneCashNumber}
        instapayAddress={settings.instapayAddress}
        onOrderPlaced={handleOrderPlaced}
        initialCustomer={customers[0]}
        hasDeliverySubscription={customerSubscription.isSubscribed}
      />

      <CustomerOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onConfirmDelivery={handleConfirmCustomerDelivery}
        onRequestReturn={handleRequestReturn}
      />

      <PackagesModal
        isOpen={isPackagesOpen}
        onClose={() => setIsPackagesOpen(false)}
        packages={settings.monthlyPackages || []}
        isCurrentlySubscribed={customerSubscription.isSubscribed}
        activePlanName={customerSubscription.planName}
        onSubscribe={handleSubscribePackage}
        vodafoneNumber={settings.vodafoneCashNumber}
        instapayAddress={settings.instapayAddress}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        supportPhone={settings.supportPhone}
        supportWhatsapp={settings.supportWhatsapp}
        onSubmitSuggestion={handleAddSuggestion}
        customerName={customers[0]?.name}
        customerPhone={customers[0]?.phone}
      />

      {/* Mandatory Terms & Integrity Charter Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onAccept={() => setIsTermsOpen(false)}
        onClose={() => setIsTermsOpen(false)}
        isReadOnly={termsReadOnly}
      />

      {/* Global Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              ب
            </div>
            <div>
              <p className="font-black text-white text-sm">منصة بقالة ستور للتجارة والتسوق المحلي</p>
              <p className="text-[11px] text-slate-500">
                ميثاق الأمانة: «مَنْ غَشَّنَا فَلَيْسَ مِنَّا» • بضاعة سليمة 100% واسترجاع فوري مجاني
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button
              onClick={() => {
                setTermsReadOnly(true);
                setIsTermsOpen(true);
              }}
              className="hover:text-white cursor-pointer"
            >
              الشروط والأحكام وميثاق الأمانة
            </button>
            <span>•</span>
            <button onClick={() => setIsSupportOpen(true)} className="hover:text-white cursor-pointer">
              خدمة العملاء والشكاوى
            </button>
            <span>•</span>
            <span>فودافون كاش: {settings.vodafoneCashNumber}</span>
            <span>•</span>
            <span>إنستا باي: {settings.instapayAddress}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
