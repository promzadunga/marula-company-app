'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brown-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart size={64} className="mx-auto text-brown-300 mb-6" />
            <h1 className="text-2xl font-bold text-brown-900 mb-4">Your Cart is Empty</h1>
            <p className="text-brown-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marula-oil"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
              >
                <ShoppingBag size={20} />
                Shop Marula Oil
              </Link>
              <Link
                href="/mobile-solutions"
                className="inline-flex items-center justify-center gap-2 border border-brown-300 text-brown-700 px-6 py-3 rounded-lg font-semibold hover:bg-brown-100 transition"
              >
                Browse Mobile Solutions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brown-900">Shopping Cart</h1>
            <p className="text-brown-600">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || 'default'}`}
                className="bg-white rounded-xl p-4 border border-brown-100 flex gap-4"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-brown-100 flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown-400">
                      <ShoppingBag size={32} />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brown-900 truncate">{item.name}</h3>
                  {item.variantName && (
                    <p className="text-sm text-brown-500">Size: {item.variantName}</p>
                  )}
                  <p className="text-primary-500 font-bold mt-1">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-brown-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="p-1.5 hover:bg-brown-50 transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="p-1.5 hover:bg-brown-50 disabled:opacity-50 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-red-500 hover:text-red-600 p-1.5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right">
                  <p className="font-bold text-brown-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/marula-oil"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium mt-4"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-brown-100 sticky top-24">
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-brown-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brown-600">
                  <span>Shipping</span>
                  <span className="text-brown-500">Calculated at checkout</span>
                </div>
                <div className="border-t border-brown-100 pt-3 flex justify-between">
                  <span className="font-semibold text-brown-900">Total</span>
                  <span className="font-bold text-xl text-primary-500">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition"
              >
                <ShoppingBag size={20} />
                Proceed to Checkout
              </Link>

              <p className="text-center text-sm text-brown-500 mt-4">
                Secure checkout powered by SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
