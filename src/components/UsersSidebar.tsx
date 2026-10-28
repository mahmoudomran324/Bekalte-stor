import React, { useState } from 'react';
import { 
  Users, 
  Crown, 
  ShieldCheck, 
  MessageSquarePlus, 
  X, 
  Search, 
  ShieldAlert, 
  VolumeX, 
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { User, ModeratorPermissions } from '../types/chat';

interface UsersSidebarProps {
  users: User[];
  currentUserId?: string;
  moderatorPermissions: ModeratorPermissions | null;
  onStartPrivateChat: (userId: string) => void;
  onBanUser?: (userId: string, userName: string) => void;
  onMuteUser?: (userId: string, userName: string) => void;
  onUnbanUser?: (userId: string) => void;
  onUnmuteUser?: (userId: string) => void;
  onLogout?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const UsersSidebar: React.FC<UsersSidebarProps> = ({
  users,
  currentUserId,
  moderatorPermissions,
  onStartPrivateChat,
  onBanUser,
  onMuteUser,
  onUnbanUser,
  onUnmuteUser,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const canBan = moderatorPermissions?.canBanUsers;
  const canMute = moderatorPermissions?.canMuteUsers;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.badgeTitle && u.badgeTitle.toLowerCase().includes(search.toLowerCase())) ||
    (u.country && u.country.toLowerCase().includes(search.toLowerCase()))
  );

  const staff = filteredUsers.filter((u) => u.role === 'admin' || u.role === 'moderator');
  const members = filteredUsers.filter((u) => u.role !== 'admin' && u.role !== 'moderator');
  const selfUser = users.find((u) => u.id === currentUserId);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs xl:hidden"
        />
      )}

      <aside
        className={`fixed xl:static inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 xl:translate-x-0 shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200">
            <Users className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-sm">المتواجدون الآن ({users.length})</h2>
          </div>
          <button
            onClick={onCloseMobile}
            className="xl:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث عن عضو أو مشرف..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-8"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* Scrollable Members List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Staff Section */}
          {staff.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block px-2 mb-1.5">
                طاقم الإشراف والإدارة ({staff.length})
              </span>
              <div className="space-y-1">
                {staff.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    isSelf={u.id === currentUserId}
                    onSelect={() => setSelectedUser(u)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Members & Guests */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-1.5">
              الأعضاء والزوار ({members.length})
            </span>
            <div className="space-y-1">
              {members.length === 0 ? (
                <div className="p-3 text-center text-slate-500 text-xs">
                  لا توجد نتائج مطابقة
                </div>
              ) : (
                members.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    isSelf={u.id === currentUserId}
                    onSelect={() => setSelectedUser(u)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Persistent Bottom User Profile & Logout */}
        {selfUser && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={selfUser.avatar}
                    alt={selfUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/60"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {selfUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-400 truncate">
                    {selfUser.badgeTitle || 'متصل الآن'}
                  </p>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-600 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                  title="تسجيل الخروج من الحساب"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* User Detail & Actions Modal */}
        {selectedUser && (
          <div
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 text-right relative animate-fadeIn"
            >
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 left-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                    {selectedUser.name}
                    {selectedUser.role === 'admin' && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    {selectedUser.role === 'moderator' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium">
                    {selectedUser.badgeTitle || (selectedUser.role === 'admin' ? 'مدير عام' : selectedUser.role === 'moderator' ? 'مشرف' : 'عضو')}
                  </p>
                  {selectedUser.country && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      📍 {selectedUser.country}
                    </p>
                  )}
                </div>
              </div>

              {selectedUser.statusText && (
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic mb-4">
                  "{selectedUser.statusText}"
                </div>
              )}

              {/* Status Badges */}
              <div className="flex items-center gap-2 mb-4 text-xs">
                {selectedUser.isBanned && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                    محظور
                  </span>
                )}
                {selectedUser.isMuted && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    مكتوم الصوت
                  </span>
                )}
                {!selectedUser.isBanned && !selectedUser.isMuted && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>نشط في الشات</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {selectedUser.id === currentUserId && onLogout && (
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      onLogout();
                    }}
                    className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>تسجيل الخروج من الحساب</span>
                  </button>
                )}

                {selectedUser.id !== currentUserId && (
                  <button
                    onClick={() => {
                      onStartPrivateChat(selectedUser.id);
                      setSelectedUser(null);
                      onCloseMobile();
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>محادثة خاصة 1 على 1</span>
                  </button>
                )}

                {/* Moderation Controls */}
                {selectedUser.id !== currentUserId && selectedUser.role !== 'admin' && (canBan || canMute) && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <p className="text-[10px] text-slate-400 font-semibold mb-1">
                      صلاحيات الإشراف:
                    </p>
                    {canMute && (
                      <button
                        onClick={() => {
                          if (selectedUser.isMuted) {
                            onUnmuteUser?.(selectedUser.id);
                          } else {
                            onMuteUser?.(selectedUser.id, selectedUser.name);
                          }
                          setSelectedUser(null);
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                          selectedUser.isMuted
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60'
                        }`}
                      >
                        {selectedUser.isMuted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>إلغاء كتم الصوت</span>
                          </>
                        ) : (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>كتم صوت العضو</span>
                          </>
                        )}
                      </button>
                    )}

                    {canBan && (
                      <button
                        onClick={() => {
                          if (selectedUser.isBanned) {
                            onUnbanUser?.(selectedUser.id);
                          } else {
                            onBanUser?.(selectedUser.id, selectedUser.name);
                          }
                          setSelectedUser(null);
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                          selectedUser.isBanned
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                            : 'bg-rose-950/60 text-rose-300 border-rose-800 hover:bg-rose-900/60'
                        }`}
                      >
                        {selectedUser.isBanned ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>فك الحظر عن العضو</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>حظر العضو من الشات</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

const UserRow: React.FC<{
  user: User;
  isSelf: boolean;
  onSelect: () => void;
}> = ({ user, isSelf, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="w-full text-right p-2 rounded-xl hover:bg-slate-800/80 transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <span
            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-slate-900 ${
              user.isBanned
                ? 'bg-rose-500'
                : user.isMuted
                ? 'bg-amber-500'
                : 'bg-emerald-400'
            }`}
          />
        </div>

        <div className="min-w-0 text-right">
          <p className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-300 transition-colors flex items-center gap-1">
            <span>{user.name}</span>
            {isSelf && <span className="text-[10px] text-emerald-400">(أنت)</span>}
          </p>
          <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
            {user.badgeTitle || (user.role === 'admin' ? 'مدير عام' : user.role === 'moderator' ? 'مشرف' : 'عضو')}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1">
        {user.role === 'admin' && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
        {user.role === 'moderator' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
      </div>
    </button>
  );
};
