import React from 'react';
import { X, Download, ZoomIn, ZoomOut, User } from 'lucide-react';
import { formatArabicTime } from '../utils/avatars';

interface ImageLightboxProps {
  imageUrl: string | null;
  senderName?: string;
  timestamp?: number;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  imageUrl,
  senderName,
  timestamp,
  onClose,
}) => {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    setScale(1);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `chat-arabi-image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 select-none animate-fadeIn"
    >
      {/* Top Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl max-w-2xl mx-auto w-full text-slate-200"
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">
            {senderName || 'مستخدم شات عربي'}
          </span>
          {timestamp && (
            <span className="text-[11px] text-slate-400">
              · {formatArabicTime(timestamp)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.25, 2.5))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors flex items-center gap-1 text-xs"
            title="تحميل الصورة"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تحميل</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-lg transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
        <img
          src={imageUrl}
          alt="صورة المحادثة"
          onClick={(e) => e.stopPropagation()}
          style={{ transform: `scale(${scale})` }}
          className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-transform duration-200 cursor-zoom-in"
        />
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs text-slate-500 py-1">
        انقر في أي مكان خارج الصورة أو اضغط Esc للإغلاق
      </div>
    </div>
  );
};
