import { useRef, useState } from 'react';
import { Search, Bell, Settings, X, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUIStore } from '@/store/uiStore';
import { clsx } from 'clsx';

export const TopBar = () => {
  const { openSettingsModal, searchQuery, setSearchQuery } = useUIStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  };

  // Simulated notifications
  const notifications = [
    { id: 1, title: 'تم إكمال الطلب #2024-005', time: 'منذ دقيقتين', type: 'success' },
    { id: 2, title: 'نفذت كمية "كوكاكولا"', time: 'منذ 15 دقيقة', type: 'warning' },
    { id: 3, title: 'تم إرسال الطلب للمطبخ', time: 'منذ ساعة', type: 'info' },
  ];

  return (
    <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 sticky top-0 z-10 text-slate-50 shadow-sm">
      <div className="flex items-center gap-4 w-[30%]">
        <h1 className="text-xl font-bold text-white tracking-wide">صاج العرب <span className="text-emerald-500">POS</span></h1>
      </div>

      <div className="flex flex-col items-center justify-center w-[20%]">
        <span className="text-sm font-semibold text-emerald-400">نظام الكاشير</span>
        <span className="text-xs text-slate-400">{new Date().toLocaleDateString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="flex items-center justify-end gap-2 w-[50%]">
        {/* Animated Search Bar */}
        <div className={clsx("flex items-center transition-all duration-300 ease-in-out overflow-hidden", isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0")}>
          <div className="relative w-full">
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 bg-slate-700 border-slate-600 text-white pl-8 pr-3 text-right"
              placeholder="بحث عن منتج..."
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <Button
          variant={isSearchOpen ? "secondary" : "ghost"}
          size="icon"
          className={clsx("text-slate-300 hover:bg-slate-700 hover:text-white transition-colors", isSearchOpen && "bg-slate-700 text-white")}
          onClick={toggleSearch}
        >
          {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-700 hover:text-white relative transition-colors">
              <Bell className="h-5 w-5" />
              <Badge className="absolute top-1 right-1 h-2.5 w-2.5 p-0 bg-red-500 border-2 border-slate-800 rounded-full animate-pulse" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-slate-800 border-slate-700 shadow-xl mr-4">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center">
              <h4 className="font-semibold text-white">التنبيهات</h4>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">جديد 3</Badge>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-slate-700">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-3 hover:bg-slate-700/50 transition-colors cursor-pointer flex gap-3 items-start">
                    {notif.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />}
                    {notif.type === 'warning' && <Clock className="h-5 w-5 text-amber-500 mt-0.5" />}
                    {notif.type === 'info' && <Bell className="h-5 w-5 text-blue-500 mt-0.5" />}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-200 leading-none">{notif.title}</p>
                      <p className="text-xs text-slate-500">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-slate-700">
              <Button variant="ghost" className="w-full text-xs h-8 text-slate-400 hover:text-white">
                مسح الكل
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          onClick={openSettingsModal}
        >
          <Settings className="h-5 w-5 animate-spin-slow hover:animate-spin" style={{ animationDuration: '3s' }} />
        </Button>
      </div>
    </div>
  );
};
