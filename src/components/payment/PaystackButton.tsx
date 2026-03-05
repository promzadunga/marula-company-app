'use client';

import { useEffect } from 'react';
import { CreditCard } from 'lucide-react';

interface PaystackButtonProps {
  email: string;
  amount: number; // in ZAR
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  metadata?: Record<string, unknown>;
  disabled?: boolean;
  label?: string;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: {
        key: string | undefined;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export function PaystackButton({
  email,
  amount,
  reference,
  onSuccess,
  onClose,
  metadata = {},
  disabled = false,
  label = 'Pay Now',
}: PaystackButtonProps) {
  useEffect(() => {
    // Load Paystack inline script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!window.PaystackPop) {
      alert('Payment system is loading... Please try again');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      currency: 'ZAR',
      ref: reference,
      metadata,
      callback: function (response: { reference: string }) {
        onSuccess(response.reference);
      },
      onClose: function () {
        onClose();
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
    >
      <CreditCard size={20} />
      {label}
    </button>
  );
}
