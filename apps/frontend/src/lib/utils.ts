import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  // Always 2 decimal places, JOD symbol
  return `${amount.toFixed(2)} د.أ`;
}
