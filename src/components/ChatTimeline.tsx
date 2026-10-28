import React, { useRef, useEffect } from 'react';
import { 
  Trash2, 
  ShieldAlert, 
  VolumeX, 
  MessageCircle, 
  Eye, 
  Crown, 
  ShieldCheck, 
  MoreVertical 
} from 'lucide-react';
import { ChatMessage, User, ModeratorPermissions } from '../types/chat';
import { formatArabicTime } from '../utils/avatars';

interface ChatTimelineProps {
  messages: ChatMessage[];
  currentUser: User | null;
  moderatorPermissions: ModeratorPermissions | null;
  onOpenImage: (imageUrl: string, senderName: string, timestamp: number) => void;
  onDeleteMessage?: (messageId: string) => void;
  onBanUser?: (userId: string, userName: string) => void;
  onMuteUser?: (userId: string, userName: string) => void;
  onStartPrivateChat?: (userId: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
  activeContextTitle: string;
  isPrivate: boolean;
}

const COMMON_REACTIONS = ['❤️', '👍', '😂', '👏', '🌹'];

export const ChatTimeline: React.FC<ChatTimelineProps> = ({
  messages,
  currentUser,
  moderatorPermissions,
  onOpenImage,
  onDeleteMessage,
  onBanUser,
  onMuteUser,
  onStartPrivateChat,
  onAddReaction,
  activeContextTitle,
  isPrivate,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canDelete = moderatorPermissions?.canDeleteMessages || currentUser?.role === 'admin';
  const canBan = moderatorPermissions?.canBanUsers || currentUser?.role === 'admin';
  const canMute = moderatorPermissions?.canMuteUsers || currentUser?.role === 'admin';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <MessageCircle className="w-8 h-8 text-emerald-500/80" />
          </div>
          <h3 className="text-base font-bold text-slate-300 mb-1">
            {isPrivate ? 'محادثة خاصة جديدة' : 'لا توجد رسائل هنا بعد'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            {isPrivate
              ? `هذه محادثة خاصة وسرية مع ${activeContextTitle}. أرسل أول رسالة أو صورة لبدء المحادثة.`
              : `كن أول من يبدأ الحديث في ${activeContextTitle} وشارك أصدقاءك التحية!`}
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isMine = currentUser?.id === msg.senderId;
          const isDeleted = msg.isDeleted;
          const isAdminSender = msg.senderRole === 'admin';
          const isModSender = msg.senderRole === 'moderator';

          if (isDeleted) {
            return (
              <div
                key={msg.id}
                className="text-center py-2 px-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-500 italic max-w-md mx-auto"
              >
                تم حذف هذه الرسالة من قبل المشرفين لمخالفتها شروط الشات.
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 group relative ${
                isMine ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* User Avatar */}
              <div className="relative shrink-0">
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800 shadow-sm"
                />
                {isAdminSender && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow" title="مدير عام">
                    <Crown className="w-3 h-3 fill-slate-950" />
                  </span>
                )}
                {!isAdminSender && isModSender && (
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full shadow" title="مشرف">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Message Bubble Content */}
              <div
                className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] flex flex-col ${
                  isMine ? 'items-end' : 'items-start'
                }`}
              >
                {/* Sender Name & Role & Time */}
                <div className="flex items-center gap-2 mb-1 px-1 text-xs">
                  <span
                    onClick={() => {
                      if (!isMine && onStartPrivateChat) {
                        onStartPrivateChat(msg.senderId);
                      }
                    }}
                    className={`font-bold transition-colors ${
                      isAdminSender
                        ? 'text-amber-400'
                        : isModSender
                        ? 'text-emerald-400'
                        : 'text-slate-200'
                    } ${!isMine ? 'cursor-pointer hover:underline' : ''}`}
                    title={!isMine ? 'انقر لبدء محادثة خاصة' : undefined}
                  >
                    {msg.senderName}
                  </span>

                  {msg.senderBadge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        isAdminSender
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : isModSender
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {msg.senderBadge}
                    </span>
                  )}

                  <span className="text-[10px] text-slate-500 tabular-nums">
                    {formatArabicTime(msg.timestamp)}
                  </span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`relative p-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                    isMine
                      ? 'bg-emerald-600 text-white rounded-tl-xs shadow-emerald-900/20'
                      : 'bg-slate-800/95 text-slate-100 border border-slate-700/70 rounded-tr-xs'
                  }`}
                >
                  {/* Attached Image */}
                  {msg.imageUrl && (
                    <div className="mb-2 relative rounded-xl overflow-hidden group/img cursor-pointer bg-slate-950 border border-slate-700/60 max-w-sm">
                      <img
                        src={msg.imageUrl}
                        alt="صورة مرفقة"
                        onClick={() => onOpenImage(msg.imageUrl!, msg.senderName, msg.timestamp)}
                        className="w-full max-h-72 object-cover transition-transform duration-300 group-hover/img:scale-102"
                      />
                      <div
                        onClick={() => onOpenImage(msg.imageUrl!, msg.senderName, msg.timestamp)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>معاينة وتكبير الصورة</span>
                      </div>
                    </div>
                  )}

                  {/* Message Text */}
                  {msg.text && (
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  )}

                  {/* Reactions Summary */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-2 pt-1 border-t border-white/10">
                      {Object.entries(msg.reactions).map(([emoji, users]) => {
                        if (!users.length) return null;
                        return (
                          <button
                            key={emoji}
                            onClick={() => onAddReaction && onAddReaction(msg.id, emoji)}
                            className="text-xs bg-slate-900/70 hover:bg-slate-900 px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-slate-700/80 transition-colors"
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px] tabular-nums font-semibold text-slate-300">
                              {users.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Micro Actions Bar (Reaction & Admin Actions) */}
                <div
                  className={`flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isMine ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Reaction Buttons */}
                  {COMMON_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => onAddReaction && onAddReaction(msg.id, emoji)}
                      className="text-xs p-1 rounded-md hover:bg-slate-800 transition-transform hover:scale-125"
                      title={`تفاعل بـ ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}

                  {/* Moderator & Actions Dropdown */}
                  {((canDelete || canBan || canMute) && !isMine) && (
                    <div className="relative inline-block text-right">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)}
                        className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                        title="خيارات الإشراف"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {activeMenuId === msg.id && (
                        <div
                          onMouseLeave={() => setActiveMenuId(null)}
                          className="absolute bottom-full right-0 mb-1 z-30 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1 text-right text-xs"
                        >
                          {canDelete && (
                            <button
                              onClick={() => {
                                onDeleteMessage?.(msg.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف الرسالة</span>
                            </button>
                          )}
                          {canMute && (
                            <button
                              onClick={() => {
                                onMuteUser?.(msg.senderId, msg.senderName);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg text-amber-400 hover:bg-amber-950/40 flex items-center gap-2 transition-colors"
                            >
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>كتم هذا العضو</span>
                            </button>
                          )}
                          {canBan && (
                            <button
                              onClick={() => {
                                onBanUser?.(msg.senderId, msg.senderName);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg text-rose-500 hover:bg-rose-950/60 font-bold flex items-center gap-2 transition-colors"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>حظر العضو نهائياً</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={scrollEndRef} />
    </div>
  );
};
