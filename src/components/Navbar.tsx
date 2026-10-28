import React from 'react';
import { Volume2, VolumeX, Shield, Users, Menu, LogOut, Crown } from 'lucide-react';
import { User, ModeratorRecord } from '../types/chat';

interface NavbarProps {
  currentUser: User | null;
  activeAdmin: ModeratorRecord | null;
  activeRoomName: string;
  onlineCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdminModal: () => void;
  onOpenJoinModal: () => void;
  onLogout: () => void;
  onToggleMobileRooms: () => void;
  onToggleMobileUsers: () => void;
  onStartPrivateWithAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeAdmin,
  activeRoomName,
  onlineCount,
  soundEnabled,
  onToggleSound,
  onOpenAdminModal,
  onOpenJoinModal,
  onLogout,
  onToggleMobileRooms,
  onToggleMobileUsers,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 md:px-6 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Zone 1: Brand & Mobile Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileRooms}
          className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          title="قائمة الغرف"
          aria-label="قائمة الغرف"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-lg">
            ع
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
              شات عربي
              <span className="hidden sm:inline-block text-[10px] font-normal text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                مباشر
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 truncate max-w-[130px] sm:max-w-[200px] mt-0.5">
              {activeRoomName}
            </p>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation & Quick Status */}
      <div className="hidden lg:flex items-center gap-6 text-sm text-slate-300 font-medium">
        <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{onlineCount} متصل الآن في المجتمع</span>
        </span>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1.5 border ${
            soundEnabled
              ? 'text-slate-300 border-slate-700 hover:bg-slate-800'
              : 'text-slate-500 border-slate-800 hover:bg-slate-800'
          }`}
          title={soundEnabled ? 'كتم التنبيهات الصوتية' : 'تشغيل التنبيهات الصوتية'}
          aria-label="تنبيهات الصوت"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Mobile Users Toggle */}
        <button
          onClick={onToggleMobileUsers}
          className="xl:hidden p-2 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
          title="المتواجدون الآن"
          aria-label="المتواجدون"
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-xs tabular-nums">{onlineCount}</span>
        </button>

        {/* Admin / Supervisor Panel Button */}
        <button
          onClick={onOpenAdminModal}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
            activeAdmin
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {activeAdmin?.isRoot ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة الإدارة</span>
            </>
          ) : activeAdmin ? (
            <>
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة الإشراف</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">دخول الإدارة</span>
              <span className="sm:hidden">الإدارة</span>
            </>
          )}
        </button>

        {/* Current User Card or Login */}
        {currentUser ? (
          <div className="flex items-center gap-2 pr-1 pl-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-emerald-500/50"
            />
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-100 max-w-[110px] truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">
                {currentUser.badgeTitle || (currentUser.role === 'admin' ? 'مدير' : currentUser.role === 'moderator' ? 'مشرف' : 'عضو')}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="mr-1.5 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-600 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer"
              title="تسجيل الخروج من الشات"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-[11px] font-bold">خروج</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenJoinModal}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 transition-colors whitespace-nowrap"
          >
            دخول الشات
          </button>
        )}
      </div>
    </header>
  );
};
