import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const NotesModal = () => {
  const { isNotesModalOpen, closeNotesModal } = useUIStore();
  const { globalNotes, setGlobalNotes } = useCartStore();

  const [notes, setNotes] = useState(globalNotes);

  // Sync state when modal opens
  useEffect(() => {
    if (isNotesModalOpen) {
      setNotes(globalNotes);
    }
  }, [isNotesModalOpen, globalNotes]);

  const handleSave = () => {
    setGlobalNotes(notes);
    toast.success('تم حفظ الملاحظات');
    closeNotesModal();
  };

  return (
    <Dialog open={isNotesModalOpen} onOpenChange={closeNotesModal}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ملاحظات الطلب</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="أدخل ملاحظات عامة للطلب هنا... (مثل: بدون خضار، زيادة شطة، إلخ)"
            className="min-h-[150px] bg-slate-700 border-slate-600 text-white resize-none text-lg"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeNotesModal} className="text-slate-800">إلغاء</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 px-8">حفظ</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
