import React, { useState } from 'react';
import { 
  Shield, 
  Crown, 
  Users, 
  MessageSquare, 
  Image as ImageIcon, 
  UserPlus, 
  Trash2, 
  Lock, 
  Unlock, 
  X, 
  Check, 
  AlertTriangle, 
  LogOut, 
  VolumeX, 
  ShieldAlert, 
  GitBranch, 
  ExternalLink,
  Edit,
  Sparkles,
  Plus
} from 'lucide-react';
import { 
  ModeratorRecord, 
  User, 
  ChatRoom, 
  ChatMessage, 
  ModeratorPermissions 
} from '../types/chat';
import { formatArabicTime } from '../utils/avatars';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeAdmin: ModeratorRecord | null;
  onLogin: (email: string, pass: string) => { success: boolean; error?: string };
  onLogout: () => void;
  moderators: ModeratorRecord[];
  onAddModerator: (mod: Omit<ModeratorRecord, 'id' | 'createdAt'>) => void;
  onUpdateModerator: (id: string, updates: Partial<ModeratorRecord>) => void;
  onDeleteModerator: (id: string) => void;
  users: User[];
  onBanUser: (userId: string, userName: string) => void;
  onUnbanUser: (userId: string) => void;
  onMuteUser: (userId: string, userName: string) => void;
  onUnmuteUser: (userId: string) => void;
  rooms: ChatRoom[];
  onAddRoom: (room: Omit<ChatRoom, 'id'>) => void;
  onToggleLockRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
  allMessages: ChatMessage[];
  onDeleteMessage: (msgId: string) => void;
  onTriggerGitHubSync?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  activeAdmin,
  onLogin,
  onLogout,
  moderators,
  onAddModerator,
  onUpdateModerator,
  onDeleteModerator,
  users,
  onBanUser,
  onUnbanUser,
  onMuteUser,
  onUnmuteUser,
  rooms,
  onAddRoom,
  onToggleLockRoom,
  onDeleteRoom,
  allMessages,
  onDeleteMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'mods' | 'users' | 'rooms' | 'media' | 'github'>('mods');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mod Creation Form Modal
  const [showAddModModal, setShowAddModModal] = useState(false);
  const [editingModId, setEditingModId] = useState<string | null>(null);
  const [modName, setModName] = useState('');
  const [modEmail, setModEmail] = useState('');
  const [modPass, setModPass] = useState('');
  const [modBadge, setModBadge] = useState('مشرف غرف');
  const [modPerms, setModPerms] = useState<ModeratorPermissions>({
    canBanUsers: true,
    canMuteUsers: true,
    canDeleteMessages: true,
    canManageRooms: false,
    canAuditMedia: true,
    canManageMods: false,
  });

  // Room Creation Form Modal
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomCat, setNewRoomCat] = useState('عام');
  const [newRoomTopic, setNewRoomTopic] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = onLogin(loginEmail.trim(), loginPass);
    if (!res.success) {
      setLoginError(res.error || 'بيانات الدخول غير صحيحة');
    }
  };

  const handleSaveMod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modName.trim() || !modEmail.trim() || (!editingModId && !modPass.trim())) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (editingModId) {
      onUpdateModerator(editingModId, {
        name: modName.trim(),
        email: modEmail.trim(),
        badgeTitle: modBadge.trim(),
        permissions: modPerms,
        ...(modPass.trim() ? { password: modPass.trim() } : {}),
      });
    } else {
      onAddModerator({
        name: modName.trim(),
        email: modEmail.trim(),
        password: modPass.trim(),
        badgeTitle: modBadge.trim() || 'مشرف معتمد',
        permissions: modPerms,
      });
    }

    setShowAddModModal(false);
    setEditingModId(null);
    setModName('');
    setModEmail('');
    setModPass('');
  };

  const openEditMod = (mod: ModeratorRecord) => {
    setEditingModId(mod.id);
    setModName(mod.name);
    setModEmail(mod.email);
    setModPass('');
    setModBadge(mod.badgeTitle);
    setModPerms(mod.permissions);
    setShowAddModModal(true);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) {
      alert('يرجى إدخال اسم الغرفة');
      return;
    }
    onAddRoom({
      name: newRoomName.trim(),
      description: newRoomDesc.trim() || 'غرفة جديدة في شات عربي',
      category: newRoomCat.trim() || 'عام',
      icon: 'MessageSquare',
      isLocked: false,
      topic: newRoomTopic.trim(),
    });
    setNewRoomName('');
    setNewRoomDesc('');
    setNewRoomTopic('');
    setShowAddRoomModal(false);
  };

  // Uploaded media extracted from messages
  const mediaList = allMessages.filter((m) => m.imageUrl && !m.isDeleted);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Panel Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>لوحة تحكم شات عربي</span>
                {activeAdmin && (
                  <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full">
                    {activeAdmin.isRoot ? 'المدير العام (Root)' : activeAdmin.badgeTitle}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                إدارة المشرفين، صلاحيات الأعضاء، غرف المحادثة ومراقبة الصور المرفوعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeAdmin && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تسجيل خروج الإدارة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In -> Show Login Box */}
        {!activeAdmin ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-md bg-slate-950/90 border border-slate-800 p-6 sm:p-7 rounded-2xl shadow-xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  تسجيل دخول الإدارة والمشرفين
                </h3>
                <p className="text-xs text-slate-400">
                  يرجى إدخال البريد الإلكتروني وكلمة المرور الخاصة بحساب الإدارة
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    البريد الإلكتروني للإدارة:
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="mahmoudomran324@gmail.com"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    كلمة المرور (باسورد):
                  </label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                    {loginError}
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 leading-relaxed">
                  💡 بيانات المدير العام الافتراضية:
                  <div className="mt-1 font-mono text-[11px] text-slate-300">
                    البريد: mahmoudomran324@gmail.com
                    <br />
                    الباسورد: 123456
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>دخول لوحة التحكم</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In -> Full Tabs & Capabilities */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation Tabs */}
            <div className="w-full md:w-56 bg-slate-950/60 border-b md:border-b-0 md:border-l border-slate-800 p-2 md:p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('mods')}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'mods'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>المشرفون والصلاحيات</span>
                <span className="mr-auto text-[10px] tabular-nums bg-slate-800 px-1.5 py-0.2 rounded-full">
                  {moderators.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>إدارة المستخدمين والحظر</span>
                <span className="mr-auto text-[10px] tabular-nums bg-slate-800 px-1.5 py-0.2 rounded-full">
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('rooms')}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'rooms'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>إدارة الغرف والموضوعات</span>
                <span className="mr-auto text-[10px] tabular-nums bg-slate-800 px-1.5 py-0.2 rounded-full">
                  {rooms.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'media'
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
                <span>معرض وتدقيق الصور</span>
                <span className="mr-auto text-[10px] tabular-nums bg-slate-800 px-1.5 py-0.2 rounded-full">
                  {mediaList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('github')}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'github'
                    ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-4 h-4 text-blue-400 shrink-0" />
                <span>مستودع جيت هاب (GitHub)</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/60">
              {/* TAB 1: MODERATORS & PERMISSIONS */}
              {activeTab === 'mods' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>قائمة المشرفين والصلاحيات</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          (إضافة وتعديل وحذف المشرفين)
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        المدير العام يمتلك كامل الصلاحيات، ويمكنه تعيين مشرفين فرعيين وتحديد مهامهم بدقة
                      </p>
                    </div>

                    {(activeAdmin.isRoot || activeAdmin.permissions.canManageMods) && (
                      <button
                        onClick={() => {
                          setEditingModId(null);
                          setModName('');
                          setModEmail('');
                          setModPass('');
                          setModBadge('مشرف غرف');
                          setModPerms({
                            canBanUsers: true,
                            canMuteUsers: true,
                            canDeleteMessages: true,
                            canManageRooms: false,
                            canAuditMedia: true,
                            canManageMods: false,
                          });
                          setShowAddModModal(true);
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>إضافة مشرف جديد</span>
                      </button>
                    )}
                  </div>

                  {/* Moderators Table / List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {moderators.map((mod) => (
                      <div
                        key={mod.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          mod.isRoot
                            ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                            : 'bg-slate-950/70 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                              {mod.isRoot ? <Crown className="w-5 h-5 fill-amber-400" /> : <Shield className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                                <span>{mod.name}</span>
                                {mod.isRoot && (
                                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                                    المدير العام
                                  </span>
                                )}
                              </h4>
                              <p className="text-[11px] text-amber-400/90 font-medium">
                                {mod.badgeTitle}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {mod.email}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons for non-root moderators */}
                          {!mod.isRoot && (activeAdmin.isRoot || activeAdmin.permissions.canManageMods) && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditMod(mod)}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                                title="تعديل الصلاحيات واللقب"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف المشرف "${mod.name}" وإلغاء صلاحياته؟`)) {
                                    onDeleteModerator(mod.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                                title="حذف المشرف نهائياً"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Permissions Tags */}
                        <div className="border-t border-slate-800/80 pt-2.5">
                          <p className="text-[10px] font-semibold text-slate-400 mb-1.5">
                            الصلاحيات الممنوحة:
                          </p>
                          <div className="flex flex-wrap gap-1.5 text-[10px]">
                            <PermissionBadge active={mod.permissions.canBanUsers} label="حظر المستخدمين" />
                            <PermissionBadge active={mod.permissions.canMuteUsers} label="كتم الصوت" />
                            <PermissionBadge active={mod.permissions.canDeleteMessages} label="حذف الرسائل" />
                            <PermissionBadge active={mod.permissions.canManageRooms} label="إدارة الغرف" />
                            <PermissionBadge active={mod.permissions.canAuditMedia} label="مراقبة الصور" />
                            {mod.isRoot && <PermissionBadge active={true} label="إدارة المشرفين (Root)" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: USERS & BANNING */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        إدارة المتواجدين وعقوبات الحظر والكتم
                      </h3>
                      <p className="text-xs text-slate-400">
                        التحكم الفوري في وصول المستخدمين وكتم صوت المخالفين أو طردهم
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-slate-800">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-white">
                                  {u.name}
                                </span>
                                {u.isBanned && (
                                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded">
                                    محظور
                                  </span>
                                )}
                                {u.isMuted && (
                                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded">
                                    مكتوم
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {u.badgeTitle || u.role} · {u.country || 'مستخدم عام'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Mute Toggle */}
                            {activeAdmin.permissions.canMuteUsers && (
                              <button
                                onClick={() => {
                                  if (u.isMuted) onUnmuteUser(u.id);
                                  else onMuteUser(u.id, u.name);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                                  u.isMuted
                                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800 hover:bg-emerald-900/50'
                                    : 'bg-amber-950/50 text-amber-300 border-amber-800 hover:bg-amber-900/50'
                                }`}
                              >
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>{u.isMuted ? 'إلغاء الكتم' : 'كتم'}</span>
                              </button>
                            )}

                            {/* Ban Toggle */}
                            {activeAdmin.permissions.canBanUsers && (
                              <button
                                onClick={() => {
                                  if (u.isBanned) onUnbanUser(u.id);
                                  else onBanUser(u.id, u.name);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-colors ${
                                  u.isBanned
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                                    : 'bg-rose-950/60 text-rose-300 border-rose-800 hover:bg-rose-900/60'
                                }`}
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>{u.isBanned ? 'فك الحظر' : 'حظر العضو'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ROOMS MANAGEMENT */}
              {activeTab === 'rooms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        إدارة الغرف والموضوعات
                      </h3>
                      <p className="text-xs text-slate-400">
                        إنشاء غرف جديدة، قفل الغرف للصيانة، وتحديث عناوين النقاش
                      </p>
                    </div>

                    {activeAdmin.permissions.canManageRooms && (
                      <button
                        onClick={() => setShowAddRoomModal(true)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة غرفة جديدة</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">
                              {room.name}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                              {room.category}
                            </span>
                            {room.isLocked && (
                              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>مغلقة</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {room.description}
                          </p>
                          {room.topic && (
                            <p className="text-[10px] text-emerald-400/90 mt-0.5">
                              📌 موضوع الغرفة: {room.topic}
                            </p>
                          )}
                        </div>

                        {activeAdmin.permissions.canManageRooms && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleLockRoom(room.id)}
                              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                                room.isLocked
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                              title={room.isLocked ? 'فتح الغرفة' : 'قفل الغرفة'}
                            >
                              {room.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>

                            {room.id !== 'general' && (
                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف الغرفة "${room.name}"؟`)) {
                                    onDeleteRoom(room.id);
                                  }
                                }}
                                className="p-2 rounded-lg text-rose-400 bg-rose-950/30 border border-rose-800 hover:bg-rose-900/40 transition-colors"
                                title="حذف الغرفة"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA AUDIT (معرض ومراقبة الصور) */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>معرض وتدقيق الصور المرفوعة</span>
                        <span className="text-xs text-purple-400 font-mono">
                          ({mediaList.length} صورة)
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        مراقبة جميع الصور التي تم إرسالها داخل المحادثات العامة والخاصة مع إمكانية حذف أي صورة مخالفة فوراً
                      </p>
                    </div>
                  </div>

                  {mediaList.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-500 text-xs">
                      لم يتم رفع أي صور في المحادثات بعد. الصور الجديدة ستظهر هنا تلقائياً لتدقيقها.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {mediaList.map((msg) => (
                        <div
                          key={msg.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group relative flex flex-col"
                        >
                          <div className="relative aspect-square overflow-hidden bg-slate-900">
                            <img
                              src={msg.imageUrl}
                              alt="صورة مرفوعة"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <button
                              onClick={() => {
                                if (confirm('هل أنت متأكد من حذف هذه الصورة من الشات فوراً؟')) {
                                  onDeleteMessage(msg.id);
                                }
                              }}
                              className="absolute top-2 left-2 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title="حذف الصورة المخالفة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="p-2 text-[11px] bg-slate-950/90 text-right">
                            <p className="font-bold text-slate-200 truncate">
                              {msg.senderName}
                            </p>
                            <p className="text-[10px] text-slate-500 tabular-nums">
                              {formatArabicTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GITHUB SYNC (مستودع جيت هاب) */}
              {activeTab === 'github' && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                        <GitBranch className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          مستودع المشروع على جيت هاب (GitHub Repository)
                        </h4>
                        <p className="text-xs text-slate-400">
                          تم ربط الكود المصدري الكامل مع المستودع الخاص بك بنجاح
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">رابط المستودع:</span>
                        <a
                          href="https://github.com/mahmoudomran324/Bekalte-stor.git"
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>https://github.com/mahmoudomran324/Bekalte-stor.git</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">الفرع الرئيسي:</span>
                        <span className="text-cyan-400 font-bold">main</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">حساب المالك:</span>
                        <span className="text-white">mahmoudomran324</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">حالة المزامنة:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>جاهز للدفع والتحديث التلقائي</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300/90 leading-relaxed font-sans">
                      💡 تم تكوين وتضمين أوامر الرفع التلقائي عبر التوكن الخاص بك:
                      <div className="mt-1 font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg">
                        git remote add origin https://github.com/mahmoudomran324/Bekalte-stor.git
                        <br />
                        git push -u origin main
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT MODERATOR */}
        {showAddModModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-right animate-fadeIn">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>{editingModId ? 'تعديل صلاحيات المشرف' : 'إضافة مشرف جديد'}</span>
                </h4>
                <button
                  onClick={() => setShowAddModModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMod} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    اسم المشرف:
                  </label>
                  <input
                    type="text"
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                    placeholder="مثال: أحمد المراقب"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    البريد الإلكتروني لدخول المشرف:
                  </label>
                  <input
                    type="email"
                    value={modEmail}
                    onChange={(e) => setModEmail(e.target.value)}
                    placeholder="mod@chatarabi.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {editingModId ? 'كلمة المرور الجديدة (اتركه فارغاً للإبقاء عليها):' : 'كلمة المرور:'}
                  </label>
                  <input
                    type="password"
                    value={modPass}
                    onChange={(e) => setModPass(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    {...(!editingModId ? { required: true } : {})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    اللقب / المسمى الإشرافي:
                  </label>
                  <input
                    type="text"
                    value={modBadge}
                    onChange={(e) => setModBadge(e.target.value)}
                    placeholder="مثال: مراقب محتوى، مشرف غرف، مشرف عام"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Granular Permission Checkboxes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    تحديد الصلاحيات الممنوحة:
                  </label>
                  <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modPerms.canBanUsers}
                        onChange={(e) => setModPerms({ ...modPerms, canBanUsers: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className="text-slate-200">حظر وفك حظر المستخدمين المخالفين</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modPerms.canMuteUsers}
                        onChange={(e) => setModPerms({ ...modPerms, canMuteUsers: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className="text-slate-200">كتم صوت الأعضاء مؤقتاً</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modPerms.canDeleteMessages}
                        onChange={(e) => setModPerms({ ...modPerms, canDeleteMessages: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className="text-slate-200">حذف الرسائل المسيئة من المحادثة</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modPerms.canAuditMedia}
                        onChange={(e) => setModPerms({ ...modPerms, canAuditMedia: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className="text-slate-200">تدقيق وحذف الصور المخالفة</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modPerms.canManageRooms}
                        onChange={(e) => setModPerms({ ...modPerms, canManageRooms: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className="text-slate-200">إنشاء وتعديل وقفل غرف المحادثة</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                  >
                    {editingModId ? 'حفظ التعديلات' : 'إضافة المشرف الآن'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModModal(false)}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD ROOM */}
        {showAddRoomModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-right animate-fadeIn">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>إضافة غرفة محادثة جديدة</span>
                </h4>
                <button
                  onClick={() => setShowAddRoomModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    اسم الغرفة:
                  </label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="مثال: مقهى الرياضيين، ركن الموسيقى..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    تصنيف الغرفة:
                  </label>
                  <input
                    type="text"
                    value={newRoomCat}
                    onChange={(e) => setNewRoomCat(e.target.value)}
                    placeholder="مثال: رياضة، ترفيه، عام"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    وصف مختصر للغرفة:
                  </label>
                  <input
                    type="text"
                    value={newRoomDesc}
                    onChange={(e) => setNewRoomDesc(e.target.value)}
                    placeholder="نبذة تشرح موضوع المحادثة في هذه الغرفة"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الموضوع المثبت في رأس الغرفة (اختياري):
                  </label>
                  <input
                    type="text"
                    value={newRoomTopic}
                    onChange={(e) => setNewRoomTopic(e.target.value)}
                    placeholder="رسالة أو سؤال مثبت لأعضاء الغرفة"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    إنشاء الغرفة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRoomModal(false)}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PermissionBadge: React.FC<{ active: boolean; label: string }> = ({ active, label }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
        active
          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
          : 'bg-slate-900 text-slate-500 border border-slate-800 line-through'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
      <span>{label}</span>
    </span>
  );
};
