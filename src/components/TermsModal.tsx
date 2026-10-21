import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Scale, X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose?: () => void;
  isReadOnly?: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onAccept,
  onClose,
  isReadOnly = false,
}) => {
  const [pledge1, setPledge1] = useState(false);
  const [pledge2, setPledge2] = useState(false);
  const [pledge3, setPledge3] = useState(false);

  if (!isOpen) return null;

  const canAccept = isReadOnly || (pledge1 && pledge2 && pledge3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white text-center relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute left-4 top-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="inline-flex p-3 rounded-2xl bg-white/10 mb-2 border border-white/20">
            <Scale className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black tracking-wide">
            ميثاق التاجر الأمين والشروط والأحكام
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            منظومة بقالة ستور للتجارة الإلكترونية والتسوق الآمن
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm leading-relaxed">
          {/* Main Hadith Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-center shadow-inner">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-700 block mb-1">
              قال رسول الله ﷺ
            </span>
            <p className="text-xl font-extrabold text-amber-900 font-serif">
              «مَنْ غَشَّنَا فَلَيْسَ مِنَّا»
            </p>
            <p className="text-xs text-amber-800 mt-1 font-medium">
              الأساس الشرعي والأخلاقي الصارم لكافة المعاملات في منصة بقالة ستور
            </p>
          </div>

          {/* Core Pledges */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              تعهدات التاجر الإلزامية وسياسة حماية المستهلك
            </h3>

            {/* Point 1 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors">
              {!isReadOnly && (
                <input
                  type="checkbox"
                  id="p1"
                  checked={pledge1}
                  onChange={(e) => setPledge1(e.target.checked)}
                  className="mt-1 w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              )}
              <label htmlFor="p1" className="cursor-pointer select-none">
                <span className="font-bold text-slate-900 block text-base">
                  1. سلامة وجودة البضاعة 100%
                </span>
                <p className="text-slate-600 text-xs mt-1">
                  أتعهد بأن تكون جميع المنتجات والخضروات والفواكه والأجبان ومواد البقالة الخارجة من متجري سليمة وطازجة وغير منتهية الصلاحية وخالية تماماً من أي عيب أو تلف بنسبة 100%.
                </p>
              </label>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 hover:border-rose-300 transition-colors">
              {!isReadOnly && (
                <input
                  type="checkbox"
                  id="p2"
                  checked={pledge2}
                  onChange={(e) => setPledge2(e.target.checked)}
                  className="mt-1 w-5 h-5 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
                />
              )}
              <label htmlFor="p2" className="cursor-pointer select-none">
                <span className="font-bold text-rose-950 block text-base">
                  2. الاسترجاع الفوري المجاني للبضاعة التالفة بدون مصاريف شحن
                </span>
                <p className="text-rose-800 text-xs mt-1">
                  أقر بأنه في حالة وصول أي منتج تالف أو مخالف للمواصفات إلى العميل، يتم استرجاع البضاعة فوراً دون تحميل العميل أي مليم ودون مصاريف شحن، ويتحمل التاجر تكلفة البضاعة والتوصيل كاملاً.
                </p>
              </label>
            </div>

            {/* Point 3 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors">
              {!isReadOnly && (
                <input
                  type="checkbox"
                  id="p3"
                  checked={pledge3}
                  onChange={(e) => setPledge3(e.target.checked)}
                  className="mt-1 w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
                />
              )}
              <label htmlFor="p3" className="cursor-pointer select-none">
                <span className="font-bold text-amber-950 block text-base">
                  3. عقوبة الإغلاق التام والحظر الفوري من المنصة
                </span>
                <p className="text-amber-800 text-xs mt-1">
                  أوافق تماماً على أنه في حال ثبوت تكرار إرسال منتجات غير صالحة أو سوء نية، للإدارة الحق المطلق في تجميد أو إغلاق حساب المتجر نهائياً، وشطب التاجر وحرمانه التام من الاستفادة من خدمات البيع والطلبات الأونلاين.
                </p>
              </label>
            </div>
          </div>

          {/* Notice box */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              نظام المنصة يراقب جودة البضائع وملاحظات العملاء وتقييمات الاسترجاع بشكل لحظي وآلي.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          {!isReadOnly ? (
            <>
              <p className="text-xs text-slate-500 font-medium">
                يجب تحديد جميع البنود للتأكيد والبدء
              </p>
              <button
                type="button"
                disabled={!canAccept}
                onClick={onAccept}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                  canAccept
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-emerald-200'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                أوافق وأتعهد بالالتزام التام بالميثاق
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors"
            >
              إغلاق الميثاق
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
