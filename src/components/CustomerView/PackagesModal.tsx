import React, { useState } from 'react';
import { MonthlyDeliveryPackage } from '../../types';
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  CreditCard,
  CheckCircle2,
  Phone,
  Banknote,
} from 'lucide-react';

interface PackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: MonthlyDeliveryPackage[];
  isCurrentlySubscribed?: boolean;
  activePlanName?: string;
  onSubscribe: (pkg: MonthlyDeliveryPackage, paymentMethod: string, proof: string) => void;
  vodafoneNumber: string;
  instapayAddress: string;
}

export const PackagesModal: React.FC<PackagesModalProps> = ({
  isOpen,
  onClose,
  packages,
  isCurrentlySubscribed,
  activePlanName,
  onSubscribe,
  vodafoneNumber,
  instapayAddress,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<MonthlyDeliveryPackage | null>(
    packages.length > 0 ? packages[0] : null
  );
  const [paymentMethod, setPaymentMethod] = useState<'vodafone_cash' | 'instapay' | 'cod'>('vodafone_cash');
  const [proof, setProof] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    onSubscribe(selectedPkg, paymentMethod, proof);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black mb-2 shadow-md">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl md:text-2xl font-black">باقات التوصيل الشهري المجاني للعملاء</h3>
          <p className="text-emerald-100 text-xs mt-1">
            اشترك مرة واحدة شهرياً واستمتع بتوصيل مجاني 100% لجميع طلباتك بدون مصاريف شحن على كل أوردر!
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {isCurrentlySubscribed && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-950">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-extrabold text-sm block">أنت مشترك حالياً في باقة نشطة!</span>
                <p className="text-xs text-emerald-800">
                  الباقة الحالية: <strong>{activePlanName || 'باقة التوصيل الشهري'}</strong> • التوصيل مجاني 0 ج.م على جميع طلباتك.
                </p>
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="font-black text-lg text-slate-900">تم تفعيل باقة التوصيل الشهري بنجاح!</h4>
              <p className="text-slate-500">
                أصبح التوصيل مجانياً 100% على كافة طلباتك من جميع البقالين ومحلات السوبرماركت.
              </p>
            </div>
          ) : (
            <>
              {/* Packages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const isSelected = selectedPkg?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>الأكثر طلباً وتوفيراً</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-black text-slate-900 text-sm">{pkg.name}</h4>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-emerald-700">{pkg.price}</span>
                            <span className="text-[10px] text-slate-500">ج.م / شهر</span>
                          </div>
                        </div>

                        <p className="text-slate-500 text-[11px] mb-3">{pkg.description}</p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          {pkg.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-2">
                        <button
                          type="button"
                          className={`w-full py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ الباقة المحددة' : 'اختيار هذه الباقة'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Section */}
              {selectedPkg && (
                <form onSubmit={handleConfirmSubscription} className="space-y-4 pt-3 border-t border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>طريقة سداد قيمة الباقة ({selectedPkg.price} ج.م)</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vodafone_cash')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === 'vodafone_cash'
                          ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs">فودافون كاش</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('instapay')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === 'instapay'
                          ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs">إنستا باي</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs">مع أول أوردر (كاش)</div>
                    </button>
                  </div>

                  {paymentMethod === 'vodafone_cash' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-slate-700">
                      <div className="flex justify-between font-bold text-rose-900">
                        <span>رقم محفظة الإدارة لفودافون كاش:</span>
                        <span className="font-mono text-xs" dir="ltr">{vodafoneNumber}</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        placeholder="اكتب رقم المحفظة المحول منها لتأكيد الاشتراك..."
                        className="w-full bg-white border border-rose-300 rounded-lg p-2 text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  {paymentMethod === 'instapay' && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-slate-700">
                      <div className="flex justify-between font-bold text-purple-900">
                        <span>عنوان حساب إنستا باي (IPA):</span>
                        <span className="font-mono text-xs" dir="ltr">{instapayAddress}</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        placeholder="اكتب اسم الحساب المحول منه أو رقم المعاملة..."
                        className="w-full bg-white border border-purple-300 rounded-lg p-2 text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>تأكيد الاشتراك وتفعيل التوصيل المجاني فوراً</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
