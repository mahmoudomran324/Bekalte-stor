import {
  AdminSettings,
  Captain,
  Customer,
  DebtPayment,
  Merchant,
  MonthlyDeliveryPackage,
  Order,
  PasswordResetRequest,
  Product,
  SponsoredAd,
  Suggestion,
  Supervisor,
} from '../types';

export const EGYPT_LOCATIONS = [
  {
    governorate: 'الإسكندرية',
    districts: [
      'العجمي',
      'العصافرة',
      'المندرة',
      'سيدي بشر',
      'الفلكي',
      'حجر النواتية',
      'كوبري الناموس',
      'كومباوند القضاء',
      'كومباوند شباب الرمل',
      'كومباوند مدينة اسيد',
      'كومباوند انطونيادس',
      'كومباوند فيروز السموحة',
      'شارع الريادة',
      'شارع النقل والهندسة',
      'كفر عبده',
      'سموحة',
      'سيدي جابر',
      'ميامي',
      'لوران',
      'محرم بك',
      'الإبراهيمية',
      'المنتزه',
    ],
  },
  {
    governorate: 'القاهرة',
    districts: [
      'المعادي',
      'مدينة نصر',
      'مصر الجديدة',
      'التجمع الخامس',
      'التجمع الأول',
      'الرحاب',
      'مدينتي',
      'الشروق',
      'بدر',
      'شبرا',
      'شبرا مصر',
      'حلوان',
      'الزمالك',
      'المقطم',
      'عين شمس',
      'حدائق القبة',
      'روض الفرج',
      'العبور',
    ],
  },
  {
    governorate: 'الجيزة',
    districts: [
      'الدقي',
      'المهندسين',
      '6 أكتوبر',
      'الشيخ زايد',
      'الهرم',
      'فيصل',
      'العجوزة',
      'حدائق الأهرام',
    ],
  },
  {
    governorate: 'القليوبية',
    districts: ['بنها', 'شبرا الخيمة', 'قليوب', 'طوخ', 'العبور'],
  },
  {
    governorate: 'الشرقية',
    districts: ['الزقازيق', 'العاشر من رمضان', 'بلبيس', 'فاقوس'],
  },
  {
    governorate: 'الدقهلية',
    districts: ['المنصورة', 'طلخا', 'ميت غمر', 'السنبلاوين'],
  },
];

// Default Monthly Delivery Packages for Customers
export const DEFAULT_MONTHLY_PACKAGES: MonthlyDeliveryPackage[] = [
  {
    id: 'pkg-basic',
    name: 'باقة التوصيل الشهري الفردية',
    price: 89,
    durationDays: 30,
    description: 'توصيل مجاني غير محدود لجميع طلباتك خلال الشهر بدلاً من دفع مصاريف شحن على كل أوردر',
    features: [
      'توصيل مجاني 100% لكافة الطلبات',
      'سارية لمدة 30 يوماً من تاريخ التفعيل',
      'تشمل كافة المتاجر والبقالين في منطقتك',
      'أولوية في سرعة التجهيز والإرسال',
    ],
    isPopular: false,
  },
  {
    id: 'pkg-vip',
    name: 'باقة التوصيل الشهري الذهبية للعائلات',
    price: 139,
    durationDays: 30,
    description: 'الباقة الأكثر توفيراً للعائلات: شحن مجاني غير محدود حتى عند الطلب من متاجر متعددة معاً',
    features: [
      'توصيل مجاني غير محدود وبدون حد أقصى للطلبات',
      'إعفاء كامل من رسوم الشحن المتعدد بين التجار',
      'سارية لمدة 30 يوماً وتجدد حسب رغبتك',
      'دعم وتنسيق مباشر مع الكباتن عبر واتساب',
    ],
    isPopular: true,
  },
];

// Initial default settings with easy admin configuration
const DEFAULT_SETTINGS: AdminSettings = {
  commissionRate: 10, // 10% from shipping
  maxDebtLimit: 1200, // Maximum allowed debt before suspension in EGP
  defaultShippingPerStore: 15, // EGP shipping fee per merchant
  vodafoneCashNumber: '01099887766',
  instapayAddress: 'bekala.pay@instapay',
  supportPhone: '01022334455',
  supportWhatsapp: '201022334455',
  monthlyPackages: DEFAULT_MONTHLY_PACKAGES,
};

// Real base merchants with verified Egyptian goods across Alexandria and Cairo
const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 'm-alex-1',
    name: 'كابتن محمود عمران',
    storeName: 'سوبرماركت عمران العصافرة',
    phone: '01011223344',
    email: 'omran.asafra@bekala.com',
    password: 'password123',
    governorate: 'الإسكندرية',
    district: 'العصافرة',
    street: 'شارع جمال عبد الناصر - بجوار محطة قطار العصافرة',
    building: 'برج عمران رقم 15',
    category: 'سوبرماركت كامل',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 0,
    totalSales: 0,
    completedOrdersCount: 0,
    termsAcceptedAt: new Date().toISOString(),
    debtPayments: [],
  },
  {
    id: 'm-alex-2',
    name: 'الحاج مجدي السكندري',
    storeName: 'خضار وفاكهة عروس البحر (كفر عبده)',
    phone: '01122334455',
    email: 'kfrabdo.fresh@bekala.com',
    password: 'password123',
    governorate: 'الإسكندرية',
    district: 'كفر عبده',
    street: 'ميدان سانت جيني - شارع كفر عبده الرئيسي',
    building: 'عمارة زهرة كفر عبده',
    category: 'خضار وفواكه',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 0,
    totalSales: 0,
    completedOrdersCount: 0,
    termsAcceptedAt: new Date().toISOString(),
    debtPayments: [],
  },
  {
    id: 'm-alex-3',
    name: 'الشيخ رجب الحرمين',
    storeName: 'ألبان وجبن فيروز السموحة',
    phone: '01233445566',
    email: 'smoha.dairy@bekala.com',
    password: 'password123',
    governorate: 'الإسكندرية',
    district: 'كومباوند فيروز السموحة',
    street: 'مدخل كومباوند فيروز السموحة - أمام نادي سموحة',
    building: 'عمارة 4A',
    category: 'جبن وألبان',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 0,
    totalSales: 0,
    completedOrdersCount: 0,
    termsAcceptedAt: new Date().toISOString(),
    debtPayments: [],
  },
  {
    id: 'm-alex-4',
    name: 'محمد عبد الله العجمي',
    storeName: 'ماركت العجمي والبيطاش الشامل',
    phone: '01055667788',
    email: 'agami.market@bekala.com',
    password: 'password123',
    governorate: 'الإسكندرية',
    district: 'العجمي',
    street: 'طريق إسكندرية مطروح - مدخل البيطاش',
    building: 'برج السلام 8',
    category: 'سوبرماركت كامل',
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 0,
    totalSales: 0,
    completedOrdersCount: 0,
    termsAcceptedAt: new Date().toISOString(),
    debtPayments: [],
  },
  {
    id: 'm-cairo-1',
    name: 'الحاج إبراهيم رضوان',
    storeName: 'سوبرماركت البركة الشامل (المعادي)',
    phone: '01011122233',
    email: 'baraka.maadi@bekala.com',
    password: 'password123',
    governorate: 'القاهرة',
    district: 'المعادي',
    street: 'شارع 9 الرئيسي',
    building: 'عمارة 45',
    category: 'سوبرماركت كامل',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 0,
    totalSales: 0,
    completedOrdersCount: 0,
    termsAcceptedAt: new Date().toISOString(),
    debtPayments: [],
  },
  {
    id: 'm-cairo-2',
    name: 'عماد عبد الله',
    storeName: 'خضار وفاكهة الباشا الطازجة (المعادي)',
    phone: '01122233344',
    email: 'basha.fruits@bekala.com',
    password: 'password123',
    governorate: 'القاهرة',
    district: 'المعادي',
    street: 'شارع النصر بجوار ميدان الجزائر',
    building: 'برج الأمل رقم 12',
    category: 'خضار وفواكه',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 0,
    totalSales: 0,
    completedOrdersCount: 0,
    termsAcceptedAt: new Date().toISOString(),
    debtPayments: [],
  },
];

// Initial Real Products
const INITIAL_PRODUCTS: Product[] = [
  // Products for m-alex-1 (العصافرة)
  {
    id: 'p-alx-1',
    merchantId: 'm-alex-1',
    merchantName: 'سوبرماركت عمران العصافرة',
    name: 'أرز مصري ممتاز عريض الحبة (1 كجم)',
    category: 'بقالة ومجففات',
    price: 38,
    discountPrice: 34,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    description: 'أرز مصري أبيض منقى وخالي من الشوائب ومغسول ومعبأ آلياً',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'العصافرة',
  },
  {
    id: 'p-alx-2',
    merchantId: 'm-alex-1',
    merchantName: 'سوبرماركت عمران العصافرة',
    name: 'زيت ذرة عافية نقي (800 مل)',
    category: 'بقالة ومجففات',
    price: 92,
    discountPrice: 85,
    unit: 'قطعة',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    description: 'زيت ذرة نقي 100% ممتاز للطهي والتحمير',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'العصافرة',
  },
  {
    id: 'p-alx-3',
    merchantId: 'm-alex-1',
    merchantName: 'سوبرماركت عمران العصافرة',
    name: 'مكرونة الملكة أقلام / مرمرية (400 جم)',
    category: 'بقالة ومجففات',
    price: 16,
    discountPrice: 14,
    unit: 'قطعة',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80',
    description: 'مكرونة فاخرة مصنوعة من أفضل أنواع سميد القمح',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'العصافرة',
  },

  // Products for m-alex-2 (كفر عبده)
  {
    id: 'p-alx-4',
    merchantId: 'm-alex-2',
    merchantName: 'خضار وفاكهة عروس البحر (كفر عبده)',
    name: 'طماطم بلدي فرز أول طازة',
    category: 'خضار وفواكه',
    price: 20,
    discountPrice: 17,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    description: 'طماطم بلدي حمراء نضرة مقطوفة طازة صباح اليوم خالية من العيوب',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'كفر عبده',
  },
  {
    id: 'p-alx-5',
    merchantId: 'm-alex-2',
    merchantName: 'خضار وفاكهة عروس البحر (كفر عبده)',
    name: 'بطاطس تحمير شيبسي ممتازة (1 كجم)',
    category: 'خضار وفواكه',
    price: 24,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    description: 'بطاطس تحمير جودة عالية مقرمشة وخفيفة جداً',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'كفر عبده',
  },
  {
    id: 'p-alx-6',
    merchantId: 'm-alex-2',
    merchantName: 'خضار وفاكهة عروس البحر (كفر عبده)',
    name: 'تفاح أحمر سكري إيطالي فاخر',
    category: 'خضار وفواكه',
    price: 68,
    discountPrice: 60,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
    description: 'تفاح أحمر مستورد شديد القرمشة وغني بالنكهة السكرية',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'كفر عبده',
  },

  // Products for m-alex-3 (كومباوند فيروز السموحة)
  {
    id: 'p-alx-7',
    merchantId: 'm-alex-3',
    merchantName: 'ألبان وجبن فيروز السموحة',
    name: 'جبنة بيضاء براميلي فلاحي قديمة (1 كجم)',
    category: 'جبن وألبان',
    price: 165,
    discountPrice: 155,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80',
    description: 'جبنة براميلي فلاحي معتقة من لبن جاموسي طبيعي 100%',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'كومباوند فيروز السموحة',
  },
  {
    id: 'p-alx-8',
    merchantId: 'm-alex-3',
    merchantName: 'ألبان وجبن فيروز السموحة',
    name: 'جبنة رومي قديمة بطارخ فاخرة (1 كجم)',
    category: 'جبن وألبان',
    price: 250,
    discountPrice: 235,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=500&auto=format&fit=crop&q=80',
    description: 'جبنة رومي معتقة نكهة قوية وجودة بطارخ لا تضاهى',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'كومباوند فيروز السموحة',
  },

  // Products for m-alex-4 (العجمي)
  {
    id: 'p-alx-9',
    merchantId: 'm-alex-4',
    merchantName: 'ماركت العجمي والبيطاش الشامل',
    name: 'كرتونة مياه معدنية طبيعية (12 زجاجة 1.5 لتر)',
    category: 'سوبرماركت كامل',
    price: 95,
    discountPrice: 88,
    unit: 'كرتونة',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
    description: 'مياه شرب نقية معبأة آلياً وفق أعلى معايير الجودة',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'العجمي',
  },

  // Products for m-cairo-1 (المعادي)
  {
    id: 'p-cairo-1',
    merchantId: 'm-cairo-1',
    merchantName: 'سوبرماركت البركة الشامل (المعادي)',
    name: 'أرز مصري فاخر عريض الحبة (1 كجم)',
    category: 'بقالة ومجففات',
    price: 36,
    discountPrice: 33,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    description: 'أرز مصري ممتاز أبيض منقى وخالي من الشوائب ومغسول ومعبأ آلياً',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p-cairo-2',
    merchantId: 'm-cairo-1',
    merchantName: 'سوبرماركت البركة الشامل (المعادي)',
    name: 'شاي العروسة أسود ناعم (250 جم)',
    category: 'بقالة ومجففات',
    price: 48,
    unit: 'علبة',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    description: 'شاي كيني أسود مميز بنكهة قوية ولون أحمر كهرماني رائع',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },

  // Products for m-cairo-2 (المعادي)
  {
    id: 'p-cairo-3',
    merchantId: 'm-cairo-2',
    merchantName: 'خضار وفاكهة الباشا الطازجة (المعادي)',
    name: 'طماطم بلدي فرز أول طازجة',
    category: 'خضار وفواكه',
    price: 18,
    discountPrice: 15,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    description: 'طماطم طازجة حمراء متماسكة مقطوفة طازة صباح اليوم من المزرعة',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p-cairo-4',
    merchantId: 'm-cairo-2',
    merchantName: 'خضار وفاكهة الباشا الطازجة (المعادي)',
    name: 'خيار بلدي صوبة طازج ومقرمش',
    category: 'خضار وفواكه',
    price: 16,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=80',
    description: 'خيار بلدي رفيع ومقرمش مناسب للسلطة والسندوتشات',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
];

// Delivery Captains
const INITIAL_CAPTAINS: Captain[] = [
  {
    id: 'c-alex-1',
    name: 'كابتن محمود السكندري',
    phone: '01012345678',
    governorate: 'الإسكندرية',
    district: 'العصافرة',
    vehicleType: 'موتوسيكل سريع ومجهز بصندوق حفظ الأطعمة',
    isActive: true,
  },
  {
    id: 'c-alex-2',
    name: 'كابتن طارق عبد الله',
    phone: '01198765432',
    governorate: 'الإسكندرية',
    district: 'كفر عبده',
    vehicleType: 'سكوتر كهربائي سريع',
    isActive: true,
  },
  {
    id: 'c-cairo-1',
    name: 'كابتن أحمد محمود',
    phone: '01234567890',
    governorate: 'القاهرة',
    district: 'المعادي',
    vehicleType: 'موتوسيكل بصندوق عازل للحرارة',
    isActive: true,
  },
];

// Sponsored Ads
const INITIAL_ADS: SponsoredAd[] = [
  {
    id: 'ad1',
    title: 'عروض السوبرماركت الكبرى بالإسكندرية والقاهرة 🎉',
    subtitle: 'وفر حتى 20% على منتجات البقالة والزيوت مع توصيل سريع في أقل من 35 دقيقة!',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    badgeText: 'عروض حصرية',
    linkText: 'تصفح العروض',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ad2',
    title: 'طازة من الغيط لبيتك 🍎🥦',
    subtitle: 'خضار وفاكهة منتقاة حبة بحبة مع ميثاق الأمانة: استرجاع فوري مجاني إن لم ترضيك!',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&auto=format&fit=crop&q=80',
    badgeText: 'طازة يومياً',
    linkText: 'قسم الخضار والفاكهة',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Supervisors
const INITIAL_SUPERVISORS: Supervisor[] = [
  {
    id: 'sup1',
    name: 'م. حسام الديب',
    email: 'supervisor@bekala.com',
    password: 'super123456',
    phone: '01033221100',
    permissions: {
      canManageMerchants: true,
      canManageOrders: true,
      canManageFinancials: false,
      canManageAds: true,
      canManageSupport: true,
    },
    isActive: true,
  },
];

// Storage keys
const STORAGE_KEYS = {
  DB_VERSION: 'bekala_db_version_v3',
  MERCHANTS: 'bekala_merchants',
  PRODUCTS: 'bekala_products',
  ORDERS: 'bekala_orders',
  CUSTOMERS: 'bekala_customers',
  CAPTAINS: 'bekala_captains',
  ADS: 'bekala_ads',
  SETTINGS: 'bekala_settings',
  SUPERVISORS: 'bekala_supervisors',
  SUGGESTIONS: 'bekala_suggestions',
  RESET_REQUESTS: 'bekala_reset_requests',
  SELECTED_LOCATION: 'bekala_selected_location',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from storage`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('bekala_storage_update', { detail: { key } }));
  } catch (e) {
    console.warn(`Error writing ${key} to storage`, e);
  }
}

export const StorageService = {
  // Init database clean of fake data and upgrade to v3
  init() {
    const currentVer = localStorage.getItem(STORAGE_KEYS.DB_VERSION);
    if (currentVer !== '3.0') {
      // Clean previous fake orders and seed fresh database with real locations
      localStorage.setItem(STORAGE_KEYS.DB_VERSION, '3.0');
      setStored(STORAGE_KEYS.MERCHANTS, INITIAL_MERCHANTS);
      setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      setStored(STORAGE_KEYS.ORDERS, []); // Clean real orders list
      setStored(STORAGE_KEYS.CUSTOMERS, []); // Clean real customers list
      setStored(STORAGE_KEYS.CAPTAINS, INITIAL_CAPTAINS);
      setStored(STORAGE_KEYS.ADS, INITIAL_ADS);
      setStored(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      setStored(STORAGE_KEYS.SUPERVISORS, INITIAL_SUPERVISORS);
      setStored(STORAGE_KEYS.SUGGESTIONS, []);
      setStored(STORAGE_KEYS.RESET_REQUESTS, []);
      setStored(STORAGE_KEYS.SELECTED_LOCATION, { governorate: 'الإسكندرية', district: 'العصافرة' });
      return;
    }

    if (!localStorage.getItem(STORAGE_KEYS.MERCHANTS)) {
      setStored(STORAGE_KEYS.MERCHANTS, INITIAL_MERCHANTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      setStored(STORAGE_KEYS.ORDERS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      setStored(STORAGE_KEYS.CUSTOMERS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAPTAINS)) {
      setStored(STORAGE_KEYS.CAPTAINS, INITIAL_CAPTAINS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADS)) {
      setStored(STORAGE_KEYS.ADS, INITIAL_ADS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setStored(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPERVISORS)) {
      setStored(STORAGE_KEYS.SUPERVISORS, INITIAL_SUPERVISORS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUGGESTIONS)) {
      setStored(STORAGE_KEYS.SUGGESTIONS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESET_REQUESTS)) {
      setStored(STORAGE_KEYS.RESET_REQUESTS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION)) {
      setStored(STORAGE_KEYS.SELECTED_LOCATION, { governorate: 'الإسكندرية', district: 'العصافرة' });
    }
  },

  // Merchants
  getMerchants(): Merchant[] {
    return getStored<Merchant[]>(STORAGE_KEYS.MERCHANTS, INITIAL_MERCHANTS);
  },
  saveMerchants(merchants: Merchant[]) {
    setStored(STORAGE_KEYS.MERCHANTS, merchants);
  },
  getMerchantById(id: string): Merchant | undefined {
    return this.getMerchants().find((m) => m.id === id);
  },
  updateMerchant(updated: Merchant) {
    const list = this.getMerchants().map((m) => (m.id === updated.id ? updated : m));
    this.saveMerchants(list);
  },
  addMerchant(newMerchant: Merchant) {
    const list = [newMerchant, ...this.getMerchants()];
    this.saveMerchants(list);
  },

  // Products
  getProducts(): Product[] {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  // CRITICAL REQUIREMENT: Strict filter for active products where merchant is NOT suspended
  getActiveProducts(): Product[] {
    const merchants = this.getMerchants();
    const settings = this.getSettings();
    const activeMerchantIds = new Set(
      merchants
        .filter((m) => !m.isSuspended && m.isApproved && m.debtBalance < settings.maxDebtLimit)
        .map((m) => m.id)
    );
    return this.getProducts().filter((p) => p.isAvailable && activeMerchantIds.has(p.merchantId));
  },
  saveProducts(products: Product[]) {
    setStored(STORAGE_KEYS.PRODUCTS, products);
  },
  addProduct(product: Product) {
    const list = [product, ...this.getProducts()];
    this.saveProducts(list);
  },
  updateProduct(updated: Product) {
    const list = this.getProducts().map((p) => (p.id === updated.id ? updated : p));
    this.saveProducts(list);
  },
  deleteProduct(id: string) {
    const list = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(list);
  },

  // Orders
  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
  },
  saveOrders(orders: Order[]) {
    setStored(STORAGE_KEYS.ORDERS, orders);
  },
  addOrder(order: Order) {
    const list = [order, ...this.getOrders()];
    this.saveOrders(list);

    // Update merchant debt & sales
    const merchants = this.getMerchants();
    const settings = this.getSettings();

    order.merchantsSummary.forEach((summary) => {
      const merchant = merchants.find((m) => m.id === summary.id);
      if (merchant) {
        // App commission is taken from delivery fee (default commissionRate % of shipping)
        const commission = summary.shipping * (settings.commissionRate / 100);
        merchant.debtBalance += commission;
        merchant.totalSales += summary.subtotal;

        // Auto freeze if debt exceeds ceiling
        if (merchant.debtBalance >= settings.maxDebtLimit) {
          merchant.isSuspended = true;
          merchant.suspensionReason = `تجاوز الحد الأقصى للمديونية (${settings.maxDebtLimit} ج.م)`;
        }
      }
    });

    this.saveMerchants(merchants);
  },
  updateOrder(updated: Order) {
    const list = this.getOrders().map((o) => (o.id === updated.id ? updated : o));
    this.saveOrders(list);
  },

  // Customers
  getCustomers(): Customer[] {
    return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  },
  saveCustomers(customers: Customer[]) {
    setStored(STORAGE_KEYS.CUSTOMERS, customers);
  },
  addCustomer(customer: Customer) {
    const list = [customer, ...this.getCustomers()];
    this.saveCustomers(list);
  },
  updateCustomer(updated: Customer) {
    const list = this.getCustomers().map((c) => (c.id === updated.id ? updated : c));
    this.saveCustomers(list);
  },

  // Captains
  getCaptains(): Captain[] {
    return getStored<Captain[]>(STORAGE_KEYS.CAPTAINS, INITIAL_CAPTAINS);
  },
  saveCaptains(captains: Captain[]) {
    setStored(STORAGE_KEYS.CAPTAINS, captains);
  },
  addCaptain(captain: Captain) {
    const list = [captain, ...this.getCaptains()];
    this.saveCaptains(list);
  },
  updateCaptain(updated: Captain) {
    const list = this.getCaptains().map((c) => (c.id === updated.id ? updated : c));
    this.saveCaptains(list);
  },

  // Ads
  getAds(): SponsoredAd[] {
    return getStored<SponsoredAd[]>(STORAGE_KEYS.ADS, INITIAL_ADS);
  },
  saveAds(ads: SponsoredAd[]) {
    setStored(STORAGE_KEYS.ADS, ads);
  },
  addAd(ad: SponsoredAd) {
    const list = [ad, ...this.getAds()];
    this.saveAds(list);
  },
  deleteAd(id: string) {
    const list = this.getAds().filter((a) => a.id !== id);
    this.saveAds(list);
  },

  // Settings
  getSettings(): AdminSettings {
    return getStored<AdminSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings: AdminSettings) {
    setStored(STORAGE_KEYS.SETTINGS, settings);
  },

  // Supervisors
  getSupervisors(): Supervisor[] {
    return getStored<Supervisor[]>(STORAGE_KEYS.SUPERVISORS, INITIAL_SUPERVISORS);
  },
  saveSupervisors(supervisors: Supervisor[]) {
    setStored(STORAGE_KEYS.SUPERVISORS, supervisors);
  },
  addSupervisor(supervisor: Supervisor) {
    const list = [supervisor, ...this.getSupervisors()];
    this.saveSupervisors(list);
  },
  updateSupervisor(updated: Supervisor) {
    const list = this.getSupervisors().map((s) => (s.id === updated.id ? updated : s));
    this.saveSupervisors(list);
  },
  deleteSupervisor(id: string) {
    const list = this.getSupervisors().filter((s) => s.id !== id);
    this.saveSupervisors(list);
  },

  // Suggestions
  getSuggestions(): Suggestion[] {
    return getStored<Suggestion[]>(STORAGE_KEYS.SUGGESTIONS, []);
  },
  addSuggestion(suggestion: Suggestion) {
    const list = [suggestion, ...this.getSuggestions()];
    setStored(STORAGE_KEYS.SUGGESTIONS, list);
  },

  // Password Reset Requests
  getPasswordResetRequests(): PasswordResetRequest[] {
    return getStored<PasswordResetRequest[]>(STORAGE_KEYS.RESET_REQUESTS, []);
  },
  addPasswordResetRequest(req: PasswordResetRequest) {
    const list = [req, ...this.getPasswordResetRequests()];
    setStored(STORAGE_KEYS.RESET_REQUESTS, list);
  },
  updatePasswordResetRequest(updated: PasswordResetRequest) {
    const list = this.getPasswordResetRequests().map((r) => (r.id === updated.id ? updated : r));
    setStored(STORAGE_KEYS.RESET_REQUESTS, list);
  },

  // Selected Location Filter
  getSelectedLocation(): { governorate: string; district: string } {
    return getStored(STORAGE_KEYS.SELECTED_LOCATION, { governorate: 'الإسكندرية', district: 'العصافرة' });
  },
  setSelectedLocation(loc: { governorate: string; district: string }) {
    setStored(STORAGE_KEYS.SELECTED_LOCATION, loc);
  },
};
