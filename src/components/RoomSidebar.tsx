import React from 'react';
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  Code, 
  Gamepad2, 
  Lock, 
  Pin, 
  X,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { ChatRoom, ActiveConversation } from '../types/chat';

interface RoomSidebarProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  activePrivateUserId: string | null;
  onSelectRoom: (roomId: string) => void;
  onSelectPrivate: (userId: string) => void;
  privateConversations: ActiveConversation[];
  roomOccupants?: Record<string, number>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const ROOM_ICONS: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
};

export const RoomSidebar: React.FC<RoomSidebarProps> = ({
  rooms,
  activeRoomId,
  activePrivateUserId,
  onSelectRoom,
  onSelectPrivate,
  privateConversations,
  roomOccupants,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 right-0 z-40 w-72 bg-slate-900 border-l border-slate-800 flex flex-col transition-transform duration-300 md:translate-x-0 shrink-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-sm">غرف المحادثة والخاص</h2>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Public Chat Rooms Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                الغرف الجماعية ({rooms.length})
              </span>
            </div>

            <div className="space-y-1">
              {rooms.map((room) => {
                const isActive = activeRoomId === room.id && !activePrivateUserId;
                const icon = ROOM_ICONS[room.icon] || <MessageSquare className="w-4 h-4" />;
                const occupantsCount = roomOccupants?.[room.id] ?? 1;

                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room.id);
                      onCloseMobile();
                    }}
                    className={`w-full text-right p-2.5 rounded-xl transition-all flex items-start gap-2.5 group relative ${
                      isActive
                        ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 border border-transparent'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'
                      }`}
                    >
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-bold text-xs truncate flex items-center gap-1.5 text-slate-100">
                          {room.name}
                          {room.isPinned && (
                            <Pin className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                          {room.isLocked && (
                            <Lock className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                          )}
                        </span>

                        {/* Room Occupants Badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums flex items-center gap-1 border shrink-0 transition-colors ${
                            isActive
                              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                              : 'bg-slate-950/80 text-emerald-400/90 border-slate-700/60'
                          }`}
                          title={`${occupantsCount} متواجد حالياً في غرفة ${room.name}`}
                        >
                          <Users className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{occupantsCount} متواجد</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                          {room.description}
                        </p>
                        <span className="text-[10px] text-slate-500 font-normal shrink-0">
                          {room.category}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Private 1-on-1 Conversations Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>المحادثات الخاصة ({privateConversations.length})</span>
              </span>
            </div>

            {privateConversations.length === 0 ? (
              <div className="p-3 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-500 text-xs">
                لا توجد محادثات خاصة بعد. اختر أي مستخدم من قائمة المتواجدين لبدء محادثة سرية وخاصة!
              </div>
            ) : (
              <div className="space-y-1">
                {privateConversations.map((conv) => {
                  const isActive = activePrivateUserId === conv.userId;
                  return (
                    <button
                      key={conv.userId}
                      onClick={() => {
                        onSelectPrivate(conv.userId);
                        onCloseMobile();
                      }}
                      className={`w-full text-right p-2 rounded-xl transition-all flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 border border-transparent'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.user.avatar}
                          alt={conv.user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate">
                            {conv.user.name}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full tabular-nums shadow-sm animate-pulse">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {conv.lastMessage?.text || 'محادثة خاصة'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center text-[11px] text-slate-500">
          <span>شات عربي · غرف عامة ومحادثات خاصة</span>
        </div>
      </aside>
    </>
  );
};
