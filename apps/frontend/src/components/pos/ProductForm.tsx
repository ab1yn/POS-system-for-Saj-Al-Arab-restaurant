import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUIStore } from '@/store/uiStore';
import { useCategories, useCreateProduct, useUpdateProduct } from '@/lib/hooks';

const productSchema = z.object({
  nameAr: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  name: z.string().optional(),
  price: z.number().min(0, 'السعر يجب أن يكون موجب'),
  categoryId: z.number().min(1, 'يجب اختيار القسم'),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductForm = () => {
  const { isProductFormOpen, closeProductForm, editingProduct } = useUIStore();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameAr: '',
      name: '',
      price: 0,
      categoryId: undefined,
      description: '',
    }
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        nameAr: editingProduct.nameAr,
        name: editingProduct.name || '',
        price: editingProduct.price,
        categoryId: editingProduct.categoryId,
        description: editingProduct.description || '',
      });
    } else {
      form.reset({
        nameAr: '',
        name: '',
        price: 0,
        categoryId: undefined,
        description: '',
      });
    }
  }, [editingProduct, form]);

  const onSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data }, {
        onSuccess: () => closeProductForm()
      });
    } else {
      createProduct.mutate(data, {
        onSuccess: () => closeProductForm()
      });
    }
  };

  return (
    <Dialog open={isProductFormOpen} onOpenChange={closeProductForm}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameAr" className="text-right block">الاسم بالعربية</Label>
            <Input id="nameAr" {...form.register('nameAr')} className="bg-slate-800 border-slate-600 text-right" />
            {form.formState.errors.nameAr && <span className="text-red-500 text-sm">{form.formState.errors.nameAr.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-right block">السعر</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                className="bg-slate-800 border-slate-600 text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-right block">القسم</Label>
              <Select
                onValueChange={(val) => form.setValue('categoryId', parseInt(val))}
                defaultValue={editingProduct?.categoryId?.toString()}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-right [&>span]:ml-auto [&>svg]:mr-2">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()} className="text-right focus:bg-slate-700 focus:text-white cursor-pointer select-none">
                      {cat.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && <span className="text-red-500 text-sm">{form.formState.errors.categoryId.message}</span>}
            </div>
          </div>

          <DialogFooter className="mt-6 flex-row-reverse justify-start gap-2">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500">حفظ</Button>
            <Button type="button" variant="outline" onClick={closeProductForm} className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800">إلغاء</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
