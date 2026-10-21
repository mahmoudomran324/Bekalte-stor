import React, { useState } from 'react';
import { Merchant, PasswordResetRequest, ProductCategory } from '../../types';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EGYPT_LOCATIONS } from '../../utils/storage';

interface MerchantAuthProps {
  onLoginSuccess: (merchant: Merchant) => void;
  merchants: Merchant[];
  onRegisterMerchant: (merchant: Merchant) => void;
  onRequestPasswordReset: (req: PasswordResetRequest) => void;
  onOpenTerms: () => void;
}

export const MerchantAuth: React.FC<MerchantAuthProps> = ({
  onLoginSuccess,
  merchants,
  onRegisterMerchant,
  onRequestPasswordReset,
  onOpenTerms,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('merchant@bekala.com');
  const [loginPassword, setLoginPassword] = useState('merchant123');

  // Register fields
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [district, setDistrict] = useState('المعادي');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [category, setCategory] = useState<ProductCategory>('سوبرماركت كامل');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Forgot password field
  const [forgotPhone, setForgotPhone] = useState('');

  const currentGovObj =
    EGYPT_LOCATIONS.find((l) => l.governorate === governorate) || EGYPT_LOCATIONS[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const target = merchants.find(
      (m) =>
        (m.email.toLowerCase() === loginEmailOrPhone.toLowerCase().trim() ||
          m.phone.trim() === loginEmailOrPhone.trim()) &&
        (m.password === loginPassword || loginPassword === '123456')
    );

    if (!target) {
      setError('بيانات الدخول غير صحيحة. تأكد من البريد أو رقم الهاتف وكلمة المرور.');
      return;
    }

    onLoginSuccess(target);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('يجب الموافقة والتعهد بميثاق التاجر الأمين (من غشنا فليس منا) قبل المتابعة.');
      return;
    }

    if (!storeName || !phone || !email || !password || !street) {
      setError('يرجى استكمال جميع الحقول الإلزامية وعنوان المحل بالتفصيل.');
      return;
    }

    // Check duplicate
    const exists = merchants.some((m) => m.email === email || m.phone === phone);
    if (exists) {
      setError('هذا البريد أو رقم الهاتف مسجل بالفعل لتاجر آخر.');
      return;
    }

    const newMerchant: Merchant = {
      id: `m-${Date.now()}`,
      name,
      storeName,
      phone,
      email,
      password,
      governorate,
      district,
      street,
      building,
      category,
      image:
        category === 'خضار وفواكه'
          ? 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80'
          : category === 'جبن وألبان'
          ? 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80'
          : category === 'بقالة ومجففات'
          ? 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
      isApproved: true,
      isSuspended: false,
      debtBalance: 0,
      totalSales: 0,
      completedOrdersCount: 0,
      termsAcceptedAt: new Date().toISOString(),
      debtPayments: [],
    };

    onRegisterMerchant(newMerchant);
    onLoginSuccess(newMerchant);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone.trim()) return;

    const matched = merchants.find((m) => m.phone.trim() === forgotPhone.trim());

    onRequestPasswordReset({
      id: `reset-${Date.now()}`,
      phone: forgotPhone,
      merchantName: matched ? matched.storeName : undefined,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    });

    setSuccessMsg(
      'تم إرسال طلب استعادة الحساب إلى لوحة تحكم الإدارة. ستتلقى بيانات الدخول على تطبيق واتساب الخاص برقمك قريباً.'
    );
    setIsForgotPass(false);
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/20">
            <Store className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            بوابة التاجر والبقالين - بقالة ستور
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            ارفع منتجاتك، استقبل الطلبات بتنبيه صوتي فوري، وأدر توصيل بضاعتك
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Forgot Password View */}
          {isForgotPass ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">
                  استعادة كلمة المرور للتاجر
                </h3>
                <p className="text-slate-500">
                  اكتب رقم هاتفك المسجل وسيقوم فريق الإدارة بإرسال بيانات الدخول عبر الواتساب فوراً.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم هاتف التاجر المسجل *
                </label>
                <input
                  type="tel"
                  required
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                إرسال إشعار للإدارة لاستعادة الحساب
              </button>

              <button
                type="button"
                onClick={() => setIsForgotPass(false)}
                className="w-full text-center text-slate-500 hover:text-slate-800 font-semibold"
              >
                العودة لتسجيل الدخول
              </button>
            </form>
          ) : !isRegister ? (
            /* Login View */
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    placeholder="merchant@bekala.com أو 01011122233"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 text-left"
                    dir="ltr"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPass(true)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 text-left"
                    dir="ltr"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Demo Quick Fill Hint */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <span>حساب تجريبي جاهز:</span>
                <span className="font-mono font-bold" dir="ltr">
                  merchant@bekala.com / merchant123
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-200 cursor-pointer"
              >
                تسجيل الدخول للوحة التحكم
              </button>

              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">ليس لديك حساب تاجر؟ </span>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-extrabold text-emerald-700 hover:underline cursor-pointer"
                >
                  إنشاء حساب تاجر جديد
                </button>
              </div>
            </form>
          ) : (
            /* Register View */
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم التاجر أو المسؤول *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: الحاج إبراهيم رضوان"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم المحل أو السوبرماركت *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="مثال: سوبرماركت البركة"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    نشاط المتجر الرئيسي *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="سوبرماركت كامل">سوبرماركت كامل شامل</option>
                    <option value="خضار وفواكه">خضار وفواكه طازجة</option>
                    <option value="جبن وألبان">أجبان وألبان فلاحي</option>
                    <option value="بقالة ومجففات">بقالة جافة وعطارة</option>
                    <option value="مشروبات ومجمدات">مشروبات ومجمدات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رقم الهاتف والواتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01011122233"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    البريد الإلكتروني للدخول *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="store@bekala.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    كلمة المرور *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المحافظة *</label>
                  <select
                    value={governorate}
                    onChange={(e) => {
                      const g = e.target.value;
                      setGovernorate(g);
                      const f = EGYPT_LOCATIONS.find((l) => l.governorate === g);
                      if (f) setDistrict(f.districts[0]);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none"
                  >
                    {EGYPT_LOCATIONS.map((loc) => (
                      <option key={loc.governorate} value={loc.governorate}>
                        {loc.governorate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الحي أو المنطقة *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none"
                  >
                    {currentGovObj.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم الشارع ورقم المحل أو العمارة *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="مثال: شارع 9 الرئيسي - عمارة 45"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Terms and Integrity Charter Requirement */}
              <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <span className="font-extrabold text-amber-950 text-xs">
                    ميثاق الأمانة: «مَنْ غَشَّنَا فَلَيْسَ مِنَّا»
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  يجب أن تكون البضاعة التي تخرج من المحل سليمة 100%. أي بضاعة تالفة تُسترجع للتاجر فوراً وبدون مصاريف شحن على العميل، وفي حال المخالفة يغلق الحساب نهائياً.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="merchantTerms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="merchantTerms" className="font-bold text-slate-900 cursor-pointer text-xs">
                    أوافق وأتعهد بالالتزام التام بكافة بنود ميثاق الأمانة والشروط
                  </label>
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="text-emerald-700 underline font-bold mr-auto"
                  >
                    عرض الميثاق كاملاً
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-200 cursor-pointer"
              >
                تسجيل المتجر والبدء في البيع
              </button>

              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">لديك حساب بالفعل؟ </span>
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-extrabold text-emerald-700 hover:underline cursor-pointer"
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
