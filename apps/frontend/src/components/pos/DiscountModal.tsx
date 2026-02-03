import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export const DiscountModal = () => {
  const { isDiscountModalOpen, closeDiscountModal } = useUIStore();
  const { setDiscount, removeDiscount, discount } = useCartStore();

  const [type, setType] = useState<'percent' | 'fixed'>(discount?.type || 'fixed');
  const [value, setValue] = useState<string>(discount?.value.toString() || '');

  const handleSave = () => {
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue < 0) {
      toast.error('الرجاء إدخال قيمة صحيحة');
      return;
    }

    if (type === 'percent' && numValue > 100) {
      toast.error('النسبة المئوية يجب أن لا تتجاوز 100%');
      return;
    }

    setDiscount(type, numValue);
    toast.success('تم تطبيق الخصم');
    closeDiscountModal();
  };

  const handleRemove = () => {
    removeDiscount();
    setValue('');
    toast.success('تم إزالة الخصم');
    closeDiscountModal();
  };

  return (
    <Dialog open={isDiscountModalOpen} onOpenChange={closeDiscountModal}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>إضافة خصم</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <RadioGroup value={type} onValueChange={(v: any) => setType(v)} className="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="fixed" id="fixed_disc" className="peer sr-only" />
              <Label htmlFor="fixed_disc" className="flex flex-col items-center justify-between rounded-md border-2 border-slate-600 bg-slate-900 p-4 hover:bg-slate-700 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:text-emerald-500 cursor-pointer">
                <span className="font-bold">مبلغ ثابت</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="percent" id="percent_disc" className="peer sr-only" />
              <Label htmlFor="percent_disc" className="flex flex-col items-center justify-between rounded-md border-2 border-slate-600 bg-slate-900 p-4 hover:bg-slate-700 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:text-emerald-500 cursor-pointer">
                <span className="font-bold">نسبة مئوية (%)</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label>قيمة الخصم</Label>
            <Input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="0"
              className="text-center text-xl bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="destructive" onClick={handleRemove} className="flex-1">إزالة</Button>
          <div className="flex gap-2 flex-[2]">
            <Button variant="outline" onClick={closeDiscountModal} className="flex-1 text-slate-800">إلغاء</Button>
            <Button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-500">حفظ</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
