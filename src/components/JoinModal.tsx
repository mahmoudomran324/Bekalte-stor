import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Shield, 
  User as UserIcon, 
  Mail, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { PRESET_AVATARS, getAvatarDataUri, compressImage } from '../utils/avatars';
import { User } from '../types/chat';

interface JoinModalProps {
  isOpen: boolean;
  onJoin: (user: User) => void;
  onOpenAdminLogin: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onJoin,
  onOpenAdminLogin,
}) => {
  const [loginMode, setLoginMode] = useState<'nickname' | 'gmail'>('nickname');

  // Nickname mode states
  const [name, setName] = useState('');
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('أهلاً بكم في شات عربي ✨');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Gmail mode states
  const [gmailAddress, setGmailAddress] = useState('');
  const [gmailDisplayName, setGmailDisplayName] = useState('');
  const [isAuthenticatingGmail, setIsAuthenticatingGmail] = useState(false);

  if (!isOpen) return null;

  const handleCustomAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      const compressed = await compressImage(file, 400, 0.85);
      setCustomAvatar(compressed);
    } catch {
      setError('تعذر معالجة الصورة، يرجى تجربة صورة أخرى');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('يرجى إدخال اسم مستعار للمشاركة في المحادثة');
      return;
    }
    if (cleanName.length < 2) {
      setError('الاسم يجب أن يتكون من حرفين على الأقل');
      return;
    }

    const finalAvatar = customAvatar || getAvatarDataUri(PRESET_AVATARS[selectedAvatarIndex].svg);

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: cleanName,
      avatar: finalAvatar,
      role: 'member',
      badgeTitle: 'عضو مسجل',
      statusText: statusText.trim() || 'متصل الآن',
      joinedAt: Date.now(),
      lastActive: Date.now(),
      isMuted: false,
      isBanned: false,
    };

    onJoin(newUser);
  };

  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = gmailAddress.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('يرجى إدخال عنوان بريد جيميل صالح ينتهي بـ @gmail.com');
      return;
    }

    setIsAuthenticatingGmail(true);
    setError('');

    setTimeout(() => {
      // Extract username before @
      const inferredName = gmailDisplayName.trim() || cleanEmail.split('@')[0];
      const capitalized = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);

      // Generate a styled avatar with Google lettermark
      const firstLetter = inferredName.charAt(0).toUpperCase();
      const googleAvatarSvg = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#4285F4"/><text x="20" y="26" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">${firstLetter}</text></svg>`;

      const newUser: User = {
        id: `gmail-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now().toString().slice(-4)}`,
        name: capitalized,
        avatar: getAvatarDataUri(googleAvatarSvg),
        role: 'member',
        badgeTitle: 'حساب Gmail موثق',
        statusText: `مسجل عبر ${cleanEmail}`,
        joinedAt: Date.now(),
        lastActive: Date.now(),
        isMuted: false,
        isBanned: false,
      };

      setIsAuthenticatingGmail(false);
      onJoin(newUser);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-7 text-right overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Header */}
        <div className="text-center mb-5 pt-2">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 text-white font-black text-2xl">
            ع
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            أهلاً بك في شات عربي
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            محادثات جماعية راقية، محادثات خاصة بين الأعضاء، ومشاركة فورية للصور
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setLoginMode('nickname');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'nickname'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>اسم مستعار سريع</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode('gmail');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'gmail'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-300" />
            <span>دخول بحساب Gmail</span>
          </button>
        </div>

        {/* MODE 1: NICKNAME & AVATAR */}
        {loginMode === 'nickname' && (
          <form onSubmit={handleNicknameSubmit} className="space-y-4">
            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                اختر صورتك الرمزية أو ارفع صورة خاصة:
              </label>
              <div className="flex items-center justify-center gap-2.5 mb-3">
                {PRESET_AVATARS.map((av, idx) => {
                  const isSelected = !customAvatar && selectedAvatarIndex === idx;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setCustomAvatar(null);
                        setSelectedAvatarIndex(idx);
                      }}
                      className={`relative w-11 h-11 rounded-full p-0.5 transition-all transform hover:scale-105 ${
                        isSelected
                          ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getAvatarDataUri(av.svg)}
                        alt={av.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Custom Avatar Upload Button */}
              <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>رفع صورة من جهازك</span>
                </span>
                <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  {isUploading ? 'جاري الرفع...' : customAvatar ? 'تغيير الصورة' : 'اختيار ملف'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {customAvatar && (
                <div className="flex items-center gap-2 mt-2 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg text-xs text-emerald-300">
                  <img
                    src={customAvatar}
                    alt="Custom"
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                  />
                  <span>تم تجهيز صورتك بنجاح!</span>
                  <button
                    type="button"
                    onClick={() => setCustomAvatar(null)}
                    className="mr-auto text-[11px] text-rose-400 hover:underline"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>

            {/* Nickname Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الاسم المستعار أو اللقب:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="مثال: الباشمهندس، زهرة الياسمين، صقر العرب..."
                  maxLength={24}
                  className="w-full bg-slate-800/90 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-10"
                  autoFocus
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            {/* Mood / Status Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الحالة الشخصية (اختياري):
              </label>
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="اكتب عبارة تعبر عنك..."
                maxLength={40}
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition-all"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>دخول الشات بالاسم المستعار</span>
            </button>
          </form>
        )}

        {/* MODE 2: GMAIL / GOOGLE LOGIN */}
        {loginMode === 'gmail' && (
          <form onSubmit={handleGmailSubmit} className="space-y-4">
            <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-blue-200 leading-relaxed">
              قم بالدخول السريع باستخدام حساب جيميل الخاص بك للمشاركة بهوية موثقة وعضوية مميزة.
            </div>

            {/* Google / Gmail Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                عنوان حساب جيميل (Gmail):
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={gmailAddress}
                  onChange={(e) => {
                    setGmailAddress(e.target.value);
                    setError('');
                  }}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-slate-800/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-10"
                  autoFocus
                  required
                />
                <Mail className="w-4 h-4 text-blue-400 absolute right-3.5 top-3" />
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الظهور في المحادثة (اختياري):
              </label>
              <input
                type="text"
                value={gmailDisplayName}
                onChange={(e) => setGmailDisplayName(e.target.value)}
                placeholder="اتركه فارغاً لاستخدام اسم بريدك"
                maxLength={24}
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-blue-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition-all"
              />
            </div>

            {/* Quick Gmail Preset Selector for easy testing */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                أو اختر تجربة سريعة بنقرة واحدة:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGmailAddress('user.arabi@gmail.com');
                    setGmailDisplayName('عضو شات عربي');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition-colors"
                >
                  user.arabi@gmail.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGmailAddress('vip.friend@gmail.com');
                    setGmailDisplayName('الصديق الوفي');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition-colors"
                >
                  vip.friend@gmail.com
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticatingGmail}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isAuthenticatingGmail ? (
                <span>جاري تسجيل الدخول بحساب Gmail...</span>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  <span>تسجيل الدخول عبر Gmail</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Supervisor / Admin Quick Gateway */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onOpenAdminLogin}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 hover:underline transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>تسجيل دخول الإدارة والمشرفين</span>
          </button>
        </div>
      </div>
    </div>
  );
};
