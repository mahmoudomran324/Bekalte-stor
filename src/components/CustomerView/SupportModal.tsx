import React, { useState } from 'react';
import { Suggestion } from '../../types';
import {
  X,
  MessageCircle,
  Phone,
  HelpCircle,
  Send,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportPhone: string;
  supportWhatsapp: string;
  onSubmitSuggestion: (s: Suggestion) => void;
  customerName?: string;
  customerPhone?: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  supportPhone,
  supportWhatsapp,
  onSubmitSuggestion,
  customerName = '',
  customerPhone = '',
}) => {
  const [type, setType] = useState<Suggestion['type']>('suggestion');
  const [name, setName] = useState(customerName || '');
  const [phone, setPhone] = useState(customerPhone || '');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    onSubmitSuggestion({
      id: `sug-${Date.now()}`,
      type,
      senderName: name,
      senderPhone: phone,
      senderRole: 'customer',
      message,
      date: new Date().toISOString(),
      status: 'new',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const cleanWhatsapp = supportWhatsapp.replace(/\+/g, '').replace(/^0/, '20');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-300" />
            <div>
              <h3 className="text-lg font-black">الدعم الفني وصندوق المقترحات</h3>
              <p className="text-xs text-emerald-100">
                تواصل مباشر مع الإدارة عبر الواتساب أو أرسل استفسارك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs">
          {/* Direct channels */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                'مرحباً خدمة عملاء بقالة ستور، أريد المساعدة بخصوص...'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex flex-col items-center gap-1.5 transition-colors text-center text-emerald-900 group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">محادثة واتساب مباشرة</span>
              <span className="text-[10px] text-emerald-700">دعم فوري على مدار الساعة</span>
            </a>

            <a
              href={`tel:${supportPhone}`}
              className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center gap-1.5 transition-colors text-center text-slate-800 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">اتصال هاتفي بالإدارة</span>
              <span className="text-[10px] text-slate-500" dir="ltr">
                {supportPhone}
              </span>
            </a>
          </div>

          {/* Form */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>إرسال مقترح أو شكوى لقاعدة بيانات الإدارة</span>
            </h4>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="font-extrabold text-sm text-emerald-950">
                  تم تسجيل رسالتك بنجاح!
                </h5>
                <p className="text-emerald-800 text-xs">
                  تم حفظ الرسالة في لوحة تحكم الإدارة وسيتم الرد عليك في أقرب وقت.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('suggestion')}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-colors ${
                      type === 'suggestion'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    اقتراح تحسين
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('complaint')}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-colors ${
                      type === 'complaint'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    شكوى
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('support')}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-colors ${
                      type === 'support'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    استفسار
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الهاتف"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>

                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب مقترحك أو تفاصيل الشكوى بكل وضوح..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال للإدارة</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
