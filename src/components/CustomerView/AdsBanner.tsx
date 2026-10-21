import React, { useState, useEffect } from 'react';
import { SponsoredAd } from '../../types';
import { ChevronRight, ChevronLeft, Sparkles, Tag } from 'lucide-react';

interface AdsBannerProps {
  ads: SponsoredAd[];
  onSelectCategory?: (category: string) => void;
}

export const AdsBanner: React.FC<AdsBannerProps> = ({ ads, onSelectCategory }) => {
  const activeAds = ads.filter((a) => a.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAds.length]);

  if (activeAds.length === 0) return null;

  const current = activeAds[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl mb-6">
      <div className="relative min-h-[170px] md:min-h-[200px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover opacity-25 filter blur-[1px] transform scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-teal-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl p-6 md:p-8 flex flex-col items-start gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/90 text-slate-900 text-xs font-black shadow-sm">
            <Tag className="w-3.5 h-3.5" />
            <span>{current.badgeText || 'إعلان ممول'}</span>
          </div>

          <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-snug">
            {current.title}
          </h2>

          <p className="text-xs md:text-sm text-slate-200 line-clamp-2 max-w-xl">
            {current.subtitle}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                if (onSelectCategory && current.title.includes('خضار')) {
                  onSelectCategory('خضار وفواكه');
                } else if (onSelectCategory && current.title.includes('ألبان')) {
                  onSelectCategory('جبن وألبان');
                } else if (onSelectCategory) {
                  onSelectCategory('الكل');
                }
              }}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs md:text-sm transition-all shadow-md shadow-emerald-900/50 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>{current.linkText || 'اكتشف العروض'}</span>
            </button>
          </div>
        </div>

        {/* Navigation arrows if multiple ads */}
        {activeAds.length > 1 && (
          <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {activeAds.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
