'use client';

import { ChevronDown } from 'lucide-react';

export interface Variant {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stockQuantity: number;
  rentalPriceDaily?: number | null;
  rentalPriceWeekly?: number | null;
  rentalPriceMonthly?: number | null;
  rentalQuantity?: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string | null;
  mode: 'sale' | 'rental';
  onVariantChange: (variantId: string) => void;
}

export function VariantSelector({ variants, selectedVariantId, mode, onVariantChange }: VariantSelectorProps) {
  // If no variants, don't render anything
  if (variants.length === 0) {
    return null;
  }

  const getVariantStock = (variant: Variant) => {
    if (mode === 'sale') {
      return variant.stockQuantity;
    }
    return variant.rentalQuantity || 0;
  };

  return (
    <div className="space-y-2">
      <label htmlFor="variant-select" className="block text-sm font-medium text-brown-700">
        Size / Option
      </label>
      <div className="relative">
        <select
          id="variant-select"
          value={selectedVariantId || ''}
          onChange={(e) => onVariantChange(e.target.value)}
          className="w-full appearance-none bg-white border border-brown-200 rounded-lg py-3 px-4 pr-10 text-brown-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
        >
          <option value="">Select a size</option>
          {variants.map((variant) => {
            const stock = getVariantStock(variant);
            const isAvailable = stock > 0;
            return (
              <option
                key={variant.id}
                value={variant.id}
                disabled={!isAvailable}
              >
                {variant.name} {!isAvailable ? '(Out of stock)' : ''}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
