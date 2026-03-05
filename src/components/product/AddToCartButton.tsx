'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stockQuantity: number;
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const increment = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const addToCart = async () => {
    setIsAdding(true);

    // TODO: Implement actual cart logic with context/localStorage
    // For now, just show a toast
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success(`${quantity} x ${product.name} added to cart!`);
    setIsAdding(false);
  };

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="space-y-3">
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
            disabled={quantity >= product.stockQuantity}
            className="p-2 hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={addToCart}
        disabled={isOutOfStock || isAdding}
        className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-brown-300 disabled:cursor-not-allowed transition"
      >
        <ShoppingCart size={20} />
        {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
