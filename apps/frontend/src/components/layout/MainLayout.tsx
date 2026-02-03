import { TopBar } from '../pos/TopBar';
import { CategoryPanel } from '../pos/CategoryPanel';
import { OrderPanel } from '../pos/OrderPanel';
import { ProductGrid } from '../pos/ProductGrid';
import { ModifierModal } from '../pos/ModifierModal';
import { PaymentModal } from '../pos/PaymentModal';
import { SettingsModal } from '../pos/SettingsModal';

export const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-900 text-slate-50 font-sans" dir="rtl">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Order Panel (30%) */}
        {/* Note: In RTL, Left is actually Right Visually but Left in DOM flow if dir=rtl? 
            RTL flips it. So First element is Right. DOM Order: 1, 2, 3. 
            Visual: 3, 2, 1? No.
            Tailwind flex-row with dir=rtl: First item is Right.
            The spec says:
            Left Column (Order) - Middle (Cat) - Right (Product).
            In RTL, "Left" visually is the "End" of the axis.
            So if we want Visual Layout: [Order (Left?)] [Categories] [Products (Right?)]
            Wait, the spec diagram:
            ┌─────────────────────┐
            │       TOP           │
            ├──────┬──────┬───────┤
            │ORDER │ CAT  │ PROD  │
            │(30%) │ (20%)│ (50%) │
            └──────┴──────┴───────┘
            If "Order" is visually on the Left, in RTL mode (Arabic), users usually expect "Order" on the LEFT?
            Actually, Arabic POS usually has Order on Left or Right.
            Spec says "LEFT COLUMN (30%) - ORDER PANEL".
            So visually Left.
            In RTL Flexbox:
            <div flex>
               <Item1 /> (Starts at Right)
               <Item2 />
               <Item3 /> (Ends at Left)
            </div>
            So if I want Order on Visual Left, it should be the LAST element in the DOM if using Flexbox Row.
            Let's verify:
            dir=rtl.
            <div flex>
               <RightItem />
               <MiddleItem />
               <LeftItem />
            </div>
            Renders: [RightItem] [MiddleItem] [LeftItem] ... Wait.
            Start (Right Side) -> End (Left Side).
            So Item 1 is Right. Item 3 is Left.
            
            So DOM Order should be:
            1. Product Grid (Rigth 50%)
            2. Categories (Center 20%)
            3. Order Panel (Left 30%)
            
            Let's stick to this DOM order to achieve Visual Left for Order Panel.
        */}

        <div className="w-[50%] h-full">
          <ProductGrid />
        </div>

        <div className="w-[20%] h-full">
          <CategoryPanel />
        </div>

        <div className="w-[30%] h-full">
          <OrderPanel />
        </div>
      </div>

      <ModifierModal />
      <PaymentModal />
      <SettingsModal />
    </div>
  );
};
