import React, { useState, useRef } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  Smile, 
  X, 
  VolumeX, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { compressImage } from '../utils/avatars';

interface ChatInputProps {
  onSendMessage: (text: string, imageUrl?: string) => void;
  isMuted: boolean;
  isBanned: boolean;
  disabledPlaceholder?: string;
}

const EMOJI_LIST = [
  '❤️', '🌹', '✨', '👍', '👏', '😂', '😍', '😊', 
  '🔥', '👋', '🙏', '☕', '🎉', '🕊️', '🤝', '⭐'
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isMuted,
  isBanned,
  disabledPlaceholder,
}) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const compressed = await compressImage(file, 1200, 0.82);
      setSelectedImage(compressed);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSend = () => {
    if (isMuted || isBanned) return;
    const cleanText = text.trim();
    if (!cleanText && !selectedImage) return;

    onSendMessage(cleanText, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
    setShowEmojiPicker(false);

    // Keep focus
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  if (isBanned) {
    return (
      <div className="p-4 bg-rose-950/70 border-t border-rose-800 text-rose-300 text-xs font-bold text-center">
        تم حظر حسابك من المشاركة في شات عربي لمخالفة القوانين. يمكنك مراجعة الإدارة.
      </div>
    );
  }

  if (isMuted) {
    return (
      <div className="p-4 bg-amber-950/70 border-t border-amber-800 text-amber-300 text-xs font-bold flex items-center justify-center gap-2">
        <VolumeX className="w-4 h-4 text-amber-400" />
        <span>تم كتمك مؤقتاً من قبل المشرفين. لا يمكنك إرسال رسائل في الوقت الحالي.</span>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 bg-slate-900/90 border-t border-slate-800 relative">
      {/* Attached Image Preview Banner */}
      {selectedImage && (
        <div className="mb-2.5 p-2 bg-slate-800/90 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <img
              src={selectedImage}
              alt="معاينة الصورة"
              className="w-12 h-12 rounded-lg object-cover border border-emerald-500/50"
            />
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>جاهزة للإرسال داخل المحادثة</span>
              </p>
              <p className="text-[11px] text-slate-400">
                يمكنك كتابة تعليق مع الصورة أو إرسالها مباشرة
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
            title="إلغاء الصورة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          onMouseLeave={() => setShowEmojiPicker(false)}
          className="absolute bottom-full right-4 mb-2 z-40 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 grid grid-cols-8 gap-1.5 max-w-xs animate-fadeIn"
        >
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-lg transition-transform hover:scale-120"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Control Bar */}
      <div className="flex items-end gap-2 bg-slate-950 border border-slate-700/80 rounded-2xl p-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
        {/* Upload Image Button */}
        <label
          className={`p-2 rounded-xl cursor-pointer text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors shrink-0 ${
            isProcessingImage ? 'opacity-50 pointer-events-none' : ''
          }`}
          title="رفع صورة داخل المحادثة"
        >
          {isProcessingImage ? (
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            disabled={isProcessingImage}
          />
        </label>

        {/* Emoji Toggle */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors shrink-0 ${
            showEmojiPicker ? 'text-amber-400 bg-slate-800' : ''
          }`}
          title="الرموز التعبيرية"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabledPlaceholder || 'اكتب رسالتك هنا... (اضغط Enter للإرسال)'}
          rows={1}
          className="flex-1 bg-transparent border-0 text-white placeholder-slate-500 text-sm focus:outline-none resize-none py-1.5 px-2 max-h-32 min-h-[38px] leading-relaxed"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && !selectedImage}
          className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all shrink-0 ${
            text.trim() || selectedImage
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/40 hover:scale-105 active:scale-95'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="إرسال"
        >
          <Send className="w-4 h-4 transform rotate-180" />
        </button>
      </div>
    </div>
  );
};
