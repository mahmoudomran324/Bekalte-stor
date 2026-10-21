import React, { useState, useEffect } from 'react';
import {
  AdminSettings,
  Captain,
  DebtPayment,
  Merchant,
  Order,
  Product,
  ProductCategory,
  ProductUnit,
  ReturnRequest,
} from '../../types';
import { orderAudio } from '../../utils/audioAlert';
import {
  Store,
  Bell,
  BellOff,
  Package,
  Plus,
  Truck,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Volume2,
  Phone,
  MessageCircle,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  ShieldAlert,
  LogOut,
  MapPin,
  Clock,
} from 'lucide-react';

interface MerchantDashboardProps {
  merchant: Merchant;
  orders: Order[];
  products: Product[];
  captains: Captain[];
  settings: AdminSettings;
  onUpdateMerchant: (updated: Merchant) => void;
  onUpdateOrder: (updated: Order) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onLogout: () => void;
  onOpenTerms: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  merchant,
  orders,
  products,
  captains,
  settings,
  onUpdateMerchant,
  onUpdateOrder,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogout,
  onOpenTerms,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'financials' | 'returns'>('orders');

  // Filter orders related to this merchant
  const merchantOrders = orders.filter((o) => o.merchants.includes(merchant.id));
  const pendingOrders = merchantOrders.filter((o) => o.status === 'pending');
  const merchantProducts = products.filter((p) => p.merchantId === merchant.id);

  // Audio alert trigger when pending orders exist
  useEffect(() => {
    if (pendingOrders.length > 0) {
      orderAudio.startAlarm();
    } else {
      orderAudio.stopAlarm();
    }

    return () => {
      orderAudio.stopAlarm();
    };
  }, [pendingOrders.length]);

  // Modal for assigning captain
  const [assignCaptainOrder, setAssignCaptainOrder] = useState<Order | null>(null);
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [selectedCaptainId, setSelectedCaptainId] = useState<string>('');

  // Modal for adding/editing product
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>(merchant.category);
  const [newProdPrice, setNewProdPrice] = useState<number>(30);
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState<string>('');
  const [newProdUnit, setNewProdUnit] = useState<ProductUnit>('كيلو');
  const [newProdImage, setNewProdImage] = useState<string>('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Modal for paying debt
  const [isPayDebtOpen, setIsPayDebtOpen] = useState(false);
  const [debtPayMethod, setDebtPayMethod] = useState<'vodafone_cash' | 'instapay'>('vodafone_cash');
  const [debtPayAmount, setDebtPayAmount] = useState<number>(merchant.debtBalance || 50);
  const [debtPayRef, setDebtPayRef] = useState('');
  const [debtPayReceiptImage, setDebtPayReceiptImage] = useState<string>('');
  const [debtSuccessMsg, setDebtSuccessMsg] = useState('');

  // Handler for image upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProdImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setDebtPayReceiptImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset sample food photos
  const SAMPLE_IMAGES = [
    { label: 'أرز فاخر', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80' },
    { label: 'زيت ذرة', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80' },
    { label: 'طماطم طازة', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
    { label: 'خيار بلدي', url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=80' },
    { label: 'جبنة براميلي', url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80' },
    { label: 'حليب كامل الدسم', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80' },
    { label: 'شاي أسود', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80' },
    { label: 'مكرونة الملكة', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80' },
  ];

  // Actions on orders
  const handleStartPreparing = (order: Order) => {
    // 1. Immediately stop audio alarm!
    orderAudio.stopAlarm();

    const updatedOrder: Order = {
      ...order,
      status: 'preparing',
      preparingAt: new Date().toISOString(),
    };
    onUpdateOrder(updatedOrder);
  };

  const handleOpenDispatchModal = (order: Order) => {
    setAssignCaptainOrder(order);
    // Suggest first captain if available in same district
    const matched = captains.find(
      (c) => c.governorate === merchant.governorate && c.district === merchant.district
    ) || captains[0];
    if (matched) {
      setSelectedCaptainId(matched.id);
      setCaptainName(matched.name);
      setCaptainPhone(matched.phone);
    } else {
      setCaptainName('كابتن محمد سعيد');
      setCaptainPhone('01012345678');
    }
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCaptainOrder || !captainName.trim() || !captainPhone.trim()) return;

    const updatedOrder: Order = {
      ...assignCaptainOrder,
      status: 'delivering',
      dispatchedAt: new Date().toISOString(),
      captain: {
        name: captainName.trim(),
        phone: captainPhone.trim(),
        whatsappUrl: `https://wa.me/2${captainPhone.trim().replace(/^0/, '')}`,
        assignedAt: new Date().toISOString(),
      },
    };

    onUpdateOrder(updatedOrder);
    setAssignCaptainOrder(null);
  };

  const handleCompleteOrder = (order: Order) => {
    const updatedOrder: Order = {
      ...order,
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
      merchantConfirmedDelivery: true,
    };
    onUpdateOrder(updatedOrder);
  };

  // Add Product Submit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const img =
      newProdImage ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';

    const prod: Product = {
      id: `p-${Date.now()}`,
      merchantId: merchant.id,
      merchantName: merchant.storeName,
      name: newProdName.trim(),
      category: newProdCategory,
      price: Number(newProdPrice),
      discountPrice: newProdDiscountPrice ? Number(newProdDiscountPrice) : undefined,
      unit: newProdUnit,
      image: img,
      description: newProdDesc.trim() || 'منتج طازج ومختار بعناية وفق أعلى معايير الجودة',
      isAvailable: true,
      governorate: merchant.governorate,
      district: merchant.district,
    };

    onAddProduct(prod);
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdDiscountPrice('');
  };

  // Submit debt payment with image upload proof
  const handleDebtPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtPayAmount || (!debtPayReceiptImage && !debtPayRef.trim())) return;

    const newPayment: DebtPayment = {
      id: `pay-${Date.now()}`,
      merchantId: merchant.id,
      merchantName: merchant.storeName,
      amount: Number(debtPayAmount),
      method: debtPayMethod,
      receiptImage: debtPayReceiptImage || undefined,
      refNumber: debtPayRef.trim() || 'إشعار تحويل مرفق بالصورة',
      date: new Date().toISOString(),
      status: 'pending' as const,
    };

    const updatedMerchant: Merchant = {
      ...merchant,
      debtPayments: [newPayment, ...(merchant.debtPayments || [])],
    };

    onUpdateMerchant(updatedMerchant);
    setDebtSuccessMsg('تم إرسال إشعار السداد بنجاح إلى الإدارة للمراجعة والاعتماد الفوري.');
    setTimeout(() => {
      setIsPayDebtOpen(false);
      setDebtSuccessMsg('');
      setDebtPayRef('');
    }, 2000);
  };

  // Check suspension status
  const isSuspendedForDebt = merchant.debtBalance >= settings.maxDebtLimit;
  const isSuspended = merchant.isSuspended || isSuspendedForDebt;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <img
            src={merchant.image}
            alt={merchant.storeName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{merchant.storeName}</h2>
              {isSuspended ? (
                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  متجر موقوف مؤقتاً
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  متجر نشط ومعتمد
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {merchant.governorate} • {merchant.district} • {merchant.street}
              </span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => orderAudio.playPreview()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="تجربة صوت المنبه"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>تجربة المنبه</span>
          </button>

          <button
            onClick={onOpenTerms}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>ميثاق الأمانة</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTINUOUS SOUND ALARM BANNER (When pending orders exist) */}
      {pendingOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white shadow-xl animate-pulse flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center font-black animate-bounce shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-base md:text-lg">
                🚨 تنبيه صوتي مستمر: لديك ({pendingOrders.length}) طلبات جديدة بانتظار التأكيد!
              </h4>
              <p className="text-xs text-amber-100">
                الصوت سيستمر بالرنين حتى تضغط على زر "جاري التجهيز" للطلب.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartPreparing(pendingOrders[0])}
              className="px-5 py-2.5 bg-white text-slate-900 font-extrabold rounded-xl text-xs md:text-sm hover:bg-amber-100 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>تأكيد والبدء: جاري التجهيز (إيقاف الصوت)</span>
            </button>
            <button
              onClick={() => orderAudio.stopAlarm()}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white cursor-pointer"
              title="إيقاف الصوت مؤقتاً"
            >
              <BellOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Account Suspended Notice */}
      {isSuspended && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <h4 className="font-black text-sm md:text-base text-rose-900">
              تنبيه تجميد المتجر: منتجاتك لا تظهر للعملاء حالياً
            </h4>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed font-medium">
            السبب:{' '}
            {merchant.suspensionReason ||
              `تجاوزت المديونية المستحقة للتطبيق الحد المسموح به (${merchant.debtBalance} ج.م / الحد الأقصى ${settings.maxDebtLimit} ج.م). يتم رفع التجميد فور سداد المديونية.`}
          </p>
          <button
            onClick={() => setIsPayDebtOpen(true)}
            className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition-colors cursor-pointer"
          >
            سداد المديونية الآن عبر فودافون كاش أو إنستا باي
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>إدارة الطلبات</span>
          {pendingOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>منتجات المتجر ({merchantProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'financials'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>الماليات والمديونية</span>
          {merchant.debtBalance > 0 && (
            <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {merchant.debtBalance} ج.م
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'returns'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>المرتجعات والميثاق</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">
              طلبات المتجر ({merchantOrders.length})
            </h3>
            <span className="text-xs text-slate-500">
              خطوات الطلب: تنبيه صوتي 🔔 ➔ جاري التجهيز ➔ جاري الإرسال وتعيين المندوب ➔ تم التسليم
            </span>
          </div>

          {merchantOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700 text-sm">لا توجد طلبات جديدة حتى الآن</h4>
              <p className="text-xs text-slate-400 mt-1">
                بمجرد قيام أي عميل في منطقتك بالطلب سيصلك إشعار صوتي فوري ومستمر.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {merchantOrders.map((order) => {
                const mySummary = order.merchantsSummary.find((s) => s.id === merchant.id);
                const myItems = order.items.filter((i) => i.merchantId === merchant.id);

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl p-4 border transition-all ${
                      order.status === 'pending'
                        ? 'border-amber-400 ring-2 ring-amber-300 shadow-md'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          العميل: {order.customerName} ({order.customerPhone})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                          <span className="bg-amber-100 text-amber-800 font-black text-xs px-2.5 py-1 rounded-full animate-pulse">
                            طلب جديد (صوت المنبه شغال)
                          </span>
                        )}
                        {order.status === 'preparing' && (
                          <span className="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-1 rounded-full">
                            جاري التجهيز بالمحل
                          </span>
                        )}
                        {order.status === 'delivering' && (
                          <span className="bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-1 rounded-full">
                            مع المندوب في الطريق
                          </span>
                        )}
                        {order.status === 'delivered' && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full">
                            تم التسليم بنجاح
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order details and items */}
                    <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block mb-1">
                          الأصناف المطلوبة من محلك ({myItems.length}):
                        </span>
                        <div className="space-y-1">
                          {myItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-7 h-7 rounded object-cover"
                                />
                                <span className="font-semibold text-slate-900">
                                  {item.name} × {item.quantity} ({item.unit})
                                </span>
                              </div>
                              <span className="font-bold text-slate-900">
                                {item.price * item.quantity} ج.م
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 block">
                          عنوان التوصيل المسجل من العميل:
                        </span>
                        <p className="text-slate-600 text-[11px]">
                          {order.address.governorate}، {order.address.district}، {order.address.street}، {order.address.building}، الدور {order.address.floor}، شقة {order.address.apartment}
                        </p>
                        {order.address.notes && (
                          <p className="text-amber-800 text-[10px]">
                            ملاحظة العميل: {order.address.notes}
                          </p>
                        )}

                        <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                          <span>قيمة الأصناف: {mySummary?.subtotal} ج.م</span>
                          <span>التوصيل: {mySummary?.shipping} ج.م</span>
                        </div>
                      </div>
                    </div>

                    {/* Captain assigned info if available */}
                    {order.captain && (
                      <div className="bg-teal-50 p-2.5 rounded-xl border border-teal-200 mb-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-teal-700" />
                          <span className="font-bold text-teal-900">
                            المندوب: {order.captain.name} ({order.captain.phone})
                          </span>
                        </div>
                        <a
                          href={`https://wa.me/2${order.captain.phone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>تواصل عبر واتساب</span>
                        </a>
                      </div>
                    )}

                    {/* Merchant Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStartPreparing(order)}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-200"
                        >
                          <Check className="w-4 h-4" />
                          <span>جاري التجهيز (إيقاف الصوت)</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleOpenDispatchModal(order)}
                          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-200"
                        >
                          <Truck className="w-4 h-4" />
                          <span>جاري الإرسال (تحديد المندوب)</span>
                        </button>
                      )}

                      {order.status === 'delivering' && (
                        <button
                          onClick={() => handleCompleteOrder(order)}
                          className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم تسليم الأوردر للعميل</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base">
                منتجات المتجر المعروضة للزبائن ({merchantProducts.length})
              </h3>
              <p className="text-xs text-slate-500">
                يمكنك رفع صورة المنتج مباشرة من جهازك أو اختيارها وتحديد السعر والوحدة.
              </p>
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صنف جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {merchantProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between shadow-xs overflow-hidden"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 right-1.5">
                    <button
                      onClick={() =>
                        onUpdateProduct({ ...prod, isAvailable: !prod.isAvailable })
                      }
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs cursor-pointer ${
                        prod.isAvailable
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {prod.isAvailable ? 'متاح للطلب' : 'نفذت الكمية'}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{prod.description}</p>

                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="font-black text-sm text-emerald-700">
                      {prod.price} ج.م
                    </span>
                    <span className="text-[10px] text-slate-400">لكل {prod.unit}</span>
                  </div>
                </div>

                <div className="pt-2 mt-2 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => onDeleteProduct(prod.id)}
                    className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    حذف الصنف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Financials & Indebtedness */}
      {activeTab === 'financials' && (
        <div className="space-y-5">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">إجمالي المبيعات المكتملة</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {merchant.totalSales || 0} ج.م
              </h3>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                {merchant.completedOrdersCount || 0} طلبات مسلمة
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">المديونية الحالية للتطبيق</span>
              <h3 className="text-2xl font-black text-rose-700 mt-1">
                {merchant.debtBalance || 0} ج.م
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                تُخصم نسبة {settings.commissionRate}% من رسوم التوصيل فقط
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">الحد الأقصى للمديونية قبل الإيقاف</span>
              <h3 className="text-2xl font-black text-amber-700 mt-1">
                {settings.maxDebtLimit} ج.م
              </h3>
              <button
                onClick={() => setIsPayDebtOpen(true)}
                className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                سداد المديونية الآن
              </button>
            </div>
          </div>

          {/* Debt Settlement History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900">
              سجل سداد المديونية والتحويلات
            </h4>

            {(!merchant.debtPayments || merchant.debtPayments.length === 0) ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                لا توجد عمليات سداد سابقة مسجلة.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {merchant.debtPayments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        سداد مبلغ {p.amount} ج.م عبر {p.method === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        رقم العملية: {p.refNumber} • التاريخ: {new Date(p.date).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        p.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.status === 'approved'
                        ? 'معتمد وخصم من المديونية'
                        : p.status === 'pending'
                        ? 'قيد مراجعة الإدارة'
                        : 'مرفوض'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Damaged Returns & Pledge */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2 text-xs text-amber-950">
            <h4 className="font-black text-sm text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>ميثاق الأمانة والالتزام الصارم بالبضاعة السليمة 100%</span>
            </h4>
            <p className="leading-relaxed">
              تطبيقاً لحديث النبي ﷺ <strong>«مَنْ غَشَّنَا فَلَيْسَ مِنَّا»</strong>، في حال وصول أي بضاعة تالفة للعميل، يتحمل التاجر استرجاعها فوراً بدون أي مصاريف شحن على العميل، وتكرار ذلك يعرض الحساب للإغلاق النهائي.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900">
              طلبات الاسترجاع من العملاء
            </h4>

            {orders.filter((o) => o.merchants.includes(merchant.id) && o.returnRequest).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                ممتاز! لا توجد أي شكاوى استرجاع بضاعة تالفة مسجلة على متجرك.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {orders
                  .filter((o) => o.merchants.includes(merchant.id) && o.returnRequest)
                  .map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-900">
                        <span>طلب استرجاع بطلب رقم {o.orderNumber}</span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border">
                          حالة: {o.returnRequest?.status === 'approved' ? 'مقبول' : 'قيد المراجعة'}
                        </span>
                      </div>
                      <p className="text-slate-700 text-[11px]">
                        <strong>السبب:</strong> {o.returnRequest?.reason}
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        <strong>الوصف:</strong> {o.returnRequest?.itemsDescription}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL: Assign Captain on Dispatch (جاري الإرسال) */}
      {assignCaptainOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-purple-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-purple-900">
                <Truck className="w-5 h-5 text-purple-600" />
                <h4 className="font-black text-sm">
                  تعيين مندوب التوصيل وإرسال الأوردر #{assignCaptainOrder.orderNumber}
                </h4>
              </div>
              <button
                onClick={() => setAssignCaptainOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-500 text-[11px]">
              اكتب اسم المندوب ورقم هاتفه. سيتم إرسال بيانات المندوب فوراً إلى صفحة العميل مع زر تواصل مباشر عبر واتساب.
            </p>

            <form onSubmit={handleConfirmDispatch} className="space-y-3">
              {/* Quick Select from Captains */}
              {captains.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اختيار مندوب مسجل في النظام:
                  </label>
                  <select
                    value={selectedCaptainId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedCaptainId(id);
                      const c = captains.find((item) => item.id === id);
                      if (c) {
                        setCaptainName(c.name);
                        setCaptainPhone(c.phone);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none"
                  >
                    {captains.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) - {c.governorate} {c.district}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم المندوب / الكابتن *
                </label>
                <input
                  type="text"
                  required
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  placeholder="مثال: كابتن أحمد محمود"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم هاتف المندوب للواتساب والاتصال *
                </label>
                <input
                  type="tel"
                  required
                  value={captainPhone}
                  onChange={(e) => setCaptainPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:bg-white text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  تأكيد الإرسال وإشعار العميل فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setAssignCaptainOrder(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add Product with Image Upload */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-sm text-slate-900">
                  إضافة صنف جديد لمتجر {merchant.storeName}
                </h4>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الصنف أو السلعة *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="مثال: أرز مصري فاخر أو طماطم بلدي"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم / التصنيف *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none"
                  >
                    <option value="خضار وفواكه">خضار وفواكه</option>
                    <option value="بقالة ومجففات">بقالة ومجففات</option>
                    <option value="جبن وألبان">جبن وألبان</option>
                    <option value="سوبرماركت كامل">سوبرماركت كامل</option>
                    <option value="مشروبات ومجمدات">مشروبات ومجمدات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">وحدة البيع *</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value as ProductUnit)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none"
                  >
                    <option value="كيلو">كيلو (كجم)</option>
                    <option value="قطعة">قطعة</option>
                    <option value="علبة">علبة</option>
                    <option value="كرتونة">كرتونة</option>
                    <option value="ربطة">ربطة</option>
                    <option value="لتر">لتر</option>
                    <option value="جرام">جرام</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر الأصلي (ج.م) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    placeholder="35"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-rose-700 mb-1">
                    سعر العرض / الخصم (ج.م) - اختياري
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newProdDiscountPrice}
                    onChange={(e) => setNewProdDiscountPrice(e.target.value)}
                    placeholder="مثال: 29 (يظهر كعرض خاص)"
                    className="w-full bg-slate-50 border border-rose-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload Requirement */}
              <div className="space-y-2 border p-3 rounded-2xl bg-slate-50">
                <label className="block font-bold text-slate-700">
                  صورة المنتج (رفع صورة عادية من جهازك أو اختيار نموذج جاهز) *
                </label>
                
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-emerald-300 rounded-xl bg-white hover:bg-emerald-50 cursor-pointer transition-colors text-emerald-800 font-bold">
                    <Upload className="w-4 h-4" />
                    <span>اختر صورة من الكمبيوتر أو الهاتف</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {newProdImage && (
                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border">
                    <img
                      src={newProdImage}
                      alt="Preview"
                      className="w-12 h-12 rounded object-cover border"
                    />
                    <span className="text-emerald-700 font-bold">تم اختيار الصورة بنجاح</span>
                  </div>
                )}

                {/* Sample shortcuts */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    أو اختر صورة جاهزة بنقرة واحدة:
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {SAMPLE_IMAGES.map((sample, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setNewProdImage(sample.url)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border text-[10px] font-semibold whitespace-nowrap cursor-pointer"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  وصف مختصر للصنف ومميزاته
                </label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="مثال: منقى وخالي من الشوائب ومضمون 100%"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer shadow-md shadow-emerald-200"
                >
                  حفظ ونشر الصنف بالمتجر
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Settle Indebtedness via Vodafone Cash or InstaPay */}
      {isPayDebtOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-emerald-800">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-sm">سداد مديونية المتجر للتطبيق</h4>
              </div>
              <button
                onClick={() => setIsPayDebtOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {debtSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">{debtSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleDebtPaySubmit} className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">المديونية الحالية:</span>
                  <span className="font-black text-base text-rose-700">
                    {merchant.debtBalance} ج.م
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">طريقة التحويل:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDebtPayMethod('vodafone_cash')}
                      className={`py-2 rounded-xl font-bold transition-colors ${
                        debtPayMethod === 'vodafone_cash'
                          ? 'bg-rose-100 text-rose-900 border-2 border-rose-400'
                          : 'bg-slate-100 text-slate-700 border'
                      }`}
                    >
                      فودافون كاش
                    </button>
                    <button
                      type="button"
                      onClick={() => setDebtPayMethod('instapay')}
                      className={`py-2 rounded-xl font-bold transition-colors ${
                        debtPayMethod === 'instapay'
                          ? 'bg-purple-100 text-purple-900 border-2 border-purple-400'
                          : 'bg-slate-100 text-slate-700 border'
                      }`}
                    >
                      إنستا باي
                    </button>
                  </div>
                </div>

                {debtPayMethod === 'vodafone_cash' ? (
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900">
                    رقم محفظة الإدارة المعتمد:{' '}
                    <strong className="text-sm font-mono" dir="ltr">
                      {settings.vodafoneCashNumber}
                    </strong>
                  </div>
                ) : (
                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900">
                    عنوان حساب إنستا باي (IPA):{' '}
                    <strong className="text-sm font-mono" dir="ltr">
                      {settings.instapayAddress}
                    </strong>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المبلغ المحول (ج.م) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={debtPayAmount}
                    onChange={(e) => setDebtPayAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white"
                  />
                </div>

                {/* Receipt Image Screenshot Upload (Requested Feature) */}
                <div className="space-y-1.5 p-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50">
                  <label className="block font-bold text-emerald-950">
                    رفع صورة إشعار / سكرين شوت إثبات التحويل *
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 bg-white border border-emerald-300 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors text-emerald-800 font-bold">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>اختر صورة إشعار التحويل من الجهاز</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptFileChange}
                      className="hidden"
                    />
                  </label>
                  {debtPayReceiptImage && (
                    <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-emerald-200 mt-2">
                      <img
                        src={debtPayReceiptImage}
                        alt="إثبات التحويل"
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                      <span className="text-emerald-700 font-bold text-xs">
                        تم إرفاق صورة إثبات التحويل بنجاح ✓
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ملاحظات أو رقم العملية / المحفظة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={debtPayRef}
                    onChange={(e) => setDebtPayRef(e.target.value)}
                    placeholder="مثال: تم التحويل بنجاح"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white text-left"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    تأكيد إرسال إشعار السداد
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPayDebtOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
