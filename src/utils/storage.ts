import { ChatMessage, ChatRoom, ModeratorRecord, User, ModeratorPermissions } from '../types/chat';
import { getDefaultAvatar, PRESET_AVATARS, getAvatarDataUri } from './avatars';

const STORAGE_KEYS = {
  CURRENT_USER: 'chat_arabi_current_user',
  ROOMS: 'chat_arabi_rooms',
  MESSAGES: 'chat_arabi_messages',
  MODERATORS: 'chat_arabi_moderators',
  BANNED_USERS: 'chat_arabi_banned_users',
  MUTED_USERS: 'chat_arabi_muted_users',
  ACTIVE_USERS: 'chat_arabi_active_users',
  SOUND_ENABLED: 'chat_arabi_sound_enabled',
  FILTERED_WORDS: 'chat_arabi_filtered_words',
  FILTER_MODE: 'chat_arabi_filter_mode',
};

export const DEFAULT_FILTERED_WORDS: string[] = [
  'سب',
  'شتيمة',
  'نصاب',
  'احتيال',
  'قمار',
  'porn',
  'scam',
];

export function applyWordFilter(
  text: string,
  bannedWords: string[],
  mode: 'mask' | 'block' = 'mask'
): { allowed: boolean; filteredText: string; blockedWord?: string } {
  if (!bannedWords || bannedWords.length === 0 || !text) {
    return { allowed: true, filteredText: text };
  }

  let cleaned = text;
  let detectedWord: string | undefined;

  for (const word of bannedWords) {
    const trimmed = word.trim();
    if (!trimmed) continue;
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');

    if (regex.test(cleaned)) {
      detectedWord = trimmed;
      if (mode === 'block') {
        return {
          allowed: false,
          filteredText: text,
          blockedWord: trimmed,
        };
      }
      cleaned = cleaned.replace(regex, '***');
    }
  }

  return {
    allowed: true,
    filteredText: cleaned,
    blockedWord: detectedWord,
  };
}

// Root admin default configuration
export const ROOT_ADMIN: ModeratorRecord = {
  id: 'mod-root',
  name: 'محمود عمران (المدير العام)',
  email: 'mahmoudomran324@gmail.com',
  password: '123456',
  badgeTitle: 'مدير النظام العام',
  isRoot: true,
  createdAt: 1730000000000,
  permissions: {
    canBanUsers: true,
    canMuteUsers: true,
    canDeleteMessages: true,
    canManageRooms: true,
    canAuditMedia: true,
    canManageMods: true,
  },
};

// Default rooms
export const DEFAULT_ROOMS: ChatRoom[] = [
  {
    id: 'general',
    name: 'الدردشة العامة',
    description: 'المجلس الرئيسي للترحيب بجميع الأعضاء وتبادل التحايا والأحاديث.',
    icon: 'MessageSquare',
    category: 'رئيسي',
    isLocked: false,
    isPinned: true,
    topic: 'أهلاً وسهلاً بكم في شات عربي! نرجو الالتزام بالاحترام المتبادل.',
  },
  {
    id: 'friends',
    name: 'التعارف والأصدقاء',
    description: 'مساحة دافئة للتعارف وتكوين صداقات جديدة من كافة أرجاء الوطن العربي.',
    icon: 'Users',
    category: 'اجتماعي',
    isLocked: false,
    topic: 'شاركنا من أي بلد عربي تتابعنا وشارك هواياتك مع الأصدقاء.',
  },
  {
    id: 'culture',
    name: 'الثقافة والنقاش الهادف',
    description: 'حوارات راقية في الأدب، الفكر، الشعر، والقضايا العامة البناءة.',
    icon: 'BookOpen',
    category: 'فكر وثقافة',
    isLocked: false,
    topic: 'ما هو الكتاب أو المبدأ الذي غيّر نظرتك للحياة مؤخراً؟',
  },
  {
    id: 'tech',
    name: 'التكنولوجيا والبرمجة',
    description: 'عشاق التقنية، مطوري الويب، والذكاء الاصطناعي وآخر أخبار الأجهزة.',
    icon: 'Code',
    category: 'علوم وتقنية',
    isLocked: false,
    topic: 'مستقبل الذكاء الاصطناعي وتطوير التطبيقات السحابية.',
  },
  {
    id: 'fun',
    name: 'الألعاب والترفيه',
    description: 'ألعاب خفيفة، فوازير، طرائف، ومسابقات مجتمع شات عربي.',
    icon: 'Gamepad2',
    category: 'ترفيه',
    isLocked: false,
    topic: 'لغز اليوم: شيء يوجد في السماء وإذا أضفت إليه حرفاً أصبح في الأرض؟',
  },
];

// Default simulated active community members
export const INITIAL_MEMBERS: User[] = [
  {
    id: 'sim-1',
    name: 'سارة من القاهرة',
    avatar: getAvatarDataUri(PRESET_AVATARS[2].svg),
    role: 'member',
    badgeTitle: 'عضو مميز',
    statusText: 'مساء الخير للجميع ✨',
    country: 'مصر',
    joinedAt: Date.now() - 3600000 * 24,
    lastActive: Date.now() - 60000,
    isSimulated: true,
  },
  {
    id: 'sim-2',
    name: 'م. أحمد التميمي',
    avatar: getAvatarDataUri(PRESET_AVATARS[0].svg),
    role: 'moderator',
    badgeTitle: 'مشرف غرف',
    statusText: 'في خدمة الجميع 🛡️',
    country: 'السعودية',
    joinedAt: Date.now() - 3600000 * 48,
    lastActive: Date.now() - 120000,
    isSimulated: true,
    permissions: {
      canBanUsers: true,
      canMuteUsers: true,
      canDeleteMessages: true,
      canManageRooms: false,
      canAuditMedia: true,
      canManageMods: false,
    },
  },
  {
    id: 'sim-3',
    name: 'ليلى الأندلس',
    avatar: getAvatarDataUri(PRESET_AVATARS[5].svg),
    role: 'member',
    badgeTitle: 'شاعرة الشات',
    statusText: 'أقرأ رواية ممتعة 📖',
    country: 'المغرب',
    joinedAt: Date.now() - 3600000 * 12,
    lastActive: Date.now() - 180000,
    isSimulated: true,
  },
  {
    id: 'sim-4',
    name: 'عمر المطور',
    avatar: getAvatarDataUri(PRESET_AVATARS[1].svg),
    role: 'member',
    badgeTitle: 'مبرمج ويب',
    statusText: 'React & TypeScript 🚀',
    country: 'الأردن',
    joinedAt: Date.now() - 3600000 * 8,
    lastActive: Date.now() - 300000,
    isSimulated: true,
  },
  {
    id: 'sim-5',
    name: 'فاطمة الزهراء',
    avatar: getAvatarDataUri(PRESET_AVATARS[4].svg),
    role: 'guest',
    badgeTitle: 'زائر جديد',
    statusText: 'أهلاً بكم يا رفاق 👋',
    country: 'الجزائر',
    joinedAt: Date.now() - 3600000 * 2,
    lastActive: Date.now() - 90000,
    isSimulated: true,
  },
];

// Initial welcoming messages
export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    roomId: 'general',
    senderId: 'sim-2',
    senderName: 'م. أحمد التميمي',
    senderAvatar: getAvatarDataUri(PRESET_AVATARS[0].svg),
    senderRole: 'moderator',
    senderBadge: 'مشرف غرف',
    text: 'مرحباً بجميع الإخوة والأخوات في منصة شات عربي الجديدة! نتمنى لكم أوقاتاً ممتعة ومفيدة.',
    timestamp: Date.now() - 1000 * 60 * 18,
  },
  {
    id: 'msg-init-2',
    roomId: 'general',
    senderId: 'sim-1',
    senderName: 'سارة من القاهرة',
    senderAvatar: getAvatarDataUri(PRESET_AVATARS[2].svg),
    senderRole: 'member',
    senderBadge: 'عضو مميز',
    text: 'أهلاً وسهلاً يا بشمهندس أحمد، التصميم الجديد للشات رائع جداً وسريع وخاصية إرسال الصور ممتازة!',
    timestamp: Date.now() - 1000 * 60 * 14,
  },
  {
    id: 'msg-init-3',
    roomId: 'general',
    senderId: 'sim-3',
    senderName: 'ليلى الأندلس',
    senderAvatar: getAvatarDataUri(PRESET_AVATARS[5].svg),
    senderRole: 'member',
    senderBadge: 'شاعرة الشات',
    text: 'مساء الخير والسعادة عليكم جميعاً.. تحية طيبة من المغرب لكل الأحبة.',
    timestamp: Date.now() - 1000 * 60 * 9,
  },
  {
    id: 'msg-init-4',
    roomId: 'tech',
    senderId: 'sim-4',
    senderName: 'عمر المطور',
    senderAvatar: getAvatarDataUri(PRESET_AVATARS[1].svg),
    senderRole: 'member',
    senderBadge: 'مبرمج ويب',
    text: 'السلام عليكم، هل جرب أحدكم بناء غرف محادثة باستخدام BroadcastChannel وتقنيات الويب الحديثة؟ تجربة سلسة جداً.',
    timestamp: Date.now() - 1000 * 60 * 22,
  },
  {
    id: 'msg-init-5',
    roomId: 'friends',
    senderId: 'sim-5',
    senderName: 'فاطمة الزهراء',
    senderAvatar: getAvatarDataUri(PRESET_AVATARS[4].svg),
    senderRole: 'guest',
    senderBadge: 'زائر جديد',
    text: 'مرحباً، سعيدة بالانضمام إليكم في غرفة الأصدقاء 🌹',
    timestamp: Date.now() - 1000 * 60 * 5,
  },
];

// Helper wrappers
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage quota exceeded or storage error:', err);
  }
}

// Global broadcast channel for instant multi-tab sync
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('chat_arabi_sync_v1');
  } catch {
    broadcastChannel = null;
  }
}

export function broadcastEvent(event: { type: string; payload: unknown }) {
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage(event);
    }
  } catch {
    // ignore
  }
}

export function subscribeBroadcast(handler: (event: { type: string; payload: unknown }) => void) {
  if (!broadcastChannel) return () => {};
  const listener = (msg: MessageEvent) => {
    if (msg.data && typeof msg.data === 'object') {
      handler(msg.data as { type: string; payload: unknown });
    }
  };
  broadcastChannel.addEventListener('message', listener);
  return () => {
    broadcastChannel?.removeEventListener('message', listener);
  };
}

export { STORAGE_KEYS };
