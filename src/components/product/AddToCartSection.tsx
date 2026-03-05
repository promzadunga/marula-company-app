'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Variant {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stockQuantity: number;
  isActive: boolean;
}

interface AddToCartSectionProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    stockQuantity: number;
    variants: Variant[];
    images: { url: string; isPrimary: boolean }[];
  };
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const hasVariants = product.variants.length > 0;
  const activeVariants = product.variants.filter((v) => v.isActive && v.stockQuantity > 0);

  // Determine price and stock based on variant or product
  const currentPrice = selectedVariant
    ? selectedVariant.salePrice || selectedVariant.price
    : product.salePrice || product.price;
  const originalPrice = selectedVariant
    ? selectedVariant.price
    : product.price;
  const hasDiscount = currentPrice < originalPrice;
  const maxQuantity = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;
  const isInStock = maxQuantity > 0;

  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, maxQuantity)));
  };

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error('This item is out of stock');
      return;
    }

    if (hasVariants && !selectedVariant) {
      toast.error('Please select a size/variant');
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantName: selectedVariant?.name,
      price: currentPrice,
      quantity,
      image: primaryImage,
      maxQuantity,
    });

    setIsAdded(true);
    toast.success(`${product.name} added to cart!`);

    // Reset the "added" state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-brown-100 space-y-5">
      <h3 className="font-semibold text-brown-900 flex items-center gap-2">
        <ShoppingCart size={20} className="text-primary-500" />
        Purchase This Item
      </h3>

      {/* Price Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary-500">
          {formatCurrency(currentPrice)}
        </span>
        {hasDiscount && (
          <span className="text-lg text-brown-400 line-through">
            {formatCurrency(originalPrice)}
          </span>
        )}
      </div>

      {/* Variant Selection */}
      {hasVariants && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-brown-700">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {activeVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariant(variant);
                  setQuantity(1);
                }}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  selectedVariant?.id === variant.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-brown-200 hover:border-primary-300 text-brown-700'
                }`}
              >
                {variant.name}
                {variant.salePrice && variant.salePrice < variant.price && (
                  <span className="ml-1 text-xs text-green-600">Sale</span>
                )}
              </button>
            ))}
          </div>
          {activeVariants.length === 0 && (
            <p className="text-sm text-red-500">All sizes are currently out of stock</p>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-brown-700">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-lg border border-brown-200 flex items-center justify-center hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-lg font-semibold text-brown-900">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity}
            className="w-10 h-10 rounded-lg border border-brown-200 flex items-center justify-center hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus size={16} />
          </button>
          <span className="text-sm text-brown-500">
            {maxQuantity} available
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-3 px-4 bg-brown-50 rounded-lg">
        <span className="text-brown-700 font-medium">Total</span>
        <span className="text-xl font-bold text-primary-500">
          {formatCurrency(currentPrice * quantity)}
        </span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-sm">
        {isInStock ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-green-600 font-medium">In Stock</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-red-600 font-medium">Out of Stock</span>
          </>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!isInStock || (hasVariants && activeVariants.length === 0)}
        className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition ${
          isAdded
            ? 'bg-green-500 text-white'
            : 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-brown-300 disabled:cursor-not-allowed'
        }`}
      >
        {isAdded ? (
          <>
            <Check size={20} />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
