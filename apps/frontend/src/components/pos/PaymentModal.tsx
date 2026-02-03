import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder, useProcessPayment } from '@/lib/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { printReceipt } from '../printing/PrintTemplates'; // Helper we will create

export const PaymentModal = () => {
  const { isPaymentModalOpen, closePaymentModal, paymentOrderId } = useUIStore();
  const { items, getTotal, orderType, clearCart, getSubtotal } = useCartStore();
  const createOrder = useCreateOrder();
  const processPayment = useProcessPayment();

  const total = getTotal();
  const [method, setMethod] = useState<'cash' | 'card' | 'split'>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const change = method === 'cash' ? Math.max(0, Number(cashReceived) - total) : 0;

  const handlePayment = async () => {
    if (method === 'cash' && Number(cashReceived) < total) {
      toast.error('المبلغ المستلم غير كافٍ');
      return;
    }

    setIsProcessing(true);
    try {
      let finalOrderId = paymentOrderId;

      // Fallback: If no paymentOrderId (shouldn't happen with new flow, but for robustness), create new order
      if (!finalOrderId) {
        const orderRes = await createOrder.mutateAsync({
          items: items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
            notes: i.notes,
            modifiers: i.selectedModifiers.map(m => ({ modifierId: m.id, price: m.price }))
          })),
          type: orderType,
          status: 'kitchen', // Or completed directly if we skip kitchen? But let's assume kitchen for consistency
          subtotal: getSubtotal(),
          total: total,
          paidAt: new Date().toISOString()
        } as any);
        finalOrderId = orderRes.id;
      }

      // 2. Create Payment / Update Order Status to Completed
      const result = await processPayment.mutateAsync({
        orderId: finalOrderId!,
        method,
        cashAmount: method === 'cash' ? Number(cashReceived) : 0,
        cardAmount: method === 'card' ? total : 0,
        total
      });

      // 3. Print Customer Receipt
      // We need to construct a receipt object. result might be just success status or updated order.
      // Assuming we need to pass order details like orderNumber.
      // If paymentOrderId was passed, we might lack the orderNumber in local state if we didn't fetch it.
      // However, usually the query cache has it, or we rely on what we returned from processPayment.
      // Let's assume result contains the updated order with orderNumber.

      const orderForPrint = {
        orderNumber: result?.order?.orderNumber || '---', // Ensure backend returns this structure or we might show ---
        ...result?.order
      };

      printReceipt(orderForPrint, items, total, Number(cashReceived), change);

      toast.success('تم الدفع بنجاح');
      clearCart();
      closePaymentModal();
      setCashReceived('');
    } catch (error) {
      toast.error('حدث خطأ أثناء الدفع');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={closePaymentModal}>
      <DialogContent className="bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>الدفع</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="text-center bg-slate-900 p-4 rounded-lg">
            <span className="text-gray-400">المبلغ الإجمالي</span>
            <div className="text-4xl font-bold text-emerald-500 mt-2">{formatPrice(total)}</div>
          </div>

          <RadioGroup value={method} onValueChange={(v: any) => setMethod(v)} className="grid grid-cols-3 gap-4">
            <div className="">
              <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
              <Label htmlFor="cash" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <span className="text-xl font-bold">كاش</span>
              </Label>
            </div>
            <div className="">
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label htmlFor="card" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <span className="text-xl font-bold">بطاقة</span>
              </Label>
            </div>
            <div className="">
              <RadioGroupItem value="split" id="split" className="peer sr-only" disabled /> {/* Disabled split for now */}
              <Label htmlFor="split" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-900 p-4 opacity-50 cursor-not-allowed">
                <span className="text-xl font-bold">مختلط</span>
              </Label>
            </div>
          </RadioGroup>

          {method === 'cash' && (
            <div className="space-y-4">
              <div>
                <Label>المبلغ المستلم</Label>
                <Input
                  type="number"
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                  className="text-2xl text-center h-14 bg-slate-700 border-slate-600 text-white"
                  autoFocus
                />
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>الباقي:</span>
                <span className="text-amber-500">{formatPrice(change)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={closePaymentModal} className="h-12 w-32">إلغاء</Button>
          <Button onClick={handlePayment} disabled={isProcessing} className="h-12 w-48 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold">
            {isProcessing ? 'جاري المعالجة...' : 'تأكيد الدفع'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
