import {
  AdminSettings,
  Captain,
  Customer,
  DebtPayment,
  Merchant,
  Order,
  PasswordResetRequest,
  Product,
  SponsoredAd,
  Suggestion,
  Supervisor,
} from '../types';

export const EGYPT_LOCATIONS = [
  {
    governorate: 'القاهرة',
    districts: ['المعادي', 'مدينة نصر', 'مصر الجديدة', 'التجمع الخامس', 'شبرا', 'حلوان', 'الزمالك', 'المقطم'],
  },
  {
    governorate: 'الجيزة',
    districts: ['الدقي', 'المهندسين', '6 أكتوبر', 'الشيخ زايد', 'الهرم', 'فيصل', 'العجوزة'],
  },
  {
    governorate: 'الإسكندرية',
    districts: ['سموحة', 'سيدي جابر', 'ميامي', 'لوران', 'محرم بك', 'الإبراهيمية', 'المنتزه'],
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

// Initial default settings
const DEFAULT_SETTINGS: AdminSettings = {
  commissionRate: 10, // 10% from shipping
  maxDebtLimit: 1200, // Maximum allowed debt before suspension in EGP
  defaultShippingPerStore: 15, // EGP shipping fee per merchant
  vodafoneCashNumber: '01099887766',
  instapayAddress: 'bekala.pay@instapay',
  supportPhone: '01022334455',
  supportWhatsapp: '201022334455',
};

// Seed Merchants
const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 'm1',
    name: 'الحاج إبراهيم رضوان',
    storeName: 'سوبرماركت البركة الشامل',
    phone: '01011122233',
    email: 'merchant@bekala.com',
    password: 'merchant123',
    governorate: 'القاهرة',
    district: 'المعادي',
    street: 'شارع 9 الرئيسي',
    building: 'عمارة 45',
    category: 'سوبرماركت كامل',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 180,
    totalSales: 4500,
    completedOrdersCount: 28,
    termsAcceptedAt: '2025-01-10T10:00:00Z',
    debtPayments: [],
  },
  {
    id: 'm2',
    name: 'عماد عبد الله',
    storeName: 'خضار وفاكهة الباشا الطازجة',
    phone: '01122233344',
    email: 'basha.fruits@bekala.com',
    password: 'pass123456',
    governorate: 'القاهرة',
    district: 'المعادي',
    street: 'شارع النصر بجوار ميدان الجزائر',
    building: 'برج الأمل رقم 12',
    category: 'خضار وفواكه',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 90,
    totalSales: 2800,
    completedOrdersCount: 22,
    termsAcceptedAt: '2025-01-12T10:00:00Z',
    debtPayments: [],
  },
  {
    id: 'm3',
    name: 'الشيخ فتحي الحرمين',
    storeName: 'ألبان وجبن الحرمين الفلاحي',
    phone: '01233344455',
    email: 'harameen.dairy@bekala.com',
    password: 'pass123456',
    governorate: 'القاهرة',
    district: 'المعادي',
    street: 'ميدان دجلة',
    building: 'عمارة 8',
    category: 'جبن وألبان',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 120,
    totalSales: 3200,
    completedOrdersCount: 19,
    termsAcceptedAt: '2025-01-15T10:00:00Z',
    debtPayments: [],
  },
  {
    id: 'm4',
    name: 'محمد عبد الرحمن',
    storeName: 'عطارة وبقالة الخير والبركة',
    phone: '01044455566',
    email: 'kheir.spices@bekala.com',
    password: 'pass123456',
    governorate: 'الجيزة',
    district: 'الدقي',
    street: 'شارع مصدق الرئيسي',
    building: 'عمارة النخيل 22',
    category: 'بقالة ومجففات',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 60,
    totalSales: 1900,
    completedOrdersCount: 14,
    termsAcceptedAt: '2025-01-20T10:00:00Z',
    debtPayments: [],
  },
  {
    id: 'm5',
    name: 'سامح نصحي',
    storeName: 'ماركت زهران سموحة',
    phone: '01277788899',
    email: 'zahran.smoha@bekala.com',
    password: 'pass123456',
    governorate: 'الإسكندرية',
    district: 'سموحة',
    street: 'شارع فوزي معاذ',
    building: 'برج الصفوة 15',
    category: 'سوبرماركت كامل',
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500&auto=format&fit=crop&q=80',
    isApproved: true,
    isSuspended: false,
    debtBalance: 45,
    totalSales: 1600,
    completedOrdersCount: 11,
    termsAcceptedAt: '2025-02-01T10:00:00Z',
    debtPayments: [],
  },
];

// Seed Products
const INITIAL_PRODUCTS: Product[] = [
  // Products for m1 (سوبرماركت البركة - القاهرة المعادي)
  {
    id: 'p1',
    merchantId: 'm1',
    merchantName: 'سوبرماركت البركة الشامل',
    name: 'أرز مصري فاخر عريض الحبة (1 كجم)',
    category: 'بقالة ومجففات',
    price: 36,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    description: 'أرز مصري ممتاز أبيض منقى وخالي من الشوائب ومغسول ومعبأ آلياً',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p2',
    merchantId: 'm1',
    merchantName: 'سوبرماركت البركة الشامل',
    name: 'زيت ذرة عافية نقي (800 مل)',
    category: 'بقالة ومجففات',
    price: 88,
    unit: 'قطعة',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    description: 'زيت ذرة نقي 100% غني بالأوميجا وخفيف على المعدة',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p3',
    merchantId: 'm1',
    merchantName: 'سوبرماركت البركة الشامل',
    name: 'سكر أبيض ناعم الأسرة (1 كجم)',
    category: 'بقالة ومجففات',
    price: 38,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80',
    description: 'سكر قصب مكرر أبيض فائق النقاء وسريع الذوبان',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p4',
    merchantId: 'm1',
    merchantName: 'سوبرماركت البركة الشامل',
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
  {
    id: 'p5',
    merchantId: 'm1',
    merchantName: 'سوبرماركت البركة الشامل',
    name: 'مكرونة الملكة أقلام / مرمرية (400 جم)',
    category: 'بقالة ومجففات',
    price: 15,
    unit: 'قطعة',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80',
    description: 'مكرونة مصنوعة من سميد القمح القاسي عالي الجودة',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p6',
    merchantId: 'm1',
    merchantName: 'سوبرماركت البركة الشامل',
    name: 'مسحوق غسيل أوتوماتيك أريال لافندر (2.5 كجم)',
    category: 'سوبرماركت كامل',
    price: 195,
    unit: 'قطعة',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&auto=format&fit=crop&q=80',
    description: 'نظافة فائقة وإزالة أصعب البقع مع انتعاش عطر اللافندر',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },

  // Products for m2 (خضار وفاكهة الباشا - القاهرة المعادي)
  {
    id: 'p7',
    merchantId: 'm2',
    merchantName: 'خضار وفاكهة الباشا الطازجة',
    name: 'طماطم بلدي فرز أول طازجة',
    category: 'خضار وفواكه',
    price: 18,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    description: 'طماطم طازجة حمراء متماسكة مقطوفة طازة صباح اليوم من المزرعة',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p8',
    merchantId: 'm2',
    merchantName: 'خضار وفاكهة الباشا الطازجة',
    name: 'بطاطس تحمير وطبيخ ممتازة (1 كجم)',
    category: 'خضار وفواكه',
    price: 22,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    description: 'بطاطس مقرمشة خفيفة لا تشرب الزيت وصالحة للتحمير والطبيخ',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p9',
    merchantId: 'm2',
    merchantName: 'خضار وفاكهة الباشا الطازجة',
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
  {
    id: 'p10',
    merchantId: 'm2',
    merchantName: 'خضار وفاكهة الباشا الطازجة',
    name: 'موز بلدي مستوي سكري فاخر',
    category: 'خضار وفواكه',
    price: 25,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    description: 'موز بلدي مسكر وطازج ومغذي غني بالبوتاسيوم',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p11',
    merchantId: 'm2',
    merchantName: 'خضار وفاكهة الباشا الطازجة',
    name: 'تفاح أحمر سكري إيطالي فاخر',
    category: 'خضار وفواكه',
    price: 65,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
    description: 'تفاح أحمر مستورد شديد القرمشة وغني بالنكهة السكرية',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p12',
    merchantId: 'm2',
    merchantName: 'خضار وفاكهة الباشا الطازجة',
    name: 'ليمون بلدي أصفر نضر',
    category: 'خضار وفواكه',
    price: 30,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=500&auto=format&fit=crop&q=80',
    description: 'ليمون بلدي حامض غني بالعصير الطبيعي وفيتامين سي',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },

  // Products for m3 (ألبان وجبن الحرمين - القاهرة المعادي)
  {
    id: 'p13',
    merchantId: 'm3',
    merchantName: 'ألبان وجبن الحرمين الفلاحي',
    name: 'جبنة بيضاء براميلي فلاحي قديمة (1 كجم)',
    category: 'جبن وألبان',
    price: 160,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80',
    description: 'جبنة براميلي فلاحي طبيعية 100% مصنوعة من لبن جاموسي معتق',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p14',
    merchantId: 'm3',
    merchantName: 'ألبان وجبن الحرمين الفلاحي',
    name: 'جبنة رومي قديمة بطارخ ممتازة (1 كجم)',
    category: 'جبن وألبان',
    price: 240,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=500&auto=format&fit=crop&q=80',
    description: 'جبنة رومي معتقة نكهة قوية وجودة بطارخ لا تضاهى',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p15',
    merchantId: 'm3',
    merchantName: 'ألبان وجبن الحرمين الفلاحي',
    name: 'حليب بلدي جاموسي فريش كامل الدسم (1 لتر)',
    category: 'جبن وألبان',
    price: 38,
    unit: 'لتر',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    description: 'لبن جاموسي طازج بخيره غير منزوع الدسم ومعقم بعناية',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },
  {
    id: 'p16',
    merchantId: 'm3',
    merchantName: 'ألبان وجبن الحرمين الفلاحي',
    name: 'قشطة فلاحي بلدي طازجة (نصف كيلو)',
    category: 'جبن وألبان',
    price: 95,
    unit: 'علبة',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=500&auto=format&fit=crop&q=80',
    description: 'قشطة بلدي طبيعية ممتازة للحلويات والفطير المشلتت والعسل',
    isAvailable: true,
    governorate: 'القاهرة',
    district: 'المعادي',
  },

  // Products for m4 (الجيزة - الدقي)
  {
    id: 'p17',
    merchantId: 'm4',
    merchantName: 'عطارة وبقالة الخير والبركة',
    name: 'فول تدميس بلدي درجة أولى (1 كجم)',
    category: 'بقالة ومجففات',
    price: 42,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?w=500&auto=format&fit=crop&q=80',
    description: 'فول بلدي سريع النضج قشرة رقيقة ومذاق كهرمان رائع',
    isAvailable: true,
    governorate: 'الجيزة',
    district: 'الدقي',
  },
  {
    id: 'p18',
    merchantId: 'm4',
    merchantName: 'عطارة وبقالة الخير والبركة',
    name: 'عدس أصفر مصري منقى (1 كجم)',
    category: 'بقالة ومجففات',
    price: 55,
    unit: 'كيلو',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80',
    description: 'عدس أصفر نقي سريع الطهي ممتاز لشربة العدس الشتوية',
    isAvailable: true,
    governorate: 'الجيزة',
    district: 'الدقي',
  },

  // Products for m5 (الإسكندرية - سموحة)
  {
    id: 'p19',
    merchantId: 'm5',
    merchantName: 'ماركت زهران سموحة',
    name: 'كرتونة مياه معدنية نسله (12 زجاجة 1.5 لتر)',
    category: 'سوبرماركت كامل',
    price: 96,
    unit: 'كرتونة',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
    description: 'مياه شرب طبيعية نقية معبأة آلياً وفق أعلى معايير الجودة العالمية',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'سموحة',
  },
  {
    id: 'p20',
    merchantId: 'm5',
    merchantName: 'ماركت زهران سموحة',
    name: 'جبن شيدر أحمر مستورد (ربع كيلو)',
    category: 'جبن وألبان',
    price: 85,
    unit: 'قطعة',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80',
    description: 'جبنة شيدر أيرلندية غنية بالنكهة مثالية للسندويتشات والبرجر',
    isAvailable: true,
    governorate: 'الإسكندرية',
    district: 'سموحة',
  },
];

// Seed Delivery Captains
const INITIAL_CAPTAINS: Captain[] = [
  {
    id: 'c1',
    name: 'كابتن أحمد محمود',
    phone: '01012345678',
    governorate: 'القاهرة',
    district: 'المعادي',
    vehicleType: 'موتوسيكل سريع ومجهز بصندوق حفظ',
    isActive: true,
  },
  {
    id: 'c2',
    name: 'كابتن مصطفى علي',
    phone: '01198765432',
    governorate: 'القاهرة',
    district: 'المعادي',
    vehicleType: 'سكوتر كهربائي حديث',
    isActive: true,
  },
  {
    id: 'c3',
    name: 'كابتن كريم سيد',
    phone: '01234567890',
    governorate: 'الجيزة',
    district: 'الدقي',
    vehicleType: 'موتوسيكل بصندوق عازل للحرارة',
    isActive: true,
  },
  {
    id: 'c4',
    name: 'كابتن هاني حسن',
    phone: '01055544433',
    governorate: 'الإسكندرية',
    district: 'سموحة',
    vehicleType: 'سيارة فان صغيرة للتوصيل السريع',
    isActive: true,
  },
];

// Seed Sponsored Ads
const INITIAL_ADS: SponsoredAd[] = [
  {
    id: 'ad1',
    title: 'عروض السوبرماركت الكبرى 🎉',
    subtitle: 'وفر حتى 20% على منتجات البقالة والزيوت مع توصيل سريع في أقل من 35 دقيقة!',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    badgeText: 'عرض خاص وحصري',
    linkText: 'تسوق الآن',
    isActive: true,
    createdAt: '2025-02-10T12:00:00Z',
  },
  {
    id: 'ad2',
    title: 'طازة من الغيط لبيتك 🍎🥦',
    subtitle: 'خضار وفاكهة منتقاة حبة بحبة مع ميثاق الأمانة: استرجاع فوري مجاني إن لم ترضيك!',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&auto=format&fit=crop&q=80',
    badgeText: 'طازة يومياً',
    linkText: 'قسم الخضار والفاكهة',
    isActive: true,
    createdAt: '2025-02-12T12:00:00Z',
  },
  {
    id: 'ad3',
    title: 'مذاق الألبان الفلاحي الأصلي 🧀🥛',
    subtitle: 'جبنة براميلي ورومي وقشطة وزبدة بلدي بخير زمان وبأسعار ممتازة',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1200&auto=format&fit=crop&q=80',
    badgeText: 'ألبان بلدي',
    linkText: 'عرض منتجات الألبان',
    isActive: true,
    createdAt: '2025-02-15T12:00:00Z',
  },
];

// Seed Customer
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust1',
    name: 'أحمد سعيد عبد الفتاح',
    phone: '01099887711',
    email: 'customer@bekala.com',
    password: 'customer123',
    governorate: 'القاهرة',
    district: 'المعادي',
    street: 'شارع 105 متفرع من شارع دجلة',
    building: 'برج الياسمين رقم 14',
    floor: 'الدور الرابع',
    apartment: 'شقة 402',
    notes: 'يرجى رن الجرس مرة واحدة',
    isBlocked: false,
    registeredAt: '2025-01-18T14:00:00Z',
  },
  {
    id: 'cust2',
    name: 'مروة الشريف',
    phone: '01155443322',
    email: 'marwa@gmail.com',
    password: 'customer123',
    governorate: 'الجيزة',
    district: 'الدقي',
    street: 'شارع التحرير',
    building: 'عمارة 18',
    floor: 'الدور الثاني',
    apartment: 'شقة 8',
    isBlocked: false,
    registeredAt: '2025-01-25T11:30:00Z',
  },
];

// Seed Initial Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-7821',
    customerId: 'cust1',
    customerName: 'أحمد سعيد عبد الفتاح',
    customerPhone: '01099887711',
    address: {
      governorate: 'القاهرة',
      district: 'المعادي',
      street: 'شارع 105 متفرع من شارع دجلة',
      building: 'برج الياسمين رقم 14',
      floor: 'الدور الرابع',
      apartment: 'شقة 402',
      notes: 'تسليم سريع من فضلك',
    },
    items: [
      {
        productId: 'p1',
        name: 'أرز مصري فاخر عريض الحبة (1 كجم)',
        price: 36,
        unit: 'كيلو',
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
        merchantId: 'm1',
        merchantName: 'سوبرماركت البركة الشامل',
      },
      {
        productId: 'p2',
        name: 'زيت ذرة عافية نقي (800 مل)',
        price: 88,
        unit: 'قطعة',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
        merchantId: 'm1',
        merchantName: 'سوبرماركت البركة الشامل',
      },
    ],
    merchants: ['m1'],
    merchantsSummary: [
      {
        id: 'm1',
        name: 'سوبرماركت البركة الشامل',
        itemsCount: 3,
        subtotal: 160,
        shipping: 15,
      },
    ],
    itemsSubtotal: 160,
    totalShipping: 15,
    grandTotal: 175,
    platformCommission: 1.5,
    paymentMethod: 'cash_on_delivery',
    status: 'pending', // Starts in pending to demonstrate continuous sound alert!
    createdAt: new Date().toISOString(),
  },
];

// Seed Supervisors
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
  CURRENT_USER_ROLE: 'bekala_current_role',
  CURRENT_MERCHANT_ID: 'bekala_current_merchant_id',
  CURRENT_CUSTOMER_ID: 'bekala_current_customer_id',
  CURRENT_SUPERVISOR_ID: 'bekala_current_supervisor_id',
  SELECTED_LOCATION: 'bekala_selected_location',
};

// Generic safe getters and setters
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
    // Trigger custom event for sync
    window.dispatchEvent(new CustomEvent('bekala_storage_update', { detail: { key } }));
  } catch (e) {
    console.warn(`Error writing ${key} to storage`, e);
  }
}

export const StorageService = {
  // Init database if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.MERCHANTS)) {
      setStored(STORAGE_KEYS.MERCHANTS, INITIAL_MERCHANTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      setStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      setStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
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
      setStored(STORAGE_KEYS.SELECTED_LOCATION, { governorate: 'القاهرة', district: 'المعادي' });
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
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
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
        const commission = (summary.shipping * (settings.commissionRate / 100));
        merchant.debtBalance += commission;
        merchant.totalSales += summary.subtotal;
        
        // Check if debt exceeds limit -> auto freeze if configured
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
    return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
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

  // Suggestions & Inquiries
  getSuggestions(): Suggestion[] {
    return getStored<Suggestion[]>(STORAGE_KEYS.SUGGESTIONS, []);
  },
  addSuggestion(suggestion: Suggestion) {
    const list = [suggestion, ...this.getSuggestions()];
    setStored(STORAGE_KEYS.SUGGESTIONS, list);
  },
  updateSuggestion(updated: Suggestion) {
    const list = this.getSuggestions().map((s) => (s.id === updated.id ? updated : s));
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

  // Active Location Filter
  getSelectedLocation(): { governorate: string; district: string } {
    return getStored(STORAGE_KEYS.SELECTED_LOCATION, { governorate: 'القاهرة', district: 'المعادي' });
  },
  setSelectedLocation(loc: { governorate: string; district: string }) {
    setStored(STORAGE_KEYS.SELECTED_LOCATION, loc);
  },

  // Reset to factory defaults helper
  resetToDefaults() {
    localStorage.clear();
    this.init();
    window.location.reload();
  },
};
