'use client';

import { MapPin, Clock, Phone, CheckCircle } from 'lucide-react';

interface StoreDetails {
  name: string;
  address: string;
  phone: string;
  hours: string;
}

interface InStorePaymentDetailsProps {
  orderNumber: string;
  amount: number;
  reference: string;
  storeDetails: StoreDetails;
  onConfirmInStore: () => void;
  isSubmitting: boolean;
}

export function InStorePaymentDetails({
  orderNumber,
  amount,
  reference,
  storeDetails,
  onConfirmInStore,
  isSubmitting,
}: InStorePaymentDetailsProps) {
  // Check if store details are configured
  const isStoreConfigured = storeDetails.name && storeDetails.address;

  if (!isStoreConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-yellow-900 mb-2">In-Store Payment Not Available</h3>
        <p className="text-sm text-yellow-800">
          In-store payment is currently not configured. Please choose another payment method or contact us directly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">Pay In Store</h3>
        <p className="text-sm text-green-800">
          Visit our store to pay by cash or card. We accept all major credit and debit cards.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-semibold">Store Details</h4>

        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{storeDetails.name}</p>
            <p className="text-sm text-gray-600">{storeDetails.address}</p>
          </div>
        </div>

        {storeDetails.phone && (
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-gray-400" />
            <div>
              <p className="font-medium">Contact</p>
              <a href={`tel:${storeDetails.phone}`} className="text-sm text-blue-600 hover:underline">
                {storeDetails.phone}
              </a>
            </div>
          </div>
        )}

        {storeDetails.hours && (
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Business Hours</p>
              <p className="text-sm text-gray-600">{storeDetails.hours}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Your Reference Number</h4>
        <div className="bg-white border border-yellow-300 rounded px-4 py-3">
          <code className="font-mono text-lg font-bold">{reference}</code>
        </div>
        <p className="text-sm text-yellow-800 mt-2">
          Please quote this reference when you arrive at the store.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount Due:</span>
          <span className="text-2xl font-bold">R {amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p>What to bring:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Your reference number shown above</li>
          <li>Valid ID (for card payments)</li>
          <li>The exact amount if paying by cash</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">We Accept</p>
            <p className="text-sm text-blue-700">Cash, Visa, Mastercard, American Express</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirmInStore}
        disabled={isSubmitting}
        className="w-full bg-primary-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Confirming...' : "I'll Pay In Store"}
      </button>

      <p className="text-xs text-center text-gray-500">
        By clicking the button above, you confirm that you will visit our store to complete the payment.
        Your order will be held for 7 days.
      </p>
    </div>
  );
}
