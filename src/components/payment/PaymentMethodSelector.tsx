'use client';

import { CreditCard, Store, Building2, Check } from 'lucide-react';

export type PaymentMethod = 'card' | 'in_store' | 'bank_transfer';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodSelect: (method: PaymentMethod) => void;
}

const paymentMethods = [
  {
    id: 'card' as PaymentMethod,
    label: 'Credit or Debit Card',
    description: 'Pay securely online via Paystack',
    icon: CreditCard,
  },
  {
    id: 'in_store' as PaymentMethod,
    label: 'Cash/Card In Store',
    description: 'Pay when you visit our store',
    icon: Store,
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    label: 'Bank Transfer (EFT)',
    description: 'Direct bank transfer to our account',
    icon: Building2,
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onMethodSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">How would you like to pay?</h2>

      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selectedMethod === method.id;

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onMethodSelect(method.id)}
            className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
              isSelected
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Icon size={24} />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                {method.label}
              </p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            {isSelected && (
              <div className="bg-primary-500 text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
