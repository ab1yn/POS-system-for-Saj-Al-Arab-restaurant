import { z } from 'zod';

// Enums
export const OrderType = z.enum(['takeaway', 'delivery', 'dinein']);
export const OrderStatus = z.enum(['draft', 'kitchen', 'completed', 'cancelled']);
export const ModifierType = z.enum(['addon', 'option']);
export const PaymentMethod = z.enum(['cash', 'card', 'split']);

// Base Schemas
export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  nameAr: z.string(),
  displayOrder: z.number().default(0),
  isActive: z.union([z.boolean(), z.number()]).transform((val) => Boolean(val)).default(true),
});

export const ModifierSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  nameAr: z.string(),
  price: z.number().min(0),
  type: ModifierType.default('addon'),
});

export const ProductSchema = z.object({
  id: z.number().optional(),
  categoryId: z.number(),
  name: z.string(),
  nameAr: z.string(),
  price: z.number().min(0),
  displayOrder: z.number().default(0),
  isActive: z.union([z.boolean(), z.number()]).transform((val) => Boolean(val)).default(true),
  modifiers: z.array(ModifierSchema).optional(), // For UI convenience
});

// Order Item Logic
export const OrderItemModifierSchema = z.object({
  modifierId: z.number(),
  price: z.number(), // Snapshot price
});

export const OrderItemSchema = z.object({
  id: z.number().optional(),
  productId: z.number(),
  // Including product details for UI snapshot
  productName: z.string().optional(),
  productNameAr: z.string().optional(),
  quantity: z.number().min(1),
  price: z.number(), // Unit price snapshot
  notes: z.string().optional(),
  modifiers: z.array(OrderItemModifierSchema).default([]),
});

export const OrderSchema = z.object({
  id: z.number().optional(),
  orderNumber: z.string().optional(),
  type: OrderType.default('takeaway'),
  status: OrderStatus.default('draft'),
  notes: z.string().optional(),
  items: z.array(OrderItemSchema).default([]),
  subtotal: z.number().default(0),
  discount: z.number().default(0),
  total: z.number().default(0),
  paidAt: z.string().nullable().optional(),
  sentToKitchenAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const PaymentSchema = z.object({
  id: z.number().optional(),
  orderId: z.number(),
  method: PaymentMethod,
  cashAmount: z.number().default(0),
  cardAmount: z.number().default(0),
  total: z.number(),
  createdAt: z.string().optional(),
});

// Types from Schemas
export type Category = z.infer<typeof CategorySchema>;
export type Modifier = z.infer<typeof ModifierSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderItemModifier = z.infer<typeof OrderItemModifierSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Payment = z.infer<typeof PaymentSchema>;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
