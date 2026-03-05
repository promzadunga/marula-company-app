'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { VariantSelector, Variant } from './VariantSelector';
import { useCart } from '@/contexts/CartContext';

interface ProductPurchaseSectionProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    stockQuantity: number;
    image?: string;
  };
  variants: Variant[];
}

export function ProductPurchaseSection({ product, variants }: ProductPurchaseSectionProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const hasVariants = variants.length > 0;
  const selectedVariant = variants.find(v => v.id === selectedVariantId) || null;

  // Determine current price and stock based on selection
  const currentPrice = selectedVariant
    ? (selectedVariant.salePrice || selectedVariant.price)
    : (product.salePrice || product.price);

  const originalPrice = selectedVariant
    ? selectedVariant.price
    : product.price;

  const currentStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;

  const hasDiscount = selectedVariant
    ? (selectedVariant.salePrice && selectedVariant.salePrice < selectedVariant.price)
    : (product.salePrice && product.salePrice < product.price);

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId || null);
    setQuantity(1); // Reset quantity when variant changes
  };

  const increment = () => {
    if (quantity < currentStock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      toast.error('Please select a size/option');
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantName: selectedVariant?.name,
      price: currentPrice,
      quantity,
      image: product.image,
      maxQuantity: currentStock,
    });

    const itemName = selectedVariant
      ? `${product.name} (${selectedVariant.name})`
      : product.name;

    toast.success(`${quantity} x ${itemName} added to cart!`);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = currentStock <= 0;
  const canAddToCart = !hasVariants || selectedVariant;

  return (
    <div className="bg-white rounded-xl p-6 border border-brown-100 space-y-5">
      {/* Price Display - Single price that updates */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className={`text-3xl font-bold ${hasDiscount ? 'text-primary-500' : 'text-brown-900'}`}>
          {formatCurrency(currentPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-xl text-brown-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
            <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
              Save {formatCurrency(originalPrice - currentPrice)}
            </span>
          </>
        )}
      </div>

      {/* Variant Dropdown */}
      {hasVariants && (
        <VariantSelector
          variants={variants}
          selectedVariantId={selectedVariantId}
          mode="sale"
          onVariantChange={handleVariantChange}
        />
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-brown-600">Quantity:</span>
        <div className="flex items-center border border-brown-200 rounded-lg">
          <button
            onClick={decrement}
            disabled={quantity <= 1}
            className="p-2 hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={increment}
            disabled={quantity >= currentStock || !canAddToCart}
            className="p-2 hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus size={18} />
          </button>
        </div>
        {canAddToCart && currentStock > 0 && (
          <span className="text-sm text-brown-500">({currentStock} available)</span>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || (hasVariants && !selectedVariant)}
        className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition ${
          isAdded
            ? 'bg-green-500 text-white'
            : 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-brown-300 disabled:cursor-not-allowed'
        }`}
      >
        {isAdded ? (
          <>
            <Check size={20} />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            {isOutOfStock
              ? 'Out of Stock'
              : hasVariants && !selectedVariant
                ? 'Select a Size'
                : 'Add to Cart'
            }
          </>
        )}
      </button>
    </div>
  );
}
