/**
 * Types and interfaces for Chat Arabi (شات عربي)
 */

export type UserRole = 'guest' | 'member' | 'moderator' | 'admin';

export interface ModeratorPermissions {
  canBanUsers: boolean;
  canMuteUsers: boolean;
  canDeleteMessages: boolean;
  canManageRooms: boolean;
  canAuditMedia: boolean;
  canManageMods: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  badgeTitle?: string;
  isMuted?: boolean;
  isBanned?: boolean;
  statusText?: string;
  country?: string;
  joinedAt: number;
  lastActive: number;
  isSimulated?: boolean;
  permissions?: ModeratorPermissions;
}

export interface ModeratorRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  badgeTitle: string;
  permissions: ModeratorPermissions;
  createdAt: number;
  isRoot?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isLocked: boolean;
  isPinned?: boolean;
  slowModeSeconds?: number;
  topic?: string;
}

export interface ChatMessage {
  id: string;
  roomId?: string; // If null/undefined, it's a direct message
  recipientId?: string; // If present, it's a 1-on-1 private message
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  senderBadge?: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  isDeleted?: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
}

export interface ActiveConversation {
  userId: string;
  user: User;
  unreadCount: number;
  lastMessage?: ChatMessage;
}
