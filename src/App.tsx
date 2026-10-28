import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RoomSidebar } from './components/RoomSidebar';
import { ChatTimeline } from './components/ChatTimeline';
import { ChatInput } from './components/ChatInput';
import { UsersSidebar } from './components/UsersSidebar';
import { JoinModal } from './components/JoinModal';
import { ImageLightbox } from './components/ImageLightbox';
import { AdminPanel } from './components/AdminPanel';
import { 
  User, 
  ChatRoom, 
  ChatMessage, 
  ModeratorRecord, 
  ActiveConversation 
} from './types/chat';
import { 
  DEFAULT_ROOMS, 
  INITIAL_MEMBERS, 
  INITIAL_MESSAGES, 
  ROOT_ADMIN, 
  STORAGE_KEYS, 
  loadFromStorage, 
  saveToStorage, 
  broadcastEvent, 
  subscribeBroadcast 
} from './utils/storage';
import { playSound } from './utils/audio';
import { getDefaultAvatar } from './utils/avatars';
import { MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  // 1. Current logged-in user state
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
  );

  // 2. Active supervisor/admin session
  const [activeAdmin, setActiveAdmin] = useState<ModeratorRecord | null>(null);

  // 3. Moderators list (Root admin + customized staff)
  const [moderators, setModerators] = useState<ModeratorRecord[]>(() =>
    loadFromStorage<ModeratorRecord[]>(STORAGE_KEYS.MODERATORS, [ROOT_ADMIN])
  );

  // 4. Rooms list
  const [rooms, setRooms] = useState<ChatRoom[]>(() =>
    loadFromStorage<ChatRoom[]>(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS)
  );

  // 5. Messages stream
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES)
  );

  // 6. Active community members
  const [users, setUsers] = useState<User[]>(() => {
    const saved = loadFromStorage<User[]>(STORAGE_KEYS.ACTIVE_USERS, INITIAL_MEMBERS);
    return saved.length ? saved : INITIAL_MEMBERS;
  });

  // 7. Navigation state
  const [activeRoomId, setActiveRoomId] = useState<string>('general');
  const [activePrivateUserId, setActivePrivateUserId] = useState<string | null>(null);

  // 8. Modals & Drawers
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const [mobileUsersOpen, setMobileUsersOpen] = useState(false);

  // 9. Lightbox
  const [lightboxData, setLightboxData] = useState<{
    url: string;
    senderName: string;
    timestamp: number;
  } | null>(null);

  // 10. Sound preferences
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    loadFromStorage<boolean>(STORAGE_KEYS.SOUND_ENABLED, true)
  );

  // Persist key state
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ROOMS, rooms);
  }, [rooms]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MODERATORS, moderators);
  }, [moderators]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_USERS, users);
  }, [users]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
  }, [soundEnabled]);

  // Open join modal initially if visitor hasn't chosen a nickname yet
  useEffect(() => {
    if (!currentUser) {
      setIsJoinModalOpen(true);
    }
  }, [currentUser]);

  // Handle multi-tab live sync via BroadcastChannel
  useEffect(() => {
    const unsubscribe = subscribeBroadcast((event) => {
      if (event.type === 'NEW_MESSAGE') {
        const msg = event.payload as ChatMessage;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        playSound('receive', soundEnabled);
      } else if (event.type === 'DELETE_MESSAGE') {
        const msgId = event.payload as string;
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, isDeleted: true } : m))
        );
      } else if (event.type === 'UPDATE_USER_STATUS') {
        const { userId, isBanned, isMuted } = event.payload as {
          userId: string;
          isBanned?: boolean;
          isMuted?: boolean;
        };
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              return {
                ...u,
                ...(isBanned !== undefined ? { isBanned } : {}),
                ...(isMuted !== undefined ? { isMuted } : {}),
              };
            }
            return u;
          })
        );
        setCurrentUser((curr) => {
          if (curr && curr.id === userId) {
            return {
              ...curr,
              ...(isBanned !== undefined ? { isBanned } : {}),
              ...(isMuted !== undefined ? { isMuted } : {}),
            };
          }
          return curr;
        });
      } else if (event.type === 'SYNC_ROOMS') {
        setRooms(event.payload as ChatRoom[]);
      } else if (event.type === 'SYNC_MODERATORS') {
        setModerators(event.payload as ModeratorRecord[]);
      }
    });

    return unsubscribe;
  }, [soundEnabled]);

  // Helper to ensure current user is in active users list
  useEffect(() => {
    if (currentUser) {
      setUsers((prev) => {
        const exists = prev.some((u) => u.id === currentUser.id);
        if (!exists) {
          return [currentUser, ...prev];
        }
        return prev.map((u) => (u.id === currentUser.id ? currentUser : u));
      });
    }
  }, [currentUser]);

  // Simulated smart replies for active community feel
  const triggerSimulatedReply = useCallback(
    (context: 'room' | 'private', targetId: string, userText: string) => {
      const activeCandidate = users.find((u) => u.isSimulated && u.id !== currentUser?.id);
      if (!activeCandidate) return;

      const responses = [
        'أهلاً بك وسهلاً! منور الشات 🌹',
        'مرحباً صديقي، تسعدنا مشاركتك الرائعة معنا في شات عربي.',
        'كلام جميل وموزون، شكراً لمشاركتك!',
        'ما شاء الله، شات عربي يجمعنا على المحبة والخير دائماً.',
        'أهلاً وسهلاً، كيف حالك اليوم؟ أتمنى لك وقتاً طيباً.',
      ];

      const chosenText = responses[Math.floor(Math.random() * responses.length)];

      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `sim-msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          roomId: context === 'room' ? targetId : undefined,
          recipientId: context === 'private' ? currentUser?.id : undefined,
          senderId: activeCandidate.id,
          senderName: activeCandidate.name,
          senderAvatar: activeCandidate.avatar,
          senderRole: activeCandidate.role,
          senderBadge: activeCandidate.badgeTitle,
          text: chosenText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, replyMsg]);
        broadcastEvent({ type: 'NEW_MESSAGE', payload: replyMsg });

        if (context === 'private') {
          playSound('notification', soundEnabled);
        } else {
          playSound('receive', soundEnabled);
        }
      }, 1800 + Math.random() * 1500);
    },
    [users, currentUser, soundEnabled]
  );

  // Send message handler (Group room or Private DM)
  const handleSendMessage = (text: string, imageUrl?: string) => {
    if (!currentUser) {
      setIsJoinModalOpen(true);
      return;
    }

    if (currentUser.isBanned) {
      alert('حسابك محظور من الإرسال في الشات.');
      return;
    }

    if (currentUser.isMuted) {
      alert('أنت مكتوم الصوت حالياً من قبل المشرفين.');
      return;
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      roomId: !activePrivateUserId ? activeRoomId : undefined,
      recipientId: activePrivateUserId || undefined,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: activeAdmin ? (activeAdmin.isRoot ? 'admin' : 'moderator') : currentUser.role,
      senderBadge: activeAdmin
        ? activeAdmin.badgeTitle
        : currentUser.badgeTitle,
      text,
      imageUrl,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    broadcastEvent({ type: 'NEW_MESSAGE', payload: newMessage });
    playSound('send', soundEnabled);

    // Trigger simulation if chatting with bot/community member
    if (activePrivateUserId) {
      const privatePartner = users.find((u) => u.id === activePrivateUserId);
      if (privatePartner?.isSimulated) {
        triggerSimulatedReply('private', activePrivateUserId, text);
      }
    } else {
      // 50% chance of community response in public room
      if (Math.random() > 0.4) {
        triggerSimulatedReply('room', activeRoomId, text);
      }
    }
  };

  // Reactions handler
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const reactions = { ...(m.reactions || {}) };
        const userList = reactions[emoji] || [];
        if (userList.includes(currentUser.id)) {
          reactions[emoji] = userList.filter((id) => id !== currentUser.id);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...userList, currentUser.id];
        }
        return { ...m, reactions };
      })
    );
    playSound('action', soundEnabled);
  };

  // Delete message (Admin / Mod)
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isDeleted: true } : m))
    );
    broadcastEvent({ type: 'DELETE_MESSAGE', payload: messageId });
  };

  // Ban user
  const handleBanUser = (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حظر المستخدم "${userName}"؟ لن يتمكن من المشاركة.`)) {
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: true } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((c) => (c ? { ...c, isBanned: true } : null));
    }
    broadcastEvent({
      type: 'UPDATE_USER_STATUS',
      payload: { userId, isBanned: true },
    });
  };

  // Unban user
  const handleUnbanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: false } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((c) => (c ? { ...c, isBanned: false } : null));
    }
    broadcastEvent({
      type: 'UPDATE_USER_STATUS',
      payload: { userId, isBanned: false },
    });
  };

  // Mute user
  const handleMuteUser = (userId: string, userName: string) => {
    if (!confirm(`هل تريد كتم صوت المستخدم "${userName}" مؤقتاً؟`)) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isMuted: true } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((c) => (c ? { ...c, isMuted: true } : null));
    }
    broadcastEvent({
      type: 'UPDATE_USER_STATUS',
      payload: { userId, isMuted: true },
    });
  };

  // Unmute user
  const handleUnmuteUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isMuted: false } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((c) => (c ? { ...c, isMuted: false } : null));
    }
    broadcastEvent({
      type: 'UPDATE_USER_STATUS',
      payload: { userId, isMuted: false },
    });
  };

  // Supervisor Management
  const handleAddModerator = (newModData: Omit<ModeratorRecord, 'id' | 'createdAt'>) => {
    const newMod: ModeratorRecord = {
      ...newModData,
      id: `mod-${Date.now()}`,
      createdAt: Date.now(),
    };
    const updated = [...moderators, newMod];
    setModerators(updated);
    broadcastEvent({ type: 'SYNC_MODERATORS', payload: updated });
    alert(`تمت إضافة المشرف "${newMod.name}" بنجاح!`);
  };

  const handleUpdateModerator = (id: string, updates: Partial<ModeratorRecord>) => {
    const updated = moderators.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setModerators(updated);
    broadcastEvent({ type: 'SYNC_MODERATORS', payload: updated });
    if (activeAdmin && activeAdmin.id === id) {
      setActiveAdmin({ ...activeAdmin, ...updates });
    }
    alert('تم تحديث بيانات وصلاحيات المشرف بنجاح');
  };

  const handleDeleteModerator = (id: string) => {
    const target = moderators.find((m) => m.id === id);
    if (target?.isRoot) {
      alert('لا يمكن حذف حساب المدير العام الأساسي!');
      return;
    }
    const updated = moderators.filter((m) => m.id !== id);
    setModerators(updated);
    broadcastEvent({ type: 'SYNC_MODERATORS', payload: updated });
  };

  // Room Management
  const handleAddRoom = (newRoomData: Omit<ChatRoom, 'id'>) => {
    const newRoom: ChatRoom = {
      ...newRoomData,
      id: `room-${Date.now()}`,
    };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    broadcastEvent({ type: 'SYNC_ROOMS', payload: updated });
    setActiveRoomId(newRoom.id);
    setActivePrivateUserId(null);
  };

  const handleToggleLockRoom = (roomId: string) => {
    const updated = rooms.map((r) =>
      r.id === roomId ? { ...r, isLocked: !r.isLocked } : r
    );
    setRooms(updated);
    broadcastEvent({ type: 'SYNC_ROOMS', payload: updated });
  };

  const handleDeleteRoom = (roomId: string) => {
    const updated = rooms.filter((r) => r.id !== roomId);
    setRooms(updated);
    broadcastEvent({ type: 'SYNC_ROOMS', payload: updated });
    if (activeRoomId === roomId) {
      setActiveRoomId('general');
    }
  };

  // Admin login handler
  const handleAdminLogin = (email: string, pass: string) => {
    const found = moderators.find(
      (m) => m.email.toLowerCase() === email.toLowerCase() && m.password === pass
    );

    if (found) {
      setActiveAdmin(found);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          role: found.isRoot ? 'admin' : 'moderator',
          badgeTitle: found.badgeTitle,
        });
      }
      return { success: true };
    }
    return { success: false, error: 'البريد أو كلمة المرور غير صحيحة' };
  };

  const handleAdminLogout = () => {
    setActiveAdmin(null);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: 'member',
        badgeTitle: 'عضو',
      });
    }
  };

  // Join user
  const handleJoinUser = (user: User) => {
    setCurrentUser(user);
    setUsers((prev) => [user, ...prev.filter((u) => u.id !== user.id)]);
    setIsJoinModalOpen(false);

    // Welcome greeting
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      roomId: 'general',
      senderId: 'sys',
      senderName: 'نظام شات عربي',
      senderAvatar: getDefaultAvatar('نظام'),
      senderRole: 'admin',
      senderBadge: 'ترحيب تلقائي',
      text: `انضم الصديق ${user.name} إلى شات عربي! أهلاً وسهلاً بك بيننا 🌹`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, welcomeMsg]);
    playSound('notification', soundEnabled);
  };

  const handleUserLogout = () => {
    if (confirm('هل ترغب بتسجيل الخروج وتغيير الاسم المستعار؟')) {
      setCurrentUser(null);
      setIsJoinModalOpen(true);
    }
  };

  // Filter messages for current view (Public Room or Private DM)
  const currentMessages = messages.filter((m) => {
    if (activePrivateUserId) {
      // 1-on-1 private DM between currentUser and activePrivateUserId
      const match =
        (m.senderId === currentUser?.id && m.recipientId === activePrivateUserId) ||
        (m.senderId === activePrivateUserId && m.recipientId === currentUser?.id);
      return match;
    }
    // Room message
    return m.roomId === activeRoomId;
  });

  // Calculate active private conversations
  const privateConversations: ActiveConversation[] = React.useMemo(() => {
    if (!currentUser) return [];
    const convMap = new Map<string, ActiveConversation>();

    messages.forEach((msg) => {
      let partnerId: string | null = null;
      if (msg.recipientId && msg.senderId === currentUser.id) {
        partnerId = msg.recipientId;
      } else if (msg.recipientId === currentUser.id) {
        partnerId = msg.senderId;
      }

      if (partnerId) {
        const partner = users.find((u) => u.id === partnerId) || {
          id: partnerId,
          name: msg.senderId === partnerId ? msg.senderName : 'مستخدم خاص',
          avatar: msg.senderId === partnerId ? msg.senderAvatar : getDefaultAvatar(partnerId),
          role: 'member' as const,
          joinedAt: Date.now(),
          lastActive: Date.now(),
        };

        const existing = convMap.get(partnerId);
        convMap.set(partnerId, {
          userId: partnerId,
          user: partner,
          unreadCount: 0,
          lastMessage: msg,
        });
      }
    });

    return Array.from(convMap.values());
  }, [messages, currentUser, users]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const activePrivateUser = activePrivateUserId
    ? users.find((u) => u.id === activePrivateUserId)
    : null;

  const currentViewTitle = activePrivateUser
    ? `محادثة خاصة مع ${activePrivateUser.name}`
    : activeRoom?.name || 'الدردشة العامة';

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-['Cairo',sans-serif]">
      {/* Top Bar */}
      <Navbar
        currentUser={currentUser}
        activeAdmin={activeAdmin}
        activeRoomName={currentViewTitle}
        onlineCount={users.length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onLogout={handleUserLogout}
        onToggleMobileRooms={() => setMobileRoomsOpen(!mobileRoomsOpen)}
        onToggleMobileUsers={() => setMobileUsersOpen(!mobileUsersOpen)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Right Sidebar: Categorized Rooms & Private DM List */}
        <RoomSidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          activePrivateUserId={activePrivateUserId}
          onSelectRoom={(roomId) => {
            setActiveRoomId(roomId);
            setActivePrivateUserId(null);
          }}
          onSelectPrivate={(userId) => {
            setActivePrivateUserId(userId);
          }}
          privateConversations={privateConversations}
          isOpenMobile={mobileRoomsOpen}
          onCloseMobile={() => setMobileRoomsOpen(false)}
        />

        {/* Center: Active Chat Stream Viewport */}
        <main className="flex-1 flex flex-col bg-slate-950 min-w-0 relative">
          {/* Room Topic or Private DM Header Banner */}
          <div className="py-2.5 px-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 truncate">
              {activePrivateUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePrivateUserId(null)}
                    className="p-1 hover:bg-slate-800 rounded-lg text-emerald-400 flex items-center gap-1 font-semibold"
                    title="الرجوع للغرف العامة"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للغرف</span>
                  </button>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-white">
                    {activePrivateUser.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.2 rounded-full">
                    محادثة خاصة ومباشرة
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-white flex items-center gap-1.5 shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeRoom.name}</span>
                  </span>
                  {activeRoom.topic && (
                    <span className="text-[11px] text-slate-400 truncate">
                      · {activeRoom.topic}
                    </span>
                  )}
                </div>
              )}
            </div>

            {activeAdmin && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/70 border border-amber-800/50 px-2 py-0.5 rounded-full shrink-0">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>وضع الإشراف مفعل</span>
              </span>
            )}
          </div>

          {/* Messages Timeline */}
          <ChatTimeline
            messages={currentMessages}
            currentUser={currentUser}
            moderatorPermissions={activeAdmin ? activeAdmin.permissions : null}
            onOpenImage={(url, name, time) =>
              setLightboxData({ url, senderName: name, timestamp: time })
            }
            onDeleteMessage={handleDeleteMessage}
            onBanUser={handleBanUser}
            onMuteUser={handleMuteUser}
            onStartPrivateChat={(userId) => setActivePrivateUserId(userId)}
            onAddReaction={handleAddReaction}
            activeContextTitle={currentViewTitle}
            isPrivate={Boolean(activePrivateUserId)}
          />

          {/* Chat Input Bar */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isMuted={Boolean(currentUser?.isMuted)}
            isBanned={Boolean(currentUser?.isBanned)}
            disabledPlaceholder={
              activeRoom.isLocked && !activeAdmin
                ? 'هذه الغرفة مغلقة ومؤمنة من قبل المشرفين حالياً'
                : undefined
            }
          />
        </main>

        {/* Left Sidebar: Online Members & Moderation Actions */}
        <UsersSidebar
          users={users}
          currentUserId={currentUser?.id}
          moderatorPermissions={activeAdmin ? activeAdmin.permissions : null}
          onStartPrivateChat={(userId) => {
            setActivePrivateUserId(userId);
            setMobileUsersOpen(false);
          }}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
          onMuteUser={handleMuteUser}
          onUnmuteUser={handleUnmuteUser}
          isOpenMobile={mobileUsersOpen}
          onCloseMobile={() => setMobileUsersOpen(false)}
        />
      </div>

      {/* Visitor Nickname & Avatar Selection Modal */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onJoin={handleJoinUser}
        onOpenAdminLogin={() => {
          setIsJoinModalOpen(false);
          setIsAdminModalOpen(true);
        }}
      />

      {/* Full-Screen Image Lightbox */}
      <ImageLightbox
        imageUrl={lightboxData?.url || null}
        senderName={lightboxData?.senderName}
        timestamp={lightboxData?.timestamp}
        onClose={() => setLightboxData(null)}
      />

      {/* Admin & Supervisor Control Panel */}
      <AdminPanel
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        activeAdmin={activeAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        moderators={moderators}
        onAddModerator={handleAddModerator}
        onUpdateModerator={handleUpdateModerator}
        onDeleteModerator={handleDeleteModerator}
        users={users}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onMuteUser={handleMuteUser}
        onUnmuteUser={handleUnmuteUser}
        rooms={rooms}
        onAddRoom={handleAddRoom}
        onToggleLockRoom={handleToggleLockRoom}
        onDeleteRoom={handleDeleteRoom}
        allMessages={messages}
        onDeleteMessage={handleDeleteMessage}
      />
    </div>
  );
}
