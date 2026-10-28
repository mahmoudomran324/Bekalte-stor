import React from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-right relative overflow-hidden"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">
              تأكيد تسجيل الخروج
            </h3>
            <p className="text-xs text-slate-400">
              إنهاء جلسة المحادثة الحالية
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          {userName
            ? `عزيزي ${userName}، هل أنت متأكد من رغبتك في تسجيل الخروج من شات عربي؟ سيتم نقلك إلى شاشة تسجيل الدخول.`
            : 'هل أنت متأكد من رغبتك في تسجيل الخروج؟ يمكنك الدخول مجدداً في أي وقت باسم مستعار أو بحساب جيميل.'}
        </p>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-950/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>نعم، تسجيل الخروج</span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
          >
            إلغاء والعودة
          </button>
        </div>
      </div>
    </div>
  );
};
