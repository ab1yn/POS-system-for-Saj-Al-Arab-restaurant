import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils';
import { Modifier } from '@saj/types';
import { Trash2, Minus, Plus } from 'lucide-react';

export const ModifierModal = () => {
  const { isModifierModalOpen, closeModifierModal, modifierModalData } = useUIStore();
  const { existingItem } = modifierModalData || {};
  const { addItem, updateItem } = useCartStore();

  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (modifierModalData) {
      if (modifierModalData.existingItem) {
        setSelectedModifiers(modifierModalData.existingItem.selectedModifiers);
        setNotes(modifierModalData.existingItem.notes);
        setQuantity(modifierModalData.existingItem.quantity);
      } else {
        setSelectedModifiers([]);
        setNotes('');
        setQuantity(1);
      }
    }
  }, [modifierModalData]);

  if (!modifierModalData || !modifierModalData.product) return null;

  const product = modifierModalData.product;
  const availableModifiers: Modifier[] = product.modifiers || []; // Assuming nested modifiers provided by API

  const toggleModifier = (mod: Modifier) => {
    setSelectedModifiers(prev => {
      const exists = prev.find(m => m.id === mod.id);
      if (exists) return prev.filter(m => m.id !== mod.id);
      return [...prev, mod];
    });
  };

  const currentPrice = (product.price + selectedModifiers.reduce((acc, m) => acc + m.price, 0)) * quantity;

  const handleSave = () => {
    if (modifierModalData.existingItem) {
      updateItem(modifierModalData.existingItem.cartItemId, {
        selectedModifiers,
        notes,
        quantity // usually qty is updated in cart directly, but here we can reset if needed
      });
    } else {
      addItem(product, selectedModifiers, notes, quantity);
    }
    closeModifierModal();
  };

  return (
    <Dialog open={isModifierModalOpen} onOpenChange={closeModifierModal}>
      <DialogContent className="max-w-2xl bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-emerald-400">{product.nameAr}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {/* Modifiers Sections */}
            <div>
              <h3 className="font-bold mb-3 text-lg border-b border-slate-600 pb-1">الإضافات</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableModifiers.map(mod => (
                  <div key={mod.id} className="flex items-center space-x-2 space-x-reverse bg-slate-700 p-3 rounded-lg border border-slate-600">
                    <Checkbox
                      id={`mod-${mod.id}`}
                      checked={selectedModifiers.some(m => m.id === mod.id)}
                      onCheckedChange={() => toggleModifier(mod)}
                      className="border-slate-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div className="flex justify-between w-full mr-2">
                      <Label htmlFor={`mod-${mod.id}`} className="cursor-pointer text-lg">{mod.nameAr}</Label>
                      <span className="text-emerald-400 font-bold">{mod.price > 0 ? formatPrice(mod.price) : 'مجاني'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-lg">ملاحظات</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-2 text-lg"
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-slate-700 pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-slate-600 bg-slate-700 text-white hover:bg-slate-600 hover:text-white"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-bold w-12 text-center text-white">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-slate-600 bg-slate-700 text-white hover:bg-slate-600 hover:text-white"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-2xl text-emerald-400 mr-4">
              {formatPrice(currentPrice)}
            </span>
          </div>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-lg px-8 h-12">
            {modifierModalData.existingItem ? 'تحديث' : 'إضافة للطلب'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
