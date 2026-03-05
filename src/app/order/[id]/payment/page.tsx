'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { PaymentMethodSelector, PaymentMethod } from '@/components/payment/PaymentMethodSelector';
import { CardPaymentForm } from '@/components/payment/CardPaymentForm';
import { BankTransferDetails } from '@/components/payment/BankTransferDetails';
import { InStorePaymentDetails } from '@/components/payment/InStorePaymentDetails';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  total: number;
  subtotal: number;
  shippingCost: number;
}

interface PaymentSettings {
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    accountType: string;
  };
  storeDetails: {
    name: string;
    address: string;
    phone: string;
    hours: string;
  };
}

const defaultSettings: PaymentSettings = {
  bankDetails: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchCode: '',
    accountType: '',
  },
  storeDetails: {
    name: '',
    address: '',
    phone: '',
    hours: '',
  },
};

export default function PaymentPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentReference, setPaymentReference] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultSettings);

  useEffect(() => {
    fetchOrderDetails();
    fetchPaymentSettings();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${id}/public`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setOrder(data.order);
      // Generate reference with order number
      generatePaymentReference(data.order.orderNumber);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/payment');
      if (response.ok) {
        const data = await response.json();
        setPaymentSettings(data);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const generatePaymentReference = (orderNumber: string) => {
    // Generate reference linked to order: ORD-XXXX-ABCD (order number + 4 random chars)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPaymentReference(`${orderNumber}-${code}`);
  };

  const handlePaymentSuccess = async (reference: string) => {
    setVerifying(true);
    const loadingToast = toast.loading('Verifying payment...');

    try {
      const response = await fetch(`/api/orders/${id}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      toast.success('Payment successful! Your order has been confirmed.', {
        id: loadingToast,
        duration: 5000,
      });

      // Redirect to order confirmation page
      setTimeout(() => {
        router.push(`/order/${id}/confirmation`);
      }, 2000);
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment verification failed. Please contact support with reference: ' + reference, {
        id: loadingToast,
        duration: 10000,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handlePaymentClose = () => {
    toast.error('Payment cancelled');
  };

  const handlePendingPayment = async (paymentMethod: 'bank_transfer' | 'in_store') => {
    if (!order) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      paymentMethod === 'bank_transfer'
        ? 'Recording your transfer...'
        : 'Confirming in-store payment...'
    );

    try {
      const response = await fetch(`/api/orders/${id}/payment/pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: paymentReference,
          paymentMethod,
          amount: order.total,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      const message =
        paymentMethod === 'bank_transfer'
          ? 'Transfer recorded! We will verify and confirm within 24-48 hours.'
          : 'In-store payment confirmed! Please visit our store within 7 days.';

      toast.success(message, {
        id: loadingToast,
        duration: 5000,
      });

      // Redirect to order confirmation page
      setTimeout(() => {
        router.push(`/order/${id}/confirmation`);
      }, 2000);
    } catch (error) {
      console.error('Pending payment error:', error);
      toast.error('Failed to record payment. Please try again.', {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-50 py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading payment details...</p>
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
            <XCircle className="mx-auto mb-4 text-red-500" size={64} />
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

  if (order.paymentStatus === 'PAID') {
    return (
      <div className="min-h-screen bg-brown-50 py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
            <h1 className="text-2xl font-bold mb-4">Payment Already Received</h1>
            <p className="text-gray-600 mb-6">
              The payment for this order has already been received.
            </p>
            <Link
              href={`/order/${id}/confirmation`}
              className="inline-block bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              View Order Confirmation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-50 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CreditCard className="mx-auto mb-4 text-primary-500" size={48} />
            <h1 className="text-3xl font-bold mb-2">Payment</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-brown-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">R {order.subtotal.toFixed(2)}</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">R {order.shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">Total Due:</span>
                <span className="text-2xl font-bold text-primary-600">R {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onMethodSelect={setSelectedMethod}
          />

          {/* Divider */}
          <div className="border-t my-8"></div>

          {/* Payment Form based on selection */}
          {selectedMethod === 'card' ? (
            !verifying ? (
              <CardPaymentForm
                email={order.customerEmail}
                amount={order.total}
                reference={paymentReference}
                onSuccess={handlePaymentSuccess}
                onClose={handlePaymentClose}
                metadata={{
                  orderId: order.id,
                  orderNumber: order.orderNumber,
                  customerName: order.customerName,
                  paymentType: 'full',
                }}
                isProcessing={isSubmitting}
                setIsProcessing={setIsSubmitting}
              />
            ) : (
              <div className="text-center py-8">
                <Loader className="animate-spin mx-auto mb-4" size={48} />
                <p className="text-gray-600">Verifying payment...</p>
              </div>
            )
          ) : selectedMethod === 'bank_transfer' ? (
            <BankTransferDetails
              orderNumber={order.orderNumber}
              amount={order.total}
              reference={paymentReference}
              bankDetails={paymentSettings.bankDetails}
              onConfirmTransfer={() => handlePendingPayment('bank_transfer')}
              isSubmitting={isSubmitting}
            />
          ) : selectedMethod === 'in_store' ? (
            <InStorePaymentDetails
              orderNumber={order.orderNumber}
              amount={order.total}
              reference={paymentReference}
              storeDetails={paymentSettings.storeDetails}
              onConfirmInStore={() => handlePendingPayment('in_store')}
              isSubmitting={isSubmitting}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
