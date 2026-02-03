import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUIStore } from '@/store/uiStore';
import { useCreateCategory, useUpdateCategory } from '@/lib/hooks';

const categorySchema = z.object({
  nameAr: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  name: z.string().optional(),
  displayOrder: z.number().min(0, 'الترتيب يجب أن يكون موجب'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export const CategoryForm = () => {
  const { isCategoryFormOpen, closeCategoryForm, editingCategory } = useUIStore();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nameAr: '',
      name: '',
      displayOrder: 0,
    }
  });

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        nameAr: editingCategory.nameAr,
        name: editingCategory.name || '',
        displayOrder: editingCategory.displayOrder,
      });
    } else {
      form.reset({
        nameAr: '',
        name: '',
        displayOrder: 0,
      });
    }
  }, [editingCategory, form]);

  const onSubmit = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, data }, {
        onSuccess: () => closeCategoryForm()
      });
    } else {
      createCategory.mutate(data, {
        onSuccess: () => closeCategoryForm()
      });
    }
  };

  return (
    <Dialog open={isCategoryFormOpen} onOpenChange={closeCategoryForm}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameAr" className="text-right block">الاسم بالعربية</Label>
            <Input id="nameAr" {...form.register('nameAr')} className="bg-slate-800 border-slate-600 text-right" />
            {form.formState.errors.nameAr && <span className="text-red-500 text-sm">{form.formState.errors.nameAr.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder" className="text-right block">الترتيب</Label>
            <Input
              id="displayOrder"
              type="number"
              {...form.register('displayOrder', { valueAsNumber: true })}
              className="bg-slate-800 border-slate-600 text-right"
            />
          </div>

          <DialogFooter className="mt-6 flex-row-reverse justify-start gap-2">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500">حفظ</Button>
            <Button type="button" variant="outline" onClick={closeCategoryForm} className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800">إلغاء</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
