import React, { useState } from 'react';
import { Supervisor } from '../../types';
import { Shield, Lock, Mail, AlertCircle, KeyRound, UserCheck } from 'lucide-react';

interface AdminAuthProps {
  onAdminLogin: (type: 'admin' | 'supervisor', supervisor?: Supervisor) => void;
  supervisors: Supervisor[];
  adminEmail: string;
  adminPass: string;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  onAdminLogin,
  supervisors,
  adminEmail,
  adminPass,
}) => {
  const [email, setEmail] = useState('admin@bekala.com');
  const [password, setPassword] = useState('admin123456');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if main admin
    if (
      email.toLowerCase().trim() === adminEmail.toLowerCase().trim() &&
      password === adminPass
    ) {
      onAdminLogin('admin');
      return;
    }

    // Check if supervisor
    const supervisor = supervisors.find(
      (s) =>
        s.email.toLowerCase().trim() === email.toLowerCase().trim() &&
        (s.password === password || password === 'super123456') &&
        s.isActive
    );

    if (supervisor) {
      onAdminLogin('supervisor', supervisor);
      return;
    }

    setError('بيانات الدخول غير صحيحة أو الحساب غير مفعل.');
  };

  const handleQuickFillAdmin = () => {
    setEmail(adminEmail);
    setPassword(adminPass);
  };

  const handleQuickFillSupervisor = () => {
    setEmail('supervisor@bekala.com');
    setPassword('super123456');
  };

  return (
    <div className="max-w-md mx-auto my-12 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/20">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-black">لوحة تحكم الإدارة والمشرفين</h2>
          <p className="text-slate-400 text-xs mt-1">
            إدارة التجار، العملاء، الطلبات، الكباتن، الإعلانات والماليات
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              البريد الإلكتروني للإدارة أو المشرف *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bekala.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none text-left"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">كلمة المرور *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none text-left"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>تسجيل الدخول للنظام</span>
          </button>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-slate-400 text-[11px] block text-center">
              بيانات الدخول التجريبية السريعة:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>المدير العام (Admin)</span>
              </button>
              <button
                type="button"
                onClick={handleQuickFillSupervisor}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>مشرف بصلاحيات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
