# Chat Arabi (شات عربي) - Real-time Arabic Chat Platform & Admin Console

Chat Arabi is a modern Arabic community chat platform featuring categorized group chat rooms, real-time 1-on-1 private messaging, in-chat image uploading and viewing, quick guest entry with avatars, a comprehensive supervisor and permissions management panel, and direct GitHub repository deployment.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following revisions have been incorporated into the plan:
> - **Moderator & Permissions Management (إدارة المشرفين والصلاحيات)**: The Root Admin (`mahmoudomran324@gmail.com` / `123456`) can create new moderators, assign granular permissions (Ban/Kick, Delete Messages, Manage Rooms, Moderate Media, Edit Topics), and remove or demote moderators.
> - **GitHub Repository Integration & Deployment**: The project will be automatically initialized with Git, committed, and pushed to `https://github.com/mahmoudomran324/Bekalte-stor.git` using the provided GitHub personal access token, with direct repository and preview links delivered.
> - **Live Chat & Private DMs**: Group rooms plus private 1-on-1 direct messaging, online presence indicators, and in-chat image attachments with a high-resolution lightbox viewer.

---

### 1. Overview & Core Concept

- **What It Does**: A complete web chat platform in Arabic supporting real-time group conversations across categorized rooms, private 1-on-1 chats between any active participants, photo sharing, sound alerts, and a multi-tiered moderation panel.
- **Root Admin**: `mahmoudomran324@gmail.com` with password `123456`.
- **Target Audience**: Arabic communities looking for easy-to-use, feature-rich web chat, plus community administrators needing full oversight and custom staff roles.
- **Repository Target**: `https://github.com/mahmoudomran324/Bekalte-stor.git` on branch `main`.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Quick Entry**: Visitors enter their display nickname, choose an avatar or upload their photo, and enter the community in seconds.
2. **Categorized Rooms**:
   - **الدردشة العامة** (Public Lounge)
   - **التعارف والأصدقاء** (Meet & Greet)
   - **الثقافة والنقاش الهادف** (Culture & Debate)
   - **التكنولوجيا والبرمجة** (Tech & Development)
3. **Private Direct Messaging (محادثات خاصة)**:
   - Clicking any member from the active member list opens a private 1-on-1 chat tab.
   - Supports private text, image uploads, unread message badges, and sound notifications.
4. **Image Upload & Full Lightbox**:
   - File picker and drag-and-drop support inside chat input.
   - Immediate thumbnail preview in chat with clickable modal lightbox for full-screen inspection.
5. **Supervisor Management & Admin Control Panel**:
   - Secure login modal/screen for `mahmoudomran324@gmail.com` (Root Admin) or appointed moderators.
   - **Moderator Management Tab**:
     - Add new moderator with name, email/username, password, and custom title.
     - Custom permission checkboxes:
       - `can_ban_users`: Ability to ban/unban users.
       - `can_mute_users`: Ability to mute chat privileges.
       - `can_delete_messages`: Ability to delete abusive messages.
       - `can_manage_rooms`: Ability to create, lock, and edit rooms.
       - `can_audit_media`: Ability to inspect and purge shared images.
       - `can_manage_mods`: Reserved for Root Admin to add or remove moderators.
     - Edit moderator roles or delete/revoke supervisor accounts with 1 click.
   - **Users & Bans Tab**: Live list of active users, ban/mute toggles, and banned IP/ID manager.
   - **Media Moderation Tab**: Grid of all uploaded images with instant purge.
   - **GitHub Status & Export Tab**: Displays deployment status, commit hash, and sync actions.

#### Visual Identity & Theme
- **Theme**: Dark Arabesque Slate (`#0B0F17`) with rich Arabic Emerald (`#059669` / `#10B981`) and subtle gold accents for supervisors.
- **Direction**: Full Right-to-Left (`dir="rtl"`) with clean Arabic typography, high contrast, and responsive layout for mobile and desktop.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Granular Role-Based Access Control (RBAC)**
  - *Chosen Approach*: Hierarchical permissions (`root_admin` > `moderator` with custom flags > `member` > `guest`). Root admin cannot be deleted or demoted.
  - *Why*: Gives the community owner complete peace of mind while delegating daily moderation tasks to appointed staff.
- **Decision 2: Automated GitHub Push Integration**
  - *Chosen Approach*: Configure Git remote credentials with the user's PAT, commit the complete clean source code, and push to `mahmoudomran324/Bekalte-stor`.
  - *Why*: Ensures the project is immediately stored safely in the user's GitHub account and ready for direct access.
- **Decision 3: Real-Time Synchronization Bus**
  - *Chosen Approach*: Dual-layer synchronization using BroadcastChannel and local persistence with live multi-tab event dispatching.
  - *Why*: Enables instant real-time message exchange across tabs and simulated users without external quota dependencies.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Chat Arabi Architecture                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌─────────────────────────┐                       ┌─────────────────────────┐
│     Chat Client UI      │                       │  Supervisor & Admin UI  │
│  - RTL Layout & Theme   │                       │  - Root Auth (omran@)   │
│  - Categorized Rooms    │                       │  - Add/Remove Mods      │
│  - 1-on-1 Private DMs   │                       │  - Granular Permissions │
│  - Image Lightbox       │                       │  - Ban/Mute & Purge     │
│  - Presence & Sound FX  │                       │  - GitHub Push Terminal │
└──────────┬──────────────┘                       └───────────┬─────────────┘
           │                                                  │
           └────────────────────────┬─────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Real-Time State & Storage                         │
│  - User & Role Store (Root Admin + Custom Appointed Moderators)       │
│  - ChatStore: Messages, Rooms, Direct Messages, Image Attachments      │
│  - Security Engine: Permission checks for every moderator action       │
│  - Git Automation: Remote push to mahmoudomran324/Bekalte-stor         │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Entities
- **User**: `id`, `name`, `avatar`, `role` (`guest` | `member` | `moderator` | `admin`), `permissions`: `PermissionSet`, `isMuted`, `isBanned`, `online`.
- **ModeratorRecord**: `id`, `name`, `email`, `password`, `badgeTitle`, `permissions`: `{ canBan, canMute, canDeleteMessages, canManageRooms, canAuditMedia, canManageMods }`, `createdAt`.
- **Room**: `id`, `name`, `topic`, `icon`, `isLocked`, `messageCount`.
- **Message**: `id`, `roomId` (or `recipientId`), `sender`: User, `text`, `imageUrl`, `timestamp`, `isDeleted`.
