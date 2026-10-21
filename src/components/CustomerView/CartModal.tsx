import React from 'react';
import { CartItem } from '../../types';
import {
  X,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  ShoppingBag,
  Store,
  ArrowLeft,
  Truck,
} from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  shippingPerStore: number;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  shippingPerStore,
}) => {
  if (!isOpen) return null;

  // Group items by merchant
  const merchantGroups = items.reduce<{
    [merchantId: string]: {
      merchantName: string;
      items: CartItem[];
      subtotal: number;
    };
  }>((acc, item) => {
    const mId = item.product.merchantId;
    if (!acc[mId]) {
      acc[mId] = {
        merchantName: item.product.merchantName,
        items: [],
        subtotal: 0,
      };
    }
    acc[mId].items.push(item);
    acc[mId].subtotal += item.product.price * item.quantity;
    return acc;
  }, {});

  const merchantIds = Object.keys(merchantGroups);
  const isMultiVendor = merchantIds.length > 1;

  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalShipping = merchantIds.length * shippingPerStore;
  const grandTotal = itemsSubtotal + totalShipping;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg">
                سلة المشتريات
              </h3>
              <p className="text-xs text-slate-500">
                {items.length} أصناف من {merchantIds.length} متجر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                تفريغ السلة
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base mb-1">
                سلة التسوق فارغة حالياً
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                تصفح أقسام الخضار والفاكهة والأجبان والبقالة وأضف ما تحتاجه لبيتك.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                ابدأ التسوق الآن
              </button>
            </div>
          ) : (
            <>
              {/* CRITICAL: Multi-vendor shipping warning notice */}
              {isMultiVendor && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <h5 className="font-extrabold text-sm text-amber-900">
                      تنبيه هام: منتجات من عدة تجار ومتاجر مختلفة
                    </h5>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    لقد اخترت بضائع من <strong>({merchantIds.length})</strong> تجار ومتاجر منفصلة.
                    نظراً لأن كل تاجر يجهز ويسلم بضاعته مع مندوب خاص لضمان السرعة وجودة المنتج،
                    سيتم احتساب رسوم توصيل منفصلة قدرها <strong>{shippingPerStore} ج.م</strong> لكل متجر مستقل.
                  </p>
                  <div className="text-[11px] font-bold text-amber-900 bg-amber-100/80 p-2 rounded-xl flex items-center justify-between">
                    <span>إجمالي رسوم التوصيل ({merchantIds.length} متاجر × {shippingPerStore} ج.م):</span>
                    <span className="text-sm font-black">{totalShipping} ج.م</span>
                  </div>
                </div>
              )}

              {/* Items grouped by merchant */}
              <div className="space-y-4">
                {Object.entries(merchantGroups).map(([merchantId, group]) => (
                  <div
                    key={merchantId}
                    className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Store className="w-4 h-4 text-emerald-600" />
                        <span>متجر: {group.merchantName}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>شحن: {shippingPerStore} ج.م</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.items.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs gap-3"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-slate-900 truncate">
                              {product.name}
                            </h5>
                            <span className="text-[11px] text-slate-500">
                              {product.price} ج.م / {product.unit}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                              <button
                                onClick={() => onUpdateQuantity(product.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-700 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-black text-xs text-slate-900">
                                {quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(product.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-700 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-extrabold text-xs text-slate-900 min-w-14 text-left">
                              {product.price * quantity} ج.م
                            </span>

                            <button
                              onClick={() => onRemoveItem(product.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>مجموع المنتجات:</span>
                <span className="font-bold text-slate-900">{itemsSubtotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل ({merchantIds.length} متجر):</span>
                <span className="font-bold text-slate-900">{totalShipping} ج.م</span>
              </div>
              <div className="flex justify-between text-sm md:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>الإجمالي النهائي:</span>
                <span className="text-emerald-700">{grandTotal} ج.م</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
