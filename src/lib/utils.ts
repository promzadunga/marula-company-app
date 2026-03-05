import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const prefix = 'MRU';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateRentalNumber(): string {
  const prefix = 'RNT';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Order statuses
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-indigo-100 text-indigo-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-orange-100 text-orange-800',
    // Rental statuses
    CONFIRMED: 'bg-green-100 text-green-800',
    ACTIVE: 'bg-blue-100 text-blue-800',
    RETURNED: 'bg-gray-100 text-gray-800',
    OVERDUE: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateRentalPrice(
  days: number,
  dailyRate: number,
  weeklyRate?: number | null,
  monthlyRate?: number | null
): number {
  if (monthlyRate && days >= 30) {
    const months = Math.floor(days / 30);
    const extraDays = days % 30;
    return months * monthlyRate + extraDays * dailyRate;
  } else if (weeklyRate && days >= 7) {
    const weeks = Math.floor(days / 7);
    const extraDays = days % 7;
    return weeks * weeklyRate + extraDays * dailyRate;
  }
  return days * dailyRate;
}
