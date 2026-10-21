import React, { useState } from 'react';
import {
  AdminSettings,
  Captain,
  Customer,
  Merchant,
  Order,
  PasswordResetRequest,
  Product,
  ProductCategory,
  SponsoredAd,
  Suggestion,
  Supervisor,
} from '../../types';
import {
  Shield,
  Users,
  Store,
  Package,
  DollarSign,
  Truck,
  Sparkles,
  UserCheck,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MessageCircle,
  Phone,
  Search,
  Upload,
  KeyRound,
  Edit,
  Power,
  X,
  Mail,
  Lock,
} from 'lucide-react';
import { EGYPT_LOCATIONS } from '../../utils/storage';

interface AdminDashboardProps {
  currentUserType: 'admin' | 'supervisor';
  currentSupervisor?: Supervisor;
  merchants: Merchant[];
  customers: Customer[];
  orders: Order[];
  products: Product[];
  captains: Captain[];
  ads: SponsoredAd[];
  supervisors: Supervisor[];
  suggestions: Suggestion[];
  resetRequests: PasswordResetRequest[];
  settings: AdminSettings;
  adminEmail: string;
  adminPass: string;
  onUpdateMerchants: (merchants: Merchant[]) => void;
  onUpdateCustomers: (customers: Customer[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCaptains: (captains: Captain[]) => void;
  onUpdateAds: (ads: SponsoredAd[]) => void;
  onUpdateSupervisors: (supervisors: Supervisor[]) => void;
  onUpdateSettings: (settings: AdminSettings) => void;
  onUpdateSuggestions: (suggestions: Suggestion[]) => void;
  onUpdateResetRequests: (requests: PasswordResetRequest[]) => void;
  onChangeAdminCredentials: (newEmail: string, newPass: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUserType,
  currentSupervisor,
  merchants,
  customers,
  orders,
  products,
  captains,
  ads,
  supervisors,
  suggestions,
  resetRequests,
  settings,
  adminEmail,
  adminPass,
  onUpdateMerchants,
  onUpdateCustomers,
  onUpdateOrders,
  onUpdateProducts,
  onUpdateCaptains,
  onUpdateAds,
  onUpdateSupervisors,
  onUpdateSettings,
  onUpdateSuggestions,
  onUpdateResetRequests,
  onChangeAdminCredentials,
  onLogout,
}) => {
  const isAdmin = currentUserType === 'admin';
  const perms = currentSupervisor?.permissions || {
    canManageMerchants: true,
    canManageOrders: true,
    canManageFinancials: true,
    canManageAds: true,
    canManageSupport: true,
  };

  const [activeTab, setActiveTab] = useState<
    'merchants' | 'customers' | 'orders' | 'products' | 'financials' | 'captains' | 'ads' | 'supervisors' | 'support' | 'admin_profile'
  >('merchants');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddMerchantOpen, setIsAddMerchantOpen] = useState(false);
  const [isAddCaptainOpen, setIsAddCaptainOpen] = useState(false);
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);
  const [isAddSupervisorOpen, setIsAddSupervisorOpen] = useState(false);

  // New Merchant State
  const [newMStoreName, setNewMStoreName] = useState('');
  const [newMOwnerName, setNewMOwnerName] = useState('');
  const [newMPhone, setNewMPhone] = useState('');
  const [newMEmail, setNewMEmail] = useState('');
  const [newMPassword, setNewMPassword] = useState('123456');
  const [newMCategory, setNewMCategory] = useState<ProductCategory>('سوبرماركت كامل');
  const [newMGov, setNewMGov] = useState('القاهرة');
  const [newMDist, setNewMDist] = useState('المعادي');
  const [newMStreet, setNewMStreet] = useState('');

  // New Captain State
  const [newCName, setNewCName] = useState('');
  const [newCPhone, setNewCPhone] = useState('');
  const [newCGov, setNewCGov] = useState('القاهرة');
  const [newCDist, setNewCDist] = useState('المعادي');
  const [newCVehicle, setNewCVehicle] = useState('دراجة نارية مجهزة');

  // New Ad State
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdSubtitle, setNewAdSubtitle] = useState('');
  const [newAdBadge, setNewAdBadge] = useState('عرض حصري');
  const [newAdImage, setNewAdImage] = useState('');

  // New Supervisor State
  const [newSupName, setNewSupName] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupPass, setNewSupPass] = useState('super123456');
  const [supCanMerchants, setSupCanMerchants] = useState(true);
  const [supCanOrders, setSupCanOrders] = useState(true);
  const [supCanFinancials, setSupCanFinancials] = useState(false);
  const [supCanAds, setSupCanAds] = useState(true);
  const [supCanSupport, setSupCanSupport] = useState(true);

  // Admin Profile edit state
  const [editAdminEmail, setEditAdminEmail] = useState(adminEmail);
  const [editAdminPass, setEditAdminPass] = useState(adminPass);
  const [adminUpdateSuccess, setAdminUpdateSuccess] = useState(false);

  // Financial Settings State
  const [editCommRate, setEditCommRate] = useState(settings.commissionRate);
  const [editMaxDebt, setEditMaxDebt] = useState(settings.maxDebtLimit);
  const [editShipping, setEditShipping] = useState(settings.defaultShippingPerStore);
  const [editVodafone, setEditVodafone] = useState(settings.vodafoneCashNumber);
  const [editInstapay, setEditInstapay] = useState(settings.instapayAddress);
  const [financeSaveSuccess, setFinanceSaveSuccess] = useState(false);

  // Calculations
  const totalOrdersCount = orders.length;
  const totalAppCommission = orders.reduce((sum, o) => sum + (o.platformCommission || 0), 0);
  const totalMerchantsDebt = merchants.reduce((sum, m) => sum + (m.debtBalance || 0), 0);
  const totalMerchantsSales = merchants.reduce((sum, m) => sum + (m.totalSales || 0), 0);

  // Toggle Merchant Suspension (Damaged goods or Debt violation)
  const handleToggleMerchantStatus = (m: Merchant) => {
    const updated = merchants.map((item) => {
      if (item.id === m.id) {
        const nextState = !item.isSuspended;
        return {
          ...item,
          isSuspended: nextState,
          suspensionReason: nextState ? 'تم إيقاف الحساب بقرار إداري' : undefined,
        };
      }
      return item;
    });
    onUpdateMerchants(updated);
  };

  // Approve Debt Payment by Merchant
  const handleApproveDebtPayment = (merchantId: string, paymentId: string) => {
    const updatedMerchants = merchants.map((m) => {
      if (m.id === merchantId) {
        const pList = (m.debtPayments || []).map((p) => {
          if (p.id === paymentId) {
            return { ...p, status: 'approved' as const };
          }
          return p;
        });

        const targetP = (m.debtPayments || []).find((p) => p.id === paymentId);
        const amountDeducted = targetP ? targetP.amount : 0;
        const newBalance = Math.max(0, m.debtBalance - amountDeducted);

        return {
          ...m,
          debtBalance: newBalance,
          debtPayments: pList,
          isSuspended: newBalance >= settings.maxDebtLimit,
          suspensionReason: newBalance >= settings.maxDebtLimit ? m.suspensionReason : undefined,
        };
      }
      return m;
    });

    onUpdateMerchants(updatedMerchants);
  };

  // Add Merchant Handler
  const handleAddMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMStoreName || !newMPhone || !newMEmail) return;

    const newMerchant: Merchant = {
      id: `m-${Date.now()}`,
      name: newMOwnerName || 'التاجر المعتمد',
      storeName: newMStoreName,
      phone: newMPhone,
      email: newMEmail,
      password: newMPassword,
      governorate: newMGov,
      district: newMDist,
      street: newMStreet || 'الشارع الرئيسي',
      building: 'عمارة 1',
      category: newMCategory,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
      isApproved: true,
      isSuspended: false,
      debtBalance: 0,
      totalSales: 0,
      completedOrdersCount: 0,
      termsAcceptedAt: new Date().toISOString(),
      debtPayments: [],
    };

    onUpdateMerchants([newMerchant, ...merchants]);
    setIsAddMerchantOpen(false);
    setNewMStoreName('');
    setNewMPhone('');
    setNewMEmail('');
  };

  // Add Captain Handler
  const handleAddCaptainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCName || !newCPhone) return;

    const newCap: Captain = {
      id: `cap-${Date.now()}`,
      name: newCName,
      phone: newCPhone,
      governorate: newCGov,
      district: newCDist,
      vehicleType: newCVehicle,
      isActive: true,
    };

    onUpdateCaptains([newCap, ...captains]);
    setIsAddCaptainOpen(false);
    setNewCName('');
    setNewCPhone('');
  };

  // Toggle Captain Status
  const handleToggleCaptain = (id: string) => {
    const list = captains.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    onUpdateCaptains(list);
  };

  // Add Ad Handler
  const handleAddAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle) return;

    const ad: SponsoredAd = {
      id: `ad-${Date.now()}`,
      title: newAdTitle,
      subtitle: newAdSubtitle || 'أفضل العروض والخصومات في منطقتك',
      badgeText: newAdBadge,
      image:
        newAdImage ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onUpdateAds([ad, ...ads]);
    setIsAddAdOpen(false);
    setNewAdTitle('');
    setNewAdSubtitle('');
    setNewAdImage('');
  };

  // Add Supervisor Handler
  const handleAddSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newSupEmail) return;

    const sup: Supervisor = {
      id: `sup-${Date.now()}`,
      name: newSupName,
      email: newSupEmail,
      phone: newSupPhone || '01000000000',
      password: newSupPass,
      permissions: {
        canManageMerchants: supCanMerchants,
        canManageOrders: supCanOrders,
        canManageFinancials: supCanFinancials,
        canManageAds: supCanAds,
        canManageSupport: supCanSupport,
      },
      isActive: true,
    };

    onUpdateSupervisors([sup, ...supervisors]);
    setIsAddSupervisorOpen(false);
    setNewSupName('');
    setNewSupEmail('');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      commissionRate: Number(editCommRate),
      maxDebtLimit: Number(editMaxDebt),
      defaultShippingPerStore: Number(editShipping),
      vodafoneCashNumber: editVodafone,
      instapayAddress: editInstapay,
    });
    setFinanceSaveSuccess(true);
    setTimeout(() => setFinanceSaveSuccess(false), 2500);
  };

  // Save Admin Credentials
  const handleSaveAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdminEmail.trim() || !editAdminPass.trim()) return;

    onChangeAdminCredentials(editAdminEmail.trim(), editAdminPass.trim());
    setAdminUpdateSuccess(true);
    setTimeout(() => setAdminUpdateSuccess(false), 2500);
  };

  // Resolve Return Request
  const handleResolveReturn = (orderId: string, approved: boolean) => {
    const list = orders.map((o) => {
      if (o.id === orderId && o.returnRequest) {
        return {
          ...o,
          returnRequest: {
            ...o.returnRequest,
            status: approved ? ('approved' as const) : ('rejected' as const),
          },
        };
      }
      return o;
    });
    onUpdateOrders(list);
  };

  // Resolve Password Reset Request
  const handleResolveResetRequest = (reqId: string) => {
    const list = resetRequests.map((r) => (r.id === reqId ? { ...r, status: 'sent' as const } : r));
    onUpdateResetRequests(list);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">
                {isAdmin ? 'لوحة تحكم الإدارة العامة' : `لوحة تحكم المشرف: ${currentSupervisor?.name}`}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {isAdmin ? 'المدير العام' : 'مشرف معتمد'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              مراقبة متكاملة للتجار والعملاء والكباتن والماليات وميثاق الأمانة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {resetRequests.filter((r) => r.status === 'pending').length > 0 && (
            <button
              onClick={() => setActiveTab('support')}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>طلبات استعادة كلمة المرور ({resetRequests.filter((r) => r.status === 'pending').length})</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">إجمالي الطلبات المنجزة</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount}</h3>
          <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
            مبيعات: {totalMerchantsSales} ج.م
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">أرباح التطبيق (العمولة)</span>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">
            {totalAppCommission.toFixed(1)} ج.م
          </h3>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            من نسبة الشحن ({settings.commissionRate}%)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">إجمالي مديونيات التجار</span>
          <h3 className="text-2xl font-black text-rose-700 mt-1">
            {totalMerchantsDebt} ج.م
          </h3>
          <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
            حد الإيقاف: {settings.maxDebtLimit} ج.م
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">التجار والعملاء المسجلين</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {merchants.length} تاجر / {customers.length} عميل
          </h3>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {captains.length} كابتن توصيل
          </span>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold scrollbar-none">
        {perms.canManageMerchants && (
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'merchants' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            قاعدة التجار ({merchants.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'customers' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
          }`}
        >
          قاعدة العملاء ({customers.length})
        </button>

        {perms.canManageOrders && (
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            الطلبات الحية ({orders.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('products')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
          }`}
        >
          جميع المنتجات ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('captains')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'captains' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
          }`}
        >
          كباتن التوصيل ({captains.length})
        </button>

        {perms.canManageFinancials && (
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'financials' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            الماليات وضبط المنصة
          </button>
        )}

        {perms.canManageAds && (
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ads' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            الإعلانات الممولة ({ads.length})
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => setActiveTab('supervisors')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'supervisors' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            المشرفين والصلاحيات ({supervisors.length})
          </button>
        )}

        {perms.canManageSupport && (
          <button
            onClick={() => setActiveTab('support')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'support' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            المقترحات والرسائل ({suggestions.length + resetRequests.length})
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin_profile')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admin_profile' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            بيانات المدير العام
          </button>
        )}
      </div>

      {/* Tab 1: Merchants Database */}
      {activeTab === 'merchants' && perms.canManageMerchants && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="font-black text-slate-900 text-base">
              قاعدة بيانات التجار المعتمدين والموقوفين
            </h3>
            <button
              onClick={() => setIsAddMerchantOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل تاجر جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">المتجر / التاجر</th>
                    <th className="p-3">المنطقة والحي</th>
                    <th className="p-3">الهاتف والبريد</th>
                    <th className="p-3">المديونية</th>
                    <th className="p-3">المبيعات</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3 text-center">إجراءات الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {merchants.map((m) => {
                    const isOverLimit = m.debtBalance >= settings.maxDebtLimit;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={m.image}
                              alt={m.storeName}
                              className="w-9 h-9 rounded-xl object-cover border"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{m.storeName}</span>
                              <span className="text-[10px] text-slate-400">{m.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">
                          {m.governorate} - {m.district}
                        </td>
                        <td className="p-3 text-slate-600">
                          <div className="font-mono text-[11px]" dir="ltr">{m.phone}</div>
                          <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{m.email}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`font-black ${
                              isOverLimit ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {m.debtBalance} ج.م
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-700">
                          {m.totalSales} ج.م
                        </td>
                        <td className="p-3">
                          {m.isSuspended || isOverLimit ? (
                            <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              موقوف
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              نشط
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Toggle Suspend */}
                            <button
                              onClick={() => handleToggleMerchantStatus(m)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${
                                m.isSuspended
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                  : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                              }`}
                            >
                              {m.isSuspended ? 'تفعيل الحساب' : 'إيقاف / تجميد'}
                            </button>

                            {/* WhatsApp credentials helper */}
                            <a
                              href={`https://wa.me/2${m.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                                `مرحباً ${m.storeName}، بيانات دخولك لمنصة بقالة ستور:\nالبريد: ${m.email}\nكلمة المرور: ${m.password || '123456'}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                              title="إرسال بيانات الدخول عبر واتساب"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Customers Database */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">
              قاعدة بيانات العملاء وعناوينهم بالتفصيل
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">اسم العميل</th>
                    <th className="p-3">الهاتف والبريد</th>
                    <th className="p-3">العنوان التفصيلي المسجل</th>
                    <th className="p-3">عدد الطلبات</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => {
                    const custOrdersCount = orders.filter((o) => o.customerId === c.id).length;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3">
                          <div className="font-mono text-[11px]" dir="ltr">{c.phone}</div>
                          <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{c.email}</div>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px] max-w-xs">
                          {c.governorate} - {c.district}، {c.street}، {c.building}، {c.floor}، {c.apartment}
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {custOrdersCount} طلبات
                        </td>
                        <td className="p-3">
                          {c.isBlocked ? (
                            <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              محظور
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              نشط
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              const list = customers.map((item) =>
                                item.id === c.id ? { ...item, isBlocked: !item.isBlocked } : item
                              );
                              onUpdateCustomers(list);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                              c.isBlocked
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {c.isBlocked ? 'فك الحظر' : 'حظر العميل'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Monitoring */}
      {activeTab === 'orders' && perms.canManageOrders && (
        <div className="space-y-4">
          <h3 className="font-black text-slate-900 text-base">
            متابعة جميع الطلبات الحية ({orders.length})
          </h3>

          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {o.orderNumber}
                    </span>
                    <span className="text-slate-500">
                      العميل: <strong>{o.customerName}</strong> ({o.customerPhone})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">{o.grandTotal} ج.م</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                      عمولة التطبيق: {o.platformCommission} ج.م
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]" dir="ltr">
                      {new Date(o.createdAt).toLocaleDateString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">الأصناف:</span>
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {it.name} × {it.quantity} ({it.merchantName})
                        </span>
                        <span className="font-bold">{it.price * it.quantity} ج.م</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div>
                      <span className="font-bold text-slate-800">العنوان: </span>
                      <span>
                        {o.address.governorate} - {o.address.district}، {o.address.street}، {o.address.building}
                      </span>
                    </div>

                    {o.captain && (
                      <div className="p-2 bg-teal-50 rounded-lg border border-teal-200 text-teal-900 flex justify-between items-center">
                        <span>المندوب: {o.captain.name} ({o.captain.phone})</span>
                        <a
                          href={`https://wa.me/2${o.captain.phone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-teal-700 hover:underline"
                        >
                          واتساب
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return request approval */}
                {o.returnRequest && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-rose-900 flex items-center gap-1">
                        <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                        <span>طلب استرجاع بضاعة تالفة مقدم من العميل</span>
                      </span>
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md border">
                        الحالة: {o.returnRequest.status === 'approved' ? 'معتمد ومجاني' : 'قيد النظر'}
                      </span>
                    </div>
                    <p className="text-rose-800 text-[11px]">
                      <strong>السبب:</strong> {o.returnRequest.reason} - {o.returnRequest.itemsDescription}
                    </p>
                    {o.returnRequest.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleResolveReturn(o.id, true)}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer text-[10px]"
                        >
                          اعتماد الاسترجاع المجاني (خصم من التاجر)
                        </button>
                        <button
                          onClick={() => handleResolveReturn(o.id, false)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-[10px]"
                        >
                          رفض الطلب
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: All Products */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">
              جميع السلع والمنتجات المرفوعة ({products.length})
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-2.5 flex flex-col justify-between shadow-xs"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-slate-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{p.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{p.merchantName}</span>
                  <div className="flex justify-between items-baseline mt-1 font-bold text-slate-800 text-xs">
                    <span>{p.price} ج.م</span>
                    <span className="text-[10px] text-slate-400">/{p.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Delivery Captains Directory */}
      {activeTab === 'captains' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">
              سجل كباتن التوصيل والمناديب
            </h3>
            <button
              onClick={() => setIsAddCaptainOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كابتن جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {captains.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border bg-white shadow-xs space-y-2 transition-all ${
                  !c.isActive ? 'border-rose-200 bg-rose-50/40' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">{c.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono" dir="ltr">{c.phone}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      c.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {c.isActive ? 'متاح' : 'موقوف مؤقتاً'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p>المنطقة: {c.governorate} - {c.district}</p>
                  <p>المركبة: {c.vehicleType}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleCaptain(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                      c.isActive
                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {c.isActive ? 'إيقاف مؤقت' : 'تفعيل الكابتن'}
                  </button>

                  <a
                    href={`https://wa.me/2${c.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold text-[10px] flex items-center gap-1 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>مراسلة واتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Financials & Admin Settings */}
      {activeTab === 'financials' && perms.canManageFinancials && (
        <div className="space-y-6">
          {/* Pending Merchant Debt Payments to Approve */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>إشعارات سداد مديونيات التجار بانتظار اعتماد الإدارة</span>
            </h4>

            {merchants.flatMap((m) =>
              (m.debtPayments || [])
                .filter((p) => p.status === 'pending')
                .map((p) => ({ ...p, merchantId: m.id, merchantStore: m.storeName }))
            ).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                لا توجد طلبات سداد مديونية معلقة.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {merchants
                  .flatMap((m) =>
                    (m.debtPayments || [])
                      .filter((p) => p.status === 'pending')
                      .map((p) => ({ ...p, merchantId: m.id, merchantStore: m.storeName }))
                  )
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200"
                    >
                      <div>
                        <span className="font-bold text-slate-900">
                          {p.merchantStore} قام بتحويل {p.amount} ج.م عبر{' '}
                          {p.method === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          رقم المرجع: {p.refNumber} • التاريخ: {new Date(p.date).toLocaleDateString('ar-EG')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleApproveDebtPayment(p.merchantId, p.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                      >
                        اعتماد وتصفير من المديونية
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Platform Settings Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-600" />
              <span>ضبط النسب المالية والحدود والتحويلات</span>
            </h4>

            {financeSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم حفظ إعدادات المنصة المالية بنجاح.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    نسبة عمولة المنصة من رسوم التوصيل (%) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editCommRate}
                    onChange={(e) => setEditCommRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    تُحسب من التوصيل فقط ولا تمس سعر السلعة.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الحد الأقصى للمديونية قبل تجميد المتجر (ج.م) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={editMaxDebt}
                    onChange={(e) => setEditMaxDebt(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    إذا تخطاها التاجر يتوقف حسابه آلياً.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رسوم التوصيل الافتراضية لكل متجر (ج.م) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={editShipping}
                    onChange={(e) => setEditShipping(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رقم محفظة فودافون كاش المعتمد للإدارة *
                  </label>
                  <input
                    type="text"
                    value={editVodafone}
                    onChange={(e) => setEditVodafone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:bg-white"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    عنوان حساب إنستا باي (IPA) *
                  </label>
                  <input
                    type="text"
                    value={editInstapay}
                    onChange={(e) => setEditInstapay(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:bg-white"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                حفظ الإعدادات المالية
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 7: Sponsored Ads */}
      {activeTab === 'ads' && perms.canManageAds && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">
              الإعلانات والبانرات الممولة على واجهة العميل ({ads.length})
            </h3>
            <button
              onClick={() => setIsAddAdOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إعلان ممول</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full bg-slate-100">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {ad.badgeText}
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="font-black text-slate-900 text-xs">{ad.title}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2">{ad.subtitle}</p>
                </div>

                <div className="p-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      const list = ads.map((item) =>
                        item.id === ad.id ? { ...item, isActive: !item.isActive } : item
                      );
                      onUpdateAds(list);
                    }}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer ${
                      ad.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {ad.isActive ? 'مفعل ويظهر للعميل' : 'معطل مؤقتاً'}
                  </button>

                  <button
                    onClick={() => {
                      const list = ads.filter((item) => item.id !== ad.id);
                      onUpdateAds(list);
                    }}
                    className="text-rose-600 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                  >
                    حذف الإعلان
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Supervisors Management */}
      {activeTab === 'supervisors' && isAdmin && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">
              إدارة المشرفين وتخصيص الصلاحيات
            </h3>
            <button
              onClick={() => setIsAddSupervisorOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب مشرف جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {supervisors.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">{s.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono" dir="ltr">{s.email}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {s.isActive ? 'نشط' : 'معطل'}
                  </span>
                </div>

                {/* Permissions Breakdown */}
                <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-0.5">الصلاحيات الممنوحة:</span>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <span className={s.permissions.canManageMerchants ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {s.permissions.canManageMerchants ? '✓' : '✗'} إدارة التجار
                    </span>
                    <span className={s.permissions.canManageOrders ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {s.permissions.canManageOrders ? '✓' : '✗'} إدارة الطلبات
                    </span>
                    <span className={s.permissions.canManageFinancials ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {s.permissions.canManageFinancials ? '✓' : '✗'} إدارة الماليات
                    </span>
                    <span className={s.permissions.canManageAds ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {s.permissions.canManageAds ? '✓' : '✗'} إدارة الإعلانات
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const list = supervisors.map((item) =>
                        item.id === s.id ? { ...item, isActive: !item.isActive } : item
                      );
                      onUpdateSupervisors(list);
                    }}
                    className="text-[10px] font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    {s.isActive ? 'تعطيل الحساب' : 'تفعيل'}
                  </button>

                  <button
                    onClick={() => {
                      const list = supervisors.filter((item) => item.id !== s.id);
                      onUpdateSupervisors(list);
                    }}
                    className="text-rose-600 hover:text-rose-700 text-[10px] font-bold cursor-pointer"
                  >
                    حذف المشرف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Support, Suggestions & Password Resets */}
      {activeTab === 'support' && perms.canManageSupport && (
        <div className="space-y-5">
          {/* Password Reset Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>طلبات استعادة كلمة المرور الواردة من التجار</span>
            </h4>

            {resetRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">لا توجد طلبات استعادة معلقة.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {resetRequests.map((r) => {
                  const m = merchants.find((item) => item.phone === r.phone);
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200"
                    >
                      <div>
                        <span className="font-bold text-slate-900">
                          التاجر: {m ? m.storeName : r.merchantName || 'تاجر مسجل'} (هاتف: {r.phone})
                        </span>
                        <div className="text-[10px] text-slate-600 mt-0.5">
                          البريد: {m?.email || 'غير متوفر'} • كلمة المرور الحالية:{' '}
                          <span className="font-mono font-bold text-emerald-800">
                            {m?.password || '123456'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {m && (
                          <a
                            href={`https://wa.me/2${m.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                              `مرحباً ${m.storeName}، بناء على طلبك لاستعادة حساب بقالة ستور:\nالبريد: ${m.email}\nكلمة المرور: ${m.password || '123456'}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => handleResolveResetRequest(r.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>إرسال البيانات عبر واتساب</span>
                          </a>
                        )}
                        <button
                          onClick={() => handleResolveResetRequest(r.id)}
                          className="px-2.5 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                        >
                          تم الحل
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suggestions & Complaints */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>صندوق الاقتراحات والشكاوى من العملاء</span>
            </h4>

            {suggestions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد رسائل جديدة.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>
                        {s.senderName} ({s.senderPhone}) - {s.type === 'suggestion' ? 'اقتراح' : s.type === 'complaint' ? 'شكوى' : 'استفسار'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                        {new Date(s.date).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{s.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 10: Admin Profile Credentials Edit */}
      {activeTab === 'admin_profile' && isAdmin && (
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="text-center space-y-1 border-b pb-3">
            <h3 className="font-black text-base text-slate-900">
              تعديل بيانات الدخول الخاصة بالمدير العام
            </h3>
            <p className="text-slate-500 text-xs">
              خاص بالمدير فقط ولا يحق للمشرفين الدخول هنا أو التعديل.
            </p>
          </div>

          {adminUpdateSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تم تحديث بيانات المدير العام بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleSaveAdminCredentials} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                البريد الإلكتروني / اسم الدخول للمدير *
              </label>
              <input
                type="email"
                required
                value={editAdminEmail}
                onChange={(e) => setEditAdminEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white text-left font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                كلمة المرور الجديدة للمدير *
              </label>
              <input
                type="text"
                required
                value={editAdminPass}
                onChange={(e) => setEditAdminPass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white text-left font-mono"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              حفظ وتطبيق البيانات الجديدة
            </button>
          </form>
        </div>
      )}

      {/* POPUP MODAL: Add Merchant */}
      {isAddMerchantOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-black text-sm text-slate-900">تسجيل تاجر وبقال جديد</h4>
              <button
                onClick={() => setIsAddMerchantOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMerchantSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المحل *</label>
                  <input
                    type="text"
                    required
                    value={newMStoreName}
                    onChange={(e) => setNewMStoreName(e.target.value)}
                    placeholder="سوبرماركت التوفيق"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المسؤول *</label>
                  <input
                    type="text"
                    value={newMOwnerName}
                    onChange={(e) => setNewMOwnerName(e.target.value)}
                    placeholder="محمد توفيق"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={newMPhone}
                    onChange={(e) => setNewMPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={newMEmail}
                    onChange={(e) => setNewMEmail(e.target.value)}
                    placeholder="store@bekala.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المحافظة *</label>
                  <select
                    value={newMGov}
                    onChange={(e) => {
                      setNewMGov(e.target.value);
                      const f = EGYPT_LOCATIONS.find((l) => l.governorate === e.target.value);
                      if (f) setNewMDist(f.districts[0]);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                  >
                    {EGYPT_LOCATIONS.map((l) => (
                      <option key={l.governorate} value={l.governorate}>
                        {l.governorate}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحي *</label>
                  <select
                    value={newMDist}
                    onChange={(e) => setNewMDist(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold"
                  >
                    {(EGYPT_LOCATIONS.find((l) => l.governorate === newMGov)?.districts || []).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                حفظ وتسجيل التاجر
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add Captain */}
      {isAddCaptainOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-black text-sm text-slate-900">إضافة مندوب توصيل جديد</h4>
              <button
                onClick={() => setIsAddCaptainOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCaptainSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المندوب *</label>
                <input
                  type="text"
                  required
                  value={newCName}
                  onChange={(e) => setNewCName(e.target.value)}
                  placeholder="كابتن طارق عبد الله"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف للتواصل *</label>
                <input
                  type="tel"
                  required
                  value={newCPhone}
                  onChange={(e) => setNewCPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نوع وسيلة التوصيل</label>
                <input
                  type="text"
                  value={newCVehicle}
                  onChange={(e) => setNewCVehicle(e.target.value)}
                  placeholder="موتوسيكل سريع / سكوتر"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                تسجيل الكابتن
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add Sponsored Ad with Direct Upload */}
      {isAddAdOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-black text-sm text-slate-900">إضافة إعلان ممول</h4>
              <button
                onClick={() => setIsAddAdOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الإعلان الرئيسي *</label>
                <input
                  type="text"
                  required
                  value={newAdTitle}
                  onChange={(e) => setNewAdTitle(e.target.value)}
                  placeholder="عروض الجمعة الخضراء 🥦"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف العرض</label>
                <textarea
                  rows={2}
                  value={newAdSubtitle}
                  onChange={(e) => setNewAdSubtitle(e.target.value)}
                  placeholder="خصم 20% على جميع الخضروات الطازجة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شعار الإعلان</label>
                <input
                  type="text"
                  value={newAdBadge}
                  onChange={(e) => setNewAdBadge(e.target.value)}
                  placeholder="عرض خاص ومحدود"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  صورة الإعلان (رفع صورة عادية من جهازك)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') setNewAdImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                نشر الإعلان للعملاء
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add Supervisor */}
      {isAddSupervisorOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-black text-sm text-slate-900">إنشاء حساب مشرف جديد</h4>
              <button
                onClick={() => setIsAddSupervisorOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSupervisorSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المشرف *</label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder="م. أحمد الشريف"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني للدخول *</label>
                <input
                  type="email"
                  required
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  placeholder="mod@bekala.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">كلمة المرور *</label>
                <input
                  type="password"
                  required
                  value={newSupPass}
                  onChange={(e) => setNewSupPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">تحديد الصلاحيات بدقة:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supCanMerchants}
                    onChange={(e) => setSupCanMerchants(e.target.checked)}
                  />
                  <span>إدارة التجار وحظرهم وتفعيلهم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supCanOrders}
                    onChange={(e) => setSupCanOrders(e.target.checked)}
                  />
                  <span>متابعة الطلبات وتعيين الكباتن</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supCanFinancials}
                    onChange={(e) => setSupCanFinancials(e.target.checked)}
                  />
                  <span>التحكم في الماليات وضبط النسب والمديونيات</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supCanAds}
                    onChange={(e) => setSupCanAds(e.target.checked)}
                  />
                  <span>إدارة الإعلانات الممولة</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supCanSupport}
                    onChange={(e) => setSupCanSupport(e.target.checked)}
                  />
                  <span>استقبال الشكاوى والمقترحات</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                تثبيت المشرف
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
