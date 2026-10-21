import React from 'react';
import {
  ShoppingBag,
  MapPin,
  Search,
  ShoppingCart,
  Clock,
  Headphones,
  Store,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { EGYPT_LOCATIONS } from '../../utils/storage';

interface HeaderProps {
  selectedGov: string;
  selectedDist: string;
  onLocationChange: (gov: string, dist: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenSupport: () => void;
  onOpenRoleSwitch: () => void;
  activeOrdersCount: number;
  onOpenPledge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedGov,
  selectedDist,
  onLocationChange,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onOpenSupport,
  onOpenRoleSwitch,
  activeOrdersCount,
  onOpenPledge,
}) => {
  const currentGovObj = EGYPT_LOCATIONS.find((l) => l.governorate === selectedGov) || EGYPT_LOCATIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar for pledge and support */}
      <div className="bg-emerald-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onOpenPledge}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors font-medium cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>ميثاق الأمانة: «مَنْ غَشَّنَا فَلَيْسَ مِنَّا» - بضاعة سليمة 100% واسترجاع مجاني فوري</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSupport}
              className="flex items-center gap-1 hover:text-emerald-200 transition-colors cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span>الدعم والمقترحات</span>
            </button>
            <span className="text-emerald-500">|</span>
            <button
              onClick={onOpenRoleSwitch}
              className="font-bold text-amber-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>دخول التاجر / الإدارة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          {/* Logo & Location */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight flex items-center gap-1.5">
                  بقالة ستور
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                    مصر
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">بقالة • خضار • فواكه • أجبان</p>
              </div>
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-xl border border-slate-200 transition-colors text-xs">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex items-center gap-1">
                <select
                  value={selectedGov}
                  onChange={(e) => {
                    const newGov = e.target.value;
                    const found = EGYPT_LOCATIONS.find((l) => l.governorate === newGov);
                    onLocationChange(newGov, found ? found.districts[0] : '');
                  }}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {EGYPT_LOCATIONS.map((loc) => (
                    <option key={loc.governorate} value={loc.governorate}>
                      {loc.governorate}
                    </option>
                  ))}
                </select>
                <span className="text-slate-400">/</span>
                <select
                  value={selectedDist}
                  onChange={(e) => onLocationChange(selectedGov, e.target.value)}
                  className="bg-transparent font-semibold text-emerald-700 focus:outline-none cursor-pointer"
                >
                  {currentGovObj.districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full md:flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أرز، طماطم، جبنة رومي، حليب، مكرونة، زيت..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2 pr-10 pl-4 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Orders button */}
            <button
              onClick={onOpenOrders}
              className="relative flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>طلباتي</span>
              {activeOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5"></span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>السلة</span>
              {cartCount > 0 ? (
                <span className="bg-amber-400 text-slate-900 font-black px-1.5 py-0.5 rounded-full text-[10px]">
                  {cartCount}
                </span>
              ) : (
                <span className="text-emerald-100 text-[10px]">0</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
