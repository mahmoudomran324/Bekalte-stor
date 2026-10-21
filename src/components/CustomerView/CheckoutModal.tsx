import React, { useState } from 'react';
import { CartItem, Customer, Order, OrderItem, PaymentMethod } from '../../types';
import {
  X,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Building,
  Home,
  User,
  Phone,
  Mail,
  Lock,
} from 'lucide-react';
import { EGYPT_LOCATIONS } from '../../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  shippingPerStore: number;
  vodafoneNumber: string;
  instapayAddress: string;
  onOrderPlaced: (newOrder: Order) => void;
  initialCustomer?: Customer | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  shippingPerStore,
  vodafoneNumber,
  instapayAddress,
  onOrderPlaced,
  initialCustomer,
}) => {
  // Form fields
  const [name, setName] = useState(initialCustomer?.name || 'أحمد سعيد عبد الفتاح');
  const [phone, setPhone] = useState(initialCustomer?.phone || '01099887711');
  const [email, setEmail] = useState(initialCustomer?.email || 'customer@bekala.com');
  const [password, setPassword] = useState('123456');

  // Address
  const [governorate, setGovernorate] = useState(initialCustomer?.governorate || 'القاهرة');
  const [district, setDistrict] = useState(initialCustomer?.district || 'المعادي');
  const [street, setStreet] = useState(initialCustomer?.street || 'شارع 9 الرئيسي متفرع من دجلة');
  const [building, setBuilding] = useState(initialCustomer?.building || 'برج الياسمين رقم 14');
  const [floor, setFloor] = useState(initialCustomer?.floor || 'الدور الرابع');
  const [apartment, setApartment] = useState(initialCustomer?.apartment || 'شقة 402');
  const [notes, setNotes] = useState(initialCustomer?.notes || 'يرجى الاتصال قبل الصعود');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Group items by merchant
  const merchantGroups = items.reduce<{
    [merchantId: string]: {
      merchantName: string;
      items: CartItem[];
      subtotal: number;
    };
  }>((acc, item) => {
    const mId = item.product.merchantId;
    if (!acc[mId]) {
      acc[mId] = {
        merchantName: item.product.merchantName,
        items: [],
        subtotal: 0,
      };
    }
    acc[mId].items.push(item);
    acc[mId].subtotal += item.product.price * item.quantity;
    return acc;
  }, {});

  const merchantIds = Object.keys(merchantGroups);
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalShipping = merchantIds.length * shippingPerStore;
  const grandTotal = itemsSubtotal + totalShipping;

  const currentGovObj =
    EGYPT_LOCATIONS.find((l) => l.governorate === governorate) || EGYPT_LOCATIONS[0];

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !phone.trim() || !street.trim() || !building.trim() || !apartment.trim()) {
      setErrorMessage('يرجى ملء كافة تفاصيل العنوان الأساسية (الاسم، الهاتف، الشارع، العمارة، الشقة)');
      return;
    }

    if ((paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') && !paymentRefNumber.trim()) {
      setErrorMessage('يرجى كتابة رقم العملية أو رقم المحفظة المحول منها لتأكيد الدفع الإلكتروني');
      return;
    }

    setIsSubmitting(true);

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      unit: item.product.unit,
      quantity: item.quantity,
      image: item.product.image,
      merchantId: item.product.merchantId,
      merchantName: item.product.merchantName,
    }));

    const merchantsSummary = Object.entries(merchantGroups).map(([id, grp]) => ({
      id,
      name: grp.merchantName,
      itemsCount: grp.items.reduce((s, i) => s + i.quantity, 0),
      subtotal: grp.subtotal,
      shipping: shippingPerStore,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: initialCustomer?.id || `cust-${Date.now()}`,
      customerName: name,
      customerPhone: phone,
      address: {
        governorate,
        district,
        street,
        building,
        floor,
        apartment,
        notes,
      },
      items: orderItems,
      merchants: merchantIds,
      merchantsSummary,
      itemsSubtotal,
      totalShipping,
      grandTotal,
      platformCommission: totalShipping * 0.1, // 10% from shipping
      paymentMethod,
      paymentRefNumber: paymentRefNumber.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onOrderPlaced(newOrder);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black">إتمام وتأكيد الطلب</h3>
            <p className="text-emerald-100 text-xs mt-0.5">
              بيانات التوصيل الدقيقة وطرق الدفع وميثاق الأمانة
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Personal Details */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b pb-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>بيانات العميل الشخصية</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم ثلاثي أو ثنائي *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="مثال: أحمد محمود سعيد"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف للتواصل وتتبع المندوب *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="01012345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none text-left"
                    dir="ltr"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني (اختياري)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none text-left"
                    dir="ltr"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور للحساب
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none text-left"
                    dir="ltr"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Address Breakdown */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b pb-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>عنوان التوصيل التفصيلي (البيت والمحافظة والحي والشارع والعمارة)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المحافظة *
                </label>
                <select
                  value={governorate}
                  onChange={(e) => {
                    const g = e.target.value;
                    setGovernorate(g);
                    const found = EGYPT_LOCATIONS.find((l) => l.governorate === g);
                    if (found) setDistrict(found.districts[0]);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {EGYPT_LOCATIONS.map((loc) => (
                    <option key={loc.governorate} value={loc.governorate}>
                      {loc.governorate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الحي أو المنطقة *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {currentGovObj.districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم الشارع ومعلم مميز *
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  placeholder="مثال: شارع 9 الرئيسي - بجوار صيدلية العزبي"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم أو رقم العمارة *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    required
                    placeholder="مثال: عمارة رقم 14 أو برج النور"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الدور *</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    required
                    placeholder="الدور 3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الشقة / الصغيرة *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      required
                      placeholder="شقة 12"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                    <Home className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظات إضافية للتوصيل والمندوب (اختياري)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: يرجى رن الجرس أو ترك الطلب عند الباب"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b pb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>طريقة الدفع (فودافون كاش أو إنستا باي أو كاش)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Vodafone Cash */}
              <label
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  paymentMethod === 'vodafone_cash'
                    ? 'border-rose-600 bg-rose-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-xs">
                    VF
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'vodafone_cash'}
                    onChange={() => setPaymentMethod('vodafone_cash')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">فودافون كاش</h5>
                  <p className="text-[10px] text-slate-500">تحويل إلكتروني فوري</p>
                </div>
              </label>

              {/* InstaPay */}
              <label
                onClick={() => setPaymentMethod('instapay')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  paymentMethod === 'instapay'
                    ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs">
                    IP
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'instapay'}
                    onChange={() => setPaymentMethod('instapay')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">إنستا باي (InstaPay)</h5>
                  <p className="text-[10px] text-slate-500">تحويل بنكي لحظي</p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">كاش عند الاستلام</h5>
                  <p className="text-[10px] text-slate-500">الدفع نقداً للمندوب</p>
                </div>
              </label>
            </div>

            {/* Electronic payment instructions */}
            {paymentMethod === 'vodafone_cash' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">رقم محفظة فودافون كاش المعتمد:</span>
                  <span className="font-black text-sm text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200" dir="ltr">
                    {vodafoneNumber}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  يرجى تحويل مبلغ <strong>{grandTotal} ج.م</strong> على الرقم أعلاه، ثم كتابة رقم المحفظة أو رقم العملية لتأكيد استلام الطلب.
                </p>
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1">
                    رقم المحفظة المحول منها أو رقم العملية *
                  </label>
                  <input
                    type="text"
                    value={paymentRefNumber}
                    onChange={(e) => setPaymentRefNumber(e.target.value)}
                    required
                    placeholder="مثال: 010xxxxxxxx أو رقم الحوالة"
                    className="w-full bg-white border border-rose-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'instapay' && (
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">عنوان الدفع إنستا باي (IPA):</span>
                  <span className="font-black text-sm text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200" dir="ltr">
                    {instapayAddress}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  يرجى تحويل مبلغ <strong>{grandTotal} ج.م</strong> عبر تطبيق InstaPay، وكتابة اسم المحول أو رقم العملية.
                </p>
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1">
                    اسم صاحب الحساب أو رقم المرجع بالتحويل *
                  </label>
                  <input
                    type="text"
                    value={paymentRefNumber}
                    onChange={(e) => setPaymentRefNumber(e.target.value)}
                    required
                    placeholder="اسم المحول أو الرقم المرجعي"
                    className="w-full bg-white border border-purple-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Integrity Guarantee & Summary */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-900">
                ضمان بقالة ستور الذهبي (من غشنا فليس منا)
              </span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                تعهد التاجر ملزم قانونياً وأخلاقياً بسلامة البضاعة 100%. في حال وجود أي منتج تالف، الاسترجاع فوري ومجاني بدون أي مصاريف شحن.
              </p>
            </div>
          </div>

          {/* Final Totals Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>إجمالي قيمة المنتجات ({items.length} أصناف):</span>
              <span className="font-bold text-slate-900">{itemsSubtotal} ج.م</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>رسوم التوصيل ({merchantIds.length} متاجر):</span>
              <span className="font-bold text-slate-900">{totalShipping} ج.م</span>
            </div>
            <div className="flex justify-between text-sm md:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>المبلغ الإجمالي المستحق:</span>
              <span className="text-emerald-700">{grandTotal} ج.م</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>تأكيد الطلب وإرساله للتاجر فوراً</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
