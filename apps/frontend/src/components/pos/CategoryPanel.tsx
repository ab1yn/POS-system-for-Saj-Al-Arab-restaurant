import { useCategories } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clsx } from 'clsx';
import { useUIStore } from '@/store/uiStore';
import { Spinner } from '@/components/ui/spinner';

export const CategoryPanel = () => {
  const { data: categories, isLoading } = useCategories();
  const { activeCategoryId, setActiveCategory } = useUIStore();

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-r border-slate-700">
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <h2 className="text-xl font-bold text-slate-100 mb-4">الأقسام</h2>
        <Button
          variant="ghost"
          className={clsx(
            "w-full justify-start h-12 text-lg font-bold border transition-all",
            activeCategoryId === null
              ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500"
              : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"
          )}
          onClick={() => setActiveCategory(null)}
        >
          الكل
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4 bg-slate-900">
        <div className="grid gap-3 pt-4">
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={clsx(
                "w-full h-16 text-xl font-bold border justify-start px-6 transition-all",
                activeCategoryId === category.id
                  ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-md shadow-emerald-900/20"
                  : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-500"
              )}
              onClick={() => setActiveCategory(category.id!)}
            >
              {category.nameAr}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
