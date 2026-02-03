import { create } from 'zustand';

interface UIState {
  isModifierModalOpen: boolean;
  isPaymentModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isDiscountModalOpen: boolean;
  isNotesModalOpen: boolean;
  activeCategoryId: number | null;
  modifierModalData: { product: any; existingItem?: any } | null; // Typed loosely here, refactoring to shared types recommended
  paymentOrderId: number | null; // Store order ID for payment

  openModifierModal: (product: any, existingItem?: any) => void;
  closeModifierModal: () => void;

  openPaymentModal: (orderId?: number) => void;
  closePaymentModal: () => void;

  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  openDiscountModal: () => void;
  closeDiscountModal: () => void;

  openNotesModal: () => void;
  closeNotesModal: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Product/Category Management Modals
  isProductFormOpen: boolean;
  editingProduct: any | null;
  openProductForm: (product?: any) => void;
  closeProductForm: () => void;

  isCategoryFormOpen: boolean;
  editingCategory: any | null;
  openCategoryForm: (category?: any) => void;
  closeCategoryForm: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModifierModalOpen: false,
  isPaymentModalOpen: false,
  isSettingsModalOpen: false,
  isDiscountModalOpen: false,
  isNotesModalOpen: false,
  activeCategoryId: null,
  modifierModalData: null,
  paymentOrderId: null,
  searchQuery: '',

  // Product Form
  isProductFormOpen: false,
  editingProduct: null,
  openProductForm: (product) => set({ isProductFormOpen: true, editingProduct: product || null }),
  closeProductForm: () => set({ isProductFormOpen: false, editingProduct: null }),

  // Category Form
  isCategoryFormOpen: false,
  editingCategory: null,
  openCategoryForm: (category) => set({ isCategoryFormOpen: true, editingCategory: category || null }),
  closeCategoryForm: () => set({ isCategoryFormOpen: false, editingCategory: null }),

  openModifierModal: (product, existingItem) =>
    set({ isModifierModalOpen: true, modifierModalData: { product, existingItem } }),
  closeModifierModal: () =>
    set({ isModifierModalOpen: false, modifierModalData: null }),

  openPaymentModal: (orderId) => set({ isPaymentModalOpen: true, paymentOrderId: orderId || null }),
  closePaymentModal: () => set({ isPaymentModalOpen: false, paymentOrderId: null }),

  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),

  openDiscountModal: () => set({ isDiscountModalOpen: true }),
  closeDiscountModal: () => set({ isDiscountModalOpen: false }),

  openNotesModal: () => set({ isNotesModalOpen: true }),
  closeNotesModal: () => set({ isNotesModalOpen: false }),

  setActiveCategory: (id) => set({ activeCategoryId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
