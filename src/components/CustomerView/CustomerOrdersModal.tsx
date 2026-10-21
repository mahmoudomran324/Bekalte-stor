import React, { useState } from 'react';
import { Order, ReturnRequest } from '../../types';
import {
  X,
  Package,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Store,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onConfirmDelivery: (orderId: string) => void;
  onRequestReturn: (orderId: string, returnData: Omit<ReturnRequest, 'id' | 'requestedAt' | 'status'>) => void;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onConfirmDelivery,
  onRequestReturn,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );

  // Return item modal state
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');

  if (!isOpen) return null;

  const handleOpenReturnModal = (orderId: string) => {
    setReturnOrderId(orderId);
    setReturnReason('بضاعة تالفة أو غير صالحة');
    setReturnDescription('');
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId || !returnDescription.trim()) return;

    onRequestReturn(returnOrderId, {
      reason: returnReason,
      itemsDescription: returnDescription,
    });

    setReturnOrderId(null);
    setReturnDescription('');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>بانتظار موافقة التاجر</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>جاري التجهيز والتحضير</span>
          </span>
        );
      case 'delivering':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            <span>مع المندوب في الطريق</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>تم الاستلام بنجاح</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">
            ملغي
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-black">طلباتي وتتبع الشحنات</h3>
              <p className="text-xs text-slate-400">
                متابعة حركة الطلب، بيانات المندوب، وتأكيد الاستلام وميثاق الاسترجاع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700 text-sm">لا توجد طلبات سابقة</h4>
              <p className="text-xs text-slate-400 mt-1">
                عند قيامك بطلب أي منتجات ستظهر مراحل تتبعها هنا فوراً.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const hasCaptain = Boolean(order.captain);

              return (
                <div
                  key={order.id}
                  className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden transition-all"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs border border-emerald-200">
                        #{order.orderNumber.slice(-4)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            طلب رقم: {order.orderNumber}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.items.length} أصناف • {order.grandTotal} ج.م •{' '}
                          {order.paymentMethod === 'cash_on_delivery'
                            ? 'كاش'
                            : order.paymentMethod === 'vodafone_cash'
                            ? 'فودافون كاش'
                            : 'إنستا باي'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 text-xs">
                      {/* Step Progress Tracker */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                          {/* Step 1 */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                              ✓
                            </div>
                            <span className="font-bold text-slate-900">تم الطلب</span>
                          </div>

                          {/* Step 2 */}
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                order.status !== 'pending'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {order.status !== 'pending' ? '✓' : '2'}
                            </div>
                            <span
                              className={`font-bold ${
                                order.status !== 'pending'
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              جاري التجهيز
                            </span>
                          </div>

                          {/* Step 3 */}
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                order.status === 'delivering' || order.status === 'delivered'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {order.status === 'delivered' ? '✓' : '3'}
                            </div>
                            <span
                              className={`font-bold ${
                                order.status === 'delivering' || order.status === 'delivered'
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              مع المندوب
                            </span>
                          </div>

                          {/* Step 4 */}
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {order.status === 'delivered' ? '✓' : '4'}
                            </div>
                            <span
                              className={`font-bold ${
                                order.status === 'delivered'
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              تم الاستلام
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Captain info card (When assigned by merchant) */}
                      {hasCaptain && order.captain && (
                        <div className="p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-xl space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Truck className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="font-extrabold text-slate-900 text-xs">
                                  مندوب التوصيل في الطريق إليك!
                                </h5>
                                <p className="text-[11px] text-emerald-800 font-bold">
                                  {order.captain.name}
                                </p>
                              </div>
                            </div>

                            <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono" dir="ltr">
                              {order.captain.phone}
                            </span>
                          </div>

                          {/* Direct Actions: Call & WhatsApp */}
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={`https://wa.me/2${order.captain.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                                `مرحباً كابتن ${order.captain.name}، بخصوص طلب بقالة ستور رقم ${order.orderNumber}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>مراسلة عبر واتساب</span>
                            </a>

                            <a
                              href={`tel:${order.captain.phone}`}
                              className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-600" />
                              <span>اتصال</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Items List */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 block">الأصناف المطلوبة:</span>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded object-cover border"
                              />
                              <div>
                                <span className="font-semibold text-slate-900">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                  {item.quantity} × {item.price} ج.م ({item.unit}) • {item.merchantName}
                                </span>
                              </div>
                            </div>
                            <span className="font-black text-slate-900">
                              {item.price * item.quantity} ج.م
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 block mb-0.5">
                          عنوان التوصيل:
                        </span>
                        <p className="text-slate-600 text-[11px]">
                          {order.address.governorate}، {order.address.district}، {order.address.street}، {order.address.building}، {order.address.floor}، {order.address.apartment}
                        </p>
                      </div>

                      {/* Return Request Status if submitted */}
                      {order.returnRequest && (
                        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-900 flex items-center gap-1">
                              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                              <span>طلب استرجاع بضاعة تالفة</span>
                            </span>
                            <span className="bg-rose-200 text-rose-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              {order.returnRequest.status === 'pending'
                                ? 'قيد مراجعة الإدارة'
                                : order.returnRequest.status === 'approved'
                                ? 'تمت الموافقة ومجاني بدون شحن'
                                : 'مرفوض'}
                            </span>
                          </div>
                          <p className="text-[11px] text-rose-800">
                            <strong>السبب:</strong> {order.returnRequest.reason} - {order.returnRequest.itemsDescription}
                          </p>
                        </div>
                      )}

                      {/* Customer Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                        {order.status === 'delivering' && (
                          <button
                            onClick={() => onConfirmDelivery(order.id)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Check className="w-4 h-4" />
                            <span>تأكيد استلام الطلب من المندوب</span>
                          </button>
                        )}

                        {order.status === 'delivered' && !order.returnRequest && (
                          <button
                            onClick={() => handleOpenReturnModal(order.id)}
                            className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                            <span>طلب استرجاع بضاعة تالفة (مجاني 100%)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal for Damaged Goods Return */}
        {returnOrderId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-rose-200">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2 text-rose-700">
                  <RotateCcw className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm">طلب استرجاع بضاعة تالفة</h4>
                </div>
                <button
                  onClick={() => setReturnOrderId(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
                <span>
                  تنفيذاً لميثاق الأمانة: الاسترجاع مجاني بالكامل وبدون أي مصاريف شحن على العميل.
                </span>
              </div>

              <form onSubmit={handleSubmitReturn} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سبب الاسترجاع</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="بضاعة تالفة أو غير صالحة">بضاعة تالفة أو غير صالحة للاستخدام</option>
                    <option value="منتج منتهي الصلاحية">منتج منتهي الصلاحية أو تالف</option>
                    <option value="بضاعة غير مطابقة للمواصفات">بضاعة مختلفة عما تم طلبه</option>
                    <option value="خضار أو فاكهة ذابلة">خضار أو فاكهة غير طازجة وذابلة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    وصف التلف والأصناف التالفة بالتفصيل *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    placeholder="اكتب اسم الصنف التالف ونوع التلف حتى يقوم المندوب باستلامه وإرجاع قيمته لك..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:bg-white focus:border-rose-400"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    تأكيد إرسال طلب الاسترجاع
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnOrderId(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
