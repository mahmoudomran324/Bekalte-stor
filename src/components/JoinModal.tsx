import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Shield, User as UserIcon } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('أهلاً بكم في شات عربي ✨');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
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
      badgeTitle: 'عضو جديد',
      statusText: statusText.trim() || 'متصل الآن',
      joinedAt: Date.now(),
      lastActive: Date.now(),
      isMuted: false,
      isBanned: false,
    };

    onJoin(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-7 text-right overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Header */}
        <div className="text-center mb-6 pt-2">
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
                <span>تم تجهيز صورتك المخصصة بنجاح!</span>
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
              الحالة / رسالة الترحيب الشخصية (اختياري):
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

          {/* Error Message */}
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>الدخول إلى شات عربي الآن</span>
          </button>
        </form>

        {/* Supervisor / Admin Quick Gateway */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onOpenAdminLogin}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 hover:underline transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>هل أنت مشرف أو مدير؟ تسجيل الدخول للوحة التحكم</span>
          </button>
        </div>
      </div>
    </div>
  );
};
