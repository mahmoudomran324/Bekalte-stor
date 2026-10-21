import React from 'react';
import { Product, Merchant } from '../../types';
import { ShoppingCart, Plus, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface ProductsGridProps {
  products: Product[];
  merchants: Merchant[];
  selectedGov: string;
  selectedDist: string;
  selectedCategory: string;
  searchQuery: string;
  selectedMerchantId: string | null;
  onAddToCart: (product: Product) => void;
  cartProductIds: string[];
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  merchants,
  selectedGov,
  selectedDist,
  selectedCategory,
  searchQuery,
  selectedMerchantId,
  onAddToCart,
  cartProductIds,
}) => {
  // Get active merchant IDs in this location that are not suspended
  const validMerchantMap = new Map<string, Merchant>();
  merchants.forEach((m) => {
    if (m.governorate === selectedGov && m.district === selectedDist && !m.isSuspended) {
      validMerchantMap.set(m.id, m);
    }
  });

  // Filter products
  const filteredProducts = products.filter((prod) => {
    // Must belong to a non-suspended merchant in this zone
    if (!validMerchantMap.has(prod.merchantId)) return false;

    // Filter by store if selected
    if (selectedMerchantId && prod.merchantId !== selectedMerchantId) return false;

    // Filter by category
    if (selectedCategory !== 'الكل' && prod.category !== selectedCategory) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchMerchant = prod.merchantName.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchMerchant) return false;
    }

    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            {selectedCategory === 'الكل' ? 'جميع المنتجات المتوفرة' : selectedCategory}
          </h3>
          <p className="text-xs text-slate-500">
            تم العثور على {filteredProducts.length} منتج طازج ومتاح للتوصيل
          </p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-slate-800 text-base mb-1">
            لا توجد منتجات مطابقة لخياراتك حالياً
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            جرب تغيير التصنيف أو البحث بكلمات أخرى أو تصفح المتاجر الأخرى في القائمة بالأعلى.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredProducts.map((product) => {
            const inCart = cartProductIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Offers & Discounts Badge */}
                  {product.discountPrice && product.discountPrice < product.price && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 animate-pulse">
                        <span>خصم {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <span className="bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
                      {product.unit}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <span className="bg-emerald-950/80 backdrop-blur-xs text-[10px] font-semibold text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{product.merchantName}</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs md:text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {product.discountPrice && product.discountPrice < product.price ? (
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-black text-rose-700">
                              {product.discountPrice}
                            </span>
                            <span className="text-[10px] font-bold text-rose-600">ج.م</span>
                          </div>
                          <span className="line-through text-[10px] text-slate-400 font-bold block">
                            {product.price} ج.م
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-emerald-700">
                            {product.price}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">ج.م</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400">لكل {product.unit}</span>
                    </div>

                    <button
                      onClick={() =>
                        onAddToCart(
                          product.discountPrice && product.discountPrice < product.price
                            ? { ...product, price: product.discountPrice }
                            : product
                        )
                      }
                      className={`p-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center ${
                        inCart
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'
                      }`}
                      title={inCart ? 'أضف المزيد للسلة' : 'إضافة إلى السلة'}
                    >
                      {inCart ? (
                        <div className="flex items-center gap-0.5">
                          <Check className="w-4 h-4" />
                          <Plus className="w-3 h-3" />
                        </div>
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
