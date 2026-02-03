import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useCreateOrder, useSendToKitchen } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils';
import { Trash2, Minus, Plus, User, Phone, MapPin, Hash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { printKitchenTicket } from '../printing/PrintTemplates';
import { DiscountModal } from './DiscountModal';
import { NotesModal } from './NotesModal';

export const OrderPanel = () => {
  const {
    items,
    orderType, setOrderType,
    removeItem, incQty, decQty,
    getSubtotal, getTotal, discount, clearCart, globalNotes,
    tableNumber, setTableNumber, customerInfo, setCustomerInfo
  } = useCartStore();

  const { openModifierModal, openPaymentModal, openDiscountModal, openNotesModal } = useUIStore();
  const subtotal = getSubtotal();
  const total = getTotal();

  const createOrder = useCreateOrder();
  const sendToKitchen = useSendToKitchen();

  const handleSendAndPay = async () => {
    if (items.length === 0) {
      toast.error('الطلب فارغ');
      return;
    }

    // Validation
    if (orderType === 'dinein' && !tableNumber) {
      toast.error('يرجى إدخال رقم الطاولة');
      return;
    }
    if (orderType === 'delivery' && (!customerInfo.phone || !customerInfo.address)) {
      toast.error('يرجى إدخال بيانات التوصيل (الهاتف والعنوان)');
      return;
    }

    try {
      // Merge extra info into notes
      let finalNotes = globalNotes || '';
      if (orderType === 'dinein' && tableNumber) {
        finalNotes = `[طاولة: ${tableNumber}] ${finalNotes}`;
      } else if (orderType === 'delivery') {
        finalNotes = `[عميل: ${customerInfo.name || 'غير معروف'} | هاتف: ${customerInfo.phone} | عنوان: ${customerInfo.address}] ${finalNotes}`;
      }

      // 1. Create Order (Kitchen Status)
      const orderRes = await createOrder.mutateAsync({
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
          notes: i.notes,
          modifiers: i.selectedModifiers.map(m => ({ modifierId: m.id, price: m.price }))
        })),
        type: orderType,
        status: 'kitchen',
        subtotal: subtotal,
        total: total,
        notes: finalNotes // Including merged info
      } as any);

      // 2. Mark as sent and get official number
      const finalOrder = await sendToKitchen.mutateAsync(orderRes.id);

      // 3. Print Kitchen Ticket
      printKitchenTicket(
        finalOrder.orderNumber!,
        finalOrder.type,
        items,
        finalNotes
      );

      toast.success(`تم إرسال الطلب للمطبخ (#${finalOrder.orderNumber})`);

      // 4. Open Payment Modal with the Created Order ID
      openPaymentModal(finalOrder.id);

    } catch (e) {
      toast.error('فشل معالجة الطلب');
      console.error('Order processing error:', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 space-y-3">
        <h2 className="text-xl font-bold text-white">الطلب الحالي</h2>
        <Tabs value={orderType} onValueChange={(v: any) => setOrderType(v)} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-slate-700">
            <TabsTrigger value="dinein">محلي</TabsTrigger>
            <TabsTrigger value="takeaway">سفري</TabsTrigger>
            <TabsTrigger value="delivery">توصيل</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Dynamic Inputs Based on Order Type */}
        {orderType === 'dinein' && (
          <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-md animate-in fade-in slide-in-from-top-1">
            <Hash className="h-5 w-5 text-emerald-400" />
            <Input
              placeholder="رقم الطاولة"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-slate-600 border-slate-500 text-white h-8"
            />
          </div>
        )}

        {orderType === 'delivery' && (
          <div className="space-y-2 bg-slate-700 p-2 rounded-md animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <Input
                placeholder="اسم العميل"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white h-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-400" />
              <Input
                placeholder="رقم الهاتف"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white h-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              <Input
                placeholder="العنوان"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white h-8 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 p-3">
        {items.length === 0 ? (
          <div className="text-slate-500 text-center mt-20">لا توجد عناصر في الطلب</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.cartItemId} className="bg-slate-800 rounded-lg p-3 border border-slate-700 relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-100">{item.product.nameAr}</h3>
                  <button onClick={() => removeItem(item.cartItemId)} className="text-red-500 p-1 hover:bg-red-900/20 rounded">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {(item.selectedModifiers.length > 0 || item.notes) && (
                  <div className="text-sm text-slate-400 mb-3 pr-2 border-r-2 border-slate-600">
                    {item.selectedModifiers.map(mod => (
                      <div key={mod.id} className="flex justify-between">
                        <span>- {mod.nameAr}</span>
                        <span className="text-slate-500">{mod.price > 0 ? formatPrice(mod.price) : ''}</span>
                      </div>
                    ))}
                    {item.notes && <div className="italic mt-1 text-amber-500">ملاحظة: {item.notes}</div>}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-slate-900 rounded-md px-2 py-1">
                    <button onClick={() => decQty(item.cartItemId)} className="p-1 text-slate-300 hover:text-white"><Minus className="h-4 w-4" /></button>
                    <span className="font-bold w-6 text-center text-white">{item.quantity}</span>
                    <button onClick={() => incQty(item.cartItemId)} className="p-1 text-slate-300 hover:text-white"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModifierModal(item.product, item)}
                      className="text-xs text-blue-400 underline hover:text-blue-300"
                    >
                      تعديل
                    </button>
                    <span className="font-bold text-emerald-400 text-lg">
                      {formatPrice((item.product.price + item.selectedModifiers.reduce((a, b) => a + b.price, 0)) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer Actions */}
      <div className="bg-slate-800 border-t border-slate-700 p-4 space-y-4">
        {/* Global Notes Preview if any */}
        {(globalNotes || tableNumber || (orderType === 'delivery' && customerInfo.name)) && (
          <div className="bg-amber-900/20 border border-amber-900/50 p-2 rounded text-sm text-amber-500 truncate" title={globalNotes}>
            {orderType === 'dinein' && tableNumber && <span className="ml-2 font-bold">[طاولة: {tableNumber}]</span>}
            {orderType === 'delivery' && customerInfo.name && <span className="ml-2 font-bold">[عميل: {customerInfo.name}]</span>}
            {globalNotes && <span>{globalNotes}</span>}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount && (
            <div className="flex justify-between text-amber-500">
              <span>خصم ({discount.type === 'percent' ? `%${discount.value}` : formatPrice(discount.value)})</span>
              <span>-{formatPrice(subtotal - total)}</span>
            </div>
          )}
          <Separator className="bg-slate-600" />
          <div className="flex justify-between text-2xl font-bold text-white">
            <span>الإجمالي</span>
            <span className="text-emerald-400">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            className="h-14 flex-col gap-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:text-white"
            onClick={openDiscountModal}
          >
            خصم
          </Button>
          <Button
            variant="outline"
            className="h-14 flex-col gap-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:text-white"
            onClick={openNotesModal}
          >
            ملاحظات
          </Button>

          <Button
            className="col-span-2 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg"
            onClick={handleSendAndPay}
            disabled={items.length === 0}
          >
            الدفع
          </Button>
        </div>
      </div>

      {/* Modals placed here or in MainLayout - but placing here ensures they are available within OrderPanel context if needed, though they use portals */}
      <DiscountModal />
      <NotesModal />
    </div>
  );
};
