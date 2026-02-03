import { useProducts } from '@/lib/hooks';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export const ProductGrid = () => {
  const { activeCategoryId, openModifierModal, searchQuery } = useUIStore();
  const { data: allProducts, isLoading } = useProducts(activeCategoryId);
  const addItem = useCartStore((state) => state.addItem);

  // Client-side filtering for search
  const products = searchQuery
    ? allProducts?.filter(p =>
      p.nameAr.includes(searchQuery) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : allProducts;

  const handleProductClick = (product: any) => {
    // If product has modifiers, open modal
    if (product.modifiers && product.modifiers.length > 0) {
      openModifierModal(product);
    } else {
      // Add directly to cart
      addItem(product);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-white text-lg font-bold">
          {activeCategoryId ? 'المنتجات' : 'كل المنتجات'}
          <span className="text-slate-500 text-sm mr-2">({products?.length || 0})</span>
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-4 pb-20">
          {products?.map((product) => (
            <Card
              key={product.id}
              className="
                  cursor-pointer 
                  hover:scale-105 active:scale-95 transition-transform 
                  border-slate-700 bg-slate-800 hover:border-emerald-500
                  flex flex-col justify-between
                  min-h-[140px] p-4
                "
              onClick={() => handleProductClick(product)}
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-50 leading-tight">
                  {product.nameAr}
                </h3>
                {/* Category indicator dot could go here */}
              </div>

              <div className="mt-4 flex justify-end">
                <span className="text-emerald-400 font-bold text-2xl" dir="ltr">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
