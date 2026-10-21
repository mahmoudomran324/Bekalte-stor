import React from 'react';
import { Merchant } from '../../types';
import { Store, ShieldCheck, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface StoresListProps {
  merchants: Merchant[];
  selectedGov: string;
  selectedDist: string;
  selectedMerchantId: string | null;
  onSelectMerchant: (merchantId: string | null) => void;
}

export const StoresList: React.FC<StoresListProps> = ({
  merchants,
  selectedGov,
  selectedDist,
  selectedMerchantId,
  onSelectMerchant,
}) => {
  // Filter merchants matching governorate & district, not suspended
  const localStores = merchants.filter(
    (m) =>
      m.governorate === selectedGov &&
      m.district === selectedDist &&
      !m.isSuspended
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>المتاجر والبقالين المتاحين في {selectedDist}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            تجار موثوقون يخضعون لميثاق الأمانة وتوصيل فوري لمنطقتك
          </p>
        </div>

        {selectedMerchantId && (
          <button
            onClick={() => onSelectMerchant(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
          >
            عرض جميع المتاجر
          </button>
        )}
      </div>

      {localStores.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center text-amber-900 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>
            لا توجد متاجر مسجلة حالياً في منطقة {selectedGov} - {selectedDist}. يمكنك تغيير المنطقة من الأعلى لتصفح متاجر المعادي أو الدقي أو سموحة.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {localStores.map((store) => {
            const isSelected = selectedMerchantId === store.id;
            return (
              <div
                key={store.id}
                onClick={() => onSelectMerchant(isSelected ? null : store.id)}
                className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <img
                  src={store.image}
                  alt={store.storeName}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {store.storeName}
                    </h4>
                    <span title="ملتزم بميثاق الأمانة">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  </div>

                  <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md mt-0.5">
                    {store.category}
                  </span>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{store.street}</span>
                  </p>
                </div>

                {isSelected && (
                  <div className="shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
