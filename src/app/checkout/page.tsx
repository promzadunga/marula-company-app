'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, MapPin, ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface OrderData {
  id: string;
  orderNumber: string;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, itemCount, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer form fields
  const [customerName, setCustomerName] = useState(session?.user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(session?.user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingProvince, setShippingProvince] = useState('');
  const [shippingPostal, setShippingPostal] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brown-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag size={64} className="mx-auto text-brown-300 mb-6" />
          <h1 className="text-2xl font-bold text-brown-900 mb-4">Your Cart is Empty</h1>
          <p className="text-brown-600 mb-8">Add some items before checking out.</p>
          <Link
            href="/marula-oil"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!customerEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }
    if (!shippingCity.trim()) {
      toast.error('Please enter your city');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            variantName: item.variantName,
          })),
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          shippingCity,
          shippingProvince,
          shippingPostal,
          deliveryNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Clear cart and redirect to payment
      clearCart();
      toast.success('Order created! Redirecting to payment...');

      // Redirect to payment page
      router.push(`/order/${data.data.id}/payment`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-brown-600 hover:text-primary-500 transition mb-4"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-brown-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Details */}
              <div className="bg-white rounded-xl p-6 border border-brown-100">
                <h2 className="text-lg font-semibold text-brown-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-primary-500" />
                  Contact Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      <Mail size={14} className="inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      <Phone size={14} className="inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="071 234 5678"
                      className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-xl p-6 border border-brown-100">
                <h2 className="text-lg font-semibold text-brown-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary-500" />
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="123 Main Street, Unit 4"
                      className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        placeholder="Johannesburg"
                        className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Province
                      </label>
                      <select
                        value={shippingProvince}
                        onChange={(e) => setShippingProvince(e.target.value)}
                        className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Province</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="North West">North West</option>
                        <option value="Northern Cape">Northern Cape</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingPostal}
                        onChange={(e) => setShippingPostal(e.target.value)}
                        placeholder="2000"
                        className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={2}
                      className="w-full border border-brown-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border border-brown-100 sticky top-24">
                <h2 className="text-lg font-semibold text-brown-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || 'default'}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brown-100 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brown-400">
                            <ShoppingBag size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brown-900 truncate">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-brown-500">{item.variantName}</p>
                        )}
                        <p className="text-xs text-brown-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-brown-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brown-100 pt-4 space-y-2">
                  <div className="flex justify-between text-brown-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-brown-600">
                    <span>Shipping</span>
                    <span className="text-brown-500">To be confirmed</span>
                  </div>
                  <div className="border-t border-brown-100 pt-2 flex justify-between">
                    <span className="font-semibold text-brown-900">Total</span>
                    <span className="font-bold text-xl text-primary-500">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-brown-300 disabled:cursor-not-allowed transition mt-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Continue to Payment
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-brown-500 mt-4">
                  You&apos;ll be redirected to our secure payment page to complete your order.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
