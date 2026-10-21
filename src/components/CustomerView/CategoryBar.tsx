import React from 'react';
import { Apple, ShoppingBasket, Milk, Store, Sparkles, Coffee } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES: { label: string; value: string; icon: React.ReactNode; color: string }[] = [
  {
    label: 'الكل',
    value: 'الكل',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    label: 'خضار وفواكه',
    value: 'خضار وفواكه',
    icon: <Apple className="w-4 h-4" />,
    color: 'from-lime-500 to-emerald-600',
  },
  {
    label: 'بقالة ومجففات',
    value: 'بقالة ومجففات',
    icon: <ShoppingBasket className="w-4 h-4" />,
    color: 'from-amber-500 to-orange-600',
  },
  {
    label: 'جبن وألبان',
    value: 'جبن وألبان',
    icon: <Milk className="w-4 h-4" />,
    color: 'from-sky-500 to-blue-600',
  },
  {
    label: 'سوبرماركت كامل',
    value: 'سوبرماركت كامل',
    icon: <Store className="w-4 h-4" />,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    label: 'مشروبات ومجمدات',
    value: 'مشروبات ومجمدات',
    icon: <Coffee className="w-4 h-4" />,
    color: 'from-rose-500 to-red-600',
  },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelectCategory(cat.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white shadow-md shadow-slate-300 scale-102'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span
              className={`p-1 rounded-lg ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.icon}
            </span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
