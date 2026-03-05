'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Clock, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingPostal: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${id}/public`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-50 py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brown-50 py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find the order you&apos;re looking for.
            </p>
            <Link href="/" className="text-primary-500 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'PAID';
  const isPending = order.paymentStatus === 'PENDING';

  return (
    <div className="min-h-screen bg-brown-50 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status Header */}
          <div className="text-center mb-8">
            {isPaid ? (
              <>
                <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600">
                  Thank you for your purchase. Your payment has been received.
                </p>
              </>
            ) : (
              <>
                <Clock className="mx-auto mb-4 text-yellow-500" size={64} />
                <h1 className="text-3xl font-bold text-yellow-700 mb-2">Order Received</h1>
                <p className="text-gray-600">
                  Your order has been placed. We&apos;re waiting for payment confirmation.
                </p>
              </>
            )}
          </div>

          {/* Order Number */}
          <div className="bg-brown-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-primary-600">{order.orderNumber}</p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package size={20} />
              Order Items
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-sm text-gray-500">{item.variantName}</p>
                    )}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">R {item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>R {order.subtotal.toFixed(2)}</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>R {order.shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary-600">R {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <p className="text-gray-600">{order.customerName}</p>
              <p className="text-gray-600">{order.customerEmail}</p>
              <p className="text-gray-600">{order.customerPhone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p className="text-gray-600">{order.shippingAddress}</p>
              {order.shippingCity && <p className="text-gray-600">{order.shippingCity}</p>}
              {order.shippingProvince && <p className="text-gray-600">{order.shippingProvince}</p>}
              {order.shippingPostal && <p className="text-gray-600">{order.shippingPostal}</p>}
            </div>
          </div>

          {/* Payment Status */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Payment Status</h3>
            {isPaid ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span>Payment Received</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock size={20} />
                <span>Awaiting Payment</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isPending && (
              <Link
                href={`/order/${id}/payment`}
                className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition text-center"
              >
                Complete Payment
              </Link>
            )}
            <Link
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition text-center"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            A confirmation email has been sent to {order.customerEmail}.
            <br />
            For questions, contact us at{' '}
            <a href="mailto:info@marulacompany.co.za" className="text-primary-500 hover:underline">
              info@marulacompany.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
