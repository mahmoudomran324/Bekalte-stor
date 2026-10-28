/**
 * Preset avatar generators and image utilities for Chat Arabi
 */

export const PRESET_AVATARS = [
  {
    id: 'av-1',
    name: 'شهم',
    color: '#10B981',
    bg: 'from-emerald-500 to-teal-700',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="url(#g1)"/><circle cx="20" cy="15" r="7" fill="#ffffff" fill-opacity="0.9"/><path d="M7 35C7 27.8203 12.8203 22 20 22C27.1797 22 33 27.8203 33 35" fill="#ffffff" fill-opacity="0.9"/><defs><linearGradient id="g1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#10B981"/><stop offset="1" stop-color="#047857"/></linearGradient></defs></svg>`,
  },
  {
    id: 'av-2',
    name: 'نورس',
    color: '#06B6D4',
    bg: 'from-cyan-500 to-blue-700',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="url(#g2)"/><circle cx="20" cy="14" r="6.5" fill="#ffffff" fill-opacity="0.95"/><path d="M8 36C8 28.5 13.5 23 20 23C26.5 23 32 28.5 32 36" fill="#ffffff" fill-opacity="0.95"/><defs><linearGradient id="g2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#06B6D4"/><stop offset="1" stop-color="#1D4ED8"/></linearGradient></defs></svg>`,
  },
  {
    id: 'av-3',
    name: 'ياسمين',
    color: '#EC4899',
    bg: 'from-pink-500 to-rose-700',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="url(#g3)"/><circle cx="20" cy="15" r="7" fill="#ffffff" fill-opacity="0.95"/><path d="M6 35C6 27 12 22 20 22C28 22 34 27 34 35" fill="#ffffff" fill-opacity="0.95"/><defs><linearGradient id="g3" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#F43F5E"/><stop offset="1" stop-color="#BE185D"/></linearGradient></defs></svg>`,
  },
  {
    id: 'av-4',
    name: 'صقر',
    color: '#F59E0B',
    bg: 'from-amber-500 to-orange-700',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="url(#g4)"/><circle cx="20" cy="14" r="7" fill="#ffffff" fill-opacity="0.95"/><path d="M7 36C7 28 13 22 20 22C27 22 33 28 33 36" fill="#ffffff" fill-opacity="0.95"/><defs><linearGradient id="g4" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#F59E0B"/><stop offset="1" stop-color="#B45309"/></linearGradient></defs></svg>`,
  },
  {
    id: 'av-5',
    name: 'أصيل',
    color: '#8B5CF6',
    bg: 'from-purple-500 to-indigo-800',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="url(#g5)"/><circle cx="20" cy="15" r="6.5" fill="#ffffff" fill-opacity="0.95"/><path d="M8 35C8 28 13.5 22.5 20 22.5C26.5 22.5 32 28 32 35" fill="#ffffff" fill-opacity="0.95"/><defs><linearGradient id="g5" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#8B5CF6"/><stop offset="1" stop-color="#4338CA"/></linearGradient></defs></svg>`,
  },
  {
    id: 'av-6',
    name: 'ريان',
    color: '#14B8A6',
    bg: 'from-teal-400 to-emerald-800',
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="url(#g6)"/><circle cx="20" cy="15" r="7" fill="#ffffff" fill-opacity="0.95"/><path d="M7 35C7 27.5 12.5 22 20 22C27.5 22 33 27.5 33 35" fill="#ffffff" fill-opacity="0.95"/><defs><linearGradient id="g6" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#14B8A6"/><stop offset="1" stop-color="#0F766E"/></linearGradient></defs></svg>`,
  },
];

/**
 * Returns a base64 SVG data URI for a preset avatar
 */
export function getAvatarDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export function getDefaultAvatar(name: string): string {
  const index = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % PRESET_AVATARS.length;
  return getAvatarDataUri(PRESET_AVATARS[index].svg);
}

/**
 * Compresses an uploaded image client-side to prevent massive payload bloat
 * Returns a high-quality, lightweight base64 Data URL
 */
export async function compressImage(file: File, maxDimension = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Formats timestamps in Arabic localized format
 */
export function formatArabicTime(timestamp: number): string {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}
