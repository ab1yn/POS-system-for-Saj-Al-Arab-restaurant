import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUIStore } from '@/store/uiStore';
import { useProducts, useCategories, useDeleteProduct, useDeleteCategory } from '@/lib/hooks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit, Trash2, TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from './ProductForm';
import { CategoryForm } from './CategoryForm';

export const SettingsModal = () => {
  const {
    isSettingsModalOpen,
    closeSettingsModal,
    openProductForm,
    openCategoryForm
  } = useUIStore();

  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const deleteProduct = useDeleteProduct();
  const deleteCategory = useDeleteCategory();

  const handleDeleteProduct = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct.mutate(id);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      deleteCategory.mutate(id);
    }
  };

  // Mock data for reports
  const stats = [
    { title: 'مبيعات اليوم', value: '750.00 د.أ', icon: DollarSign, color: 'text-emerald-400' },
    { title: 'عدد الطلبات', value: '45', icon: ShoppingBag, color: 'text-blue-400' },
    { title: 'العملاء الجدد', value: '12', icon: Users, color: 'text-purple-400' },
    { title: 'الأكثر مبيعاً', value: 'شاورما دجاج', icon: TrendingUp, color: 'text-amber-400' },
  ];

  return (
    <>
      <Dialog open={isSettingsModalOpen} onOpenChange={closeSettingsModal}>
        <DialogContent className="max-w-5xl h-[700px] bg-slate-900 text-white border-slate-700 flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 bg-slate-800 border-b border-slate-700">
            <DialogTitle className="text-2xl text-emerald-400">إدارة النظام</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="products" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4 bg-slate-800 border-b border-slate-700">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700 p-1 mb-4 h-12">
                <TabsTrigger value="products" className="data-[state=active]:bg-slate-600 h-10 text-base">المنتجات</TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-slate-600 h-10 text-base">الأقسام</TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-slate-600 h-10 text-base">المستخدمين</TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-slate-600 h-10 text-base">التقارير</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 bg-slate-900 p-6 overflow-hidden">
              {/* Products Tab */}
              <TabsContent value="products" className="h-full flex flex-col m-0 space-y-4 data-[state=inactive]:hidden">
                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-md border border-slate-700 mb-4">
                  <h3 className="text-xl font-bold">قائمة المنتجات ({products?.length || 0})</h3>
                  <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2" onClick={() => openProductForm()}>
                    <Plus className="h-4 w-4" /> إضافة منتج
                  </Button>
                </div>
                <div className="border border-slate-700 rounded-md flex-1 overflow-hidden bg-slate-800/50">
                  <ScrollArea className="h-[450px]">
                    <div className="min-w-full inline-block align-middle">
                      <Table>
                        <TableHeader className="bg-slate-800 sticky top-0 z-10">
                          <TableRow className="border-slate-700 hover:bg-slate-800">
                            <TableHead className="text-right text-slate-300">اسم المنتج</TableHead>
                            <TableHead className="text-right text-slate-300">السعر</TableHead>
                            <TableHead className="text-right text-slate-300">القسم</TableHead>
                            <TableHead className="text-center text-slate-300 w-[100px]">إجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products?.map((product) => (
                            <TableRow key={product.id} className="border-slate-700 hover:bg-slate-700/50">
                              <TableCell className="font-medium text-slate-100">{product.nameAr}</TableCell>
                              <TableCell className="text-emerald-400 font-bold">{formatPrice(product.price)}</TableCell>
                              <TableCell className="text-slate-400">{categories?.find(c => c.id === product.categoryId)?.nameAr || '-'}</TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-slate-700" onClick={() => openProductForm(product)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-slate-700" onClick={() => handleDeleteProduct(product.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="h-full flex flex-col m-0 space-y-4 data-[state=inactive]:hidden">
                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-md border border-slate-700 mb-4">
                  <h3 className="text-xl font-bold">الأقسام ({categories?.length || 0})</h3>
                  <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2" onClick={() => openCategoryForm()}>
                    <Plus className="h-4 w-4" /> إضافة قسم
                  </Button>
                </div>
                <div className="border border-slate-700 rounded-md flex-1 overflow-hidden bg-slate-800/50">
                  <ScrollArea className="h-[450px]">
                    <div className="min-w-full inline-block align-middle">
                      <Table>
                        <TableHeader className="bg-slate-800 sticky top-0 z-10">
                          <TableRow className="border-slate-700 hover:bg-slate-800">
                            <TableHead className="text-right text-slate-300">اسم القسم</TableHead>
                            <TableHead className="text-right text-slate-300">الترتيب</TableHead>
                            <TableHead className="text-center text-slate-300 w-[100px]">إجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories?.map((category) => (
                            <TableRow key={category.id} className="border-slate-700 hover:bg-slate-700/50">
                              <TableCell className="font-medium text-slate-100">{category.nameAr}</TableCell>
                              <TableCell className="text-slate-400">#{category.displayOrder}</TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-slate-700" onClick={() => openCategoryForm(category)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-slate-700" onClick={() => handleDeleteCategory(category.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="h-full flex flex-col m-0 space-y-4 data-[state=inactive]:hidden">
                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-md border border-slate-700 mb-4">
                  <h3 className="text-xl font-bold">المستخدمين</h3>
                  <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2">
                    <Plus className="h-4 w-4" /> إضافة مستخدم
                  </Button>
                </div>
                <div className="border border-slate-700 rounded-md flex-1 overflow-hidden bg-slate-800/50">
                  <ScrollArea className="h-[450px]">
                    <Table>
                      <TableHeader className="bg-slate-800 sticky top-0 z-10">
                        <TableRow className="border-slate-700 hover:bg-slate-800">
                          <TableHead className="text-right text-slate-300">اسم المستخدم</TableHead>
                          <TableHead className="text-right text-slate-300">الدور</TableHead>
                          <TableHead className="text-center text-slate-300 w-[100px]">إجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-slate-700 hover:bg-slate-700/50">
                          <TableCell className="font-medium text-slate-100">admin</TableCell>
                          <TableCell className="text-emerald-400">مدير النظام</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-slate-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="h-full flex flex-col m-0 space-y-4 data-[state=inactive]:hidden">
                <h3 className="text-xl font-bold mb-4">ملخص اليوم</h3>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, i) => (
                    <Card key={i} className="bg-slate-800 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex-1 bg-slate-800/50 rounded-md border border-slate-700 p-8 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>الرسوم البيانية قادمة قريباً...</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
      <ProductForm />
      <CategoryForm />
    </>
  )
}
