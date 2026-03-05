'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Lock, HelpCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CardPaymentFormProps {
  email: string;
  amount: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  metadata?: Record<string, unknown>;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

interface FormErrors {
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  terms?: string;
}

type CardType = 'visa' | 'mastercard' | 'amex' | 'verve' | 'unknown';

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

// Detect card type from number
function detectCardType(number: string): CardType {
  const cleaned = number.replace(/\s/g, '');

  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^506[01]|^507[89]|^6500/.test(cleaned)) return 'verve';

  return 'unknown';
}

// Luhn algorithm to validate card number
function isValidCardNumber(number: string): boolean {
  const cleaned = number.replace(/\s/g, '');

  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Format card number with spaces
function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const cardType = detectCardType(cleaned);

  // Amex: 4-6-5 format, others: 4-4-4-4 format
  if (cardType === 'amex') {
    const match = cleaned.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
  } else {
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
    }
  }

  return cleaned;
}

// Format expiry as MM/YY
function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  }

  return cleaned;
}

export function CardPaymentForm({
  email,
  amount,
  reference,
  onSuccess,
  onClose,
  metadata = {},
  isProcessing,
  setIsProcessing,
}: CardPaymentFormProps) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showCvvHelp, setShowCvvHelp] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const cardType = detectCardType(cardNumber);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackReady(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const validateCardName = (name: string): string | undefined => {
    if (!name.trim()) return 'Name on card is required';
    if (name.trim().length < 3) return 'Name must be at least 3 characters';
    if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Name can only contain letters';
    return undefined;
  };

  const validateCardNumber = (number: string): string | undefined => {
    const cleaned = number.replace(/\s/g, '');
    if (!cleaned) return 'Card number is required';
    if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';
    if (cleaned.length < 13) return 'Card number is too short';
    if (cleaned.length > 19) return 'Card number is too long';
    if (!isValidCardNumber(cleaned)) return 'Invalid card number';
    return undefined;
  };

  const validateExpiry = (value: string): string | undefined => {
    if (!value) return 'Expiry date is required';

    const match = value.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return 'Use MM/YY format';

    const month = parseInt(match[1], 10);
    const year = parseInt('20' + match[2], 10);

    if (month < 1 || month > 12) return 'Invalid month';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Card has expired';
    }

    if (year > currentYear + 20) return 'Invalid year';

    return undefined;
  };

  const validateCvv = (value: string): string | undefined => {
    if (!value) return 'Security code is required';
    if (!/^\d+$/.test(value)) return 'Must contain only digits';

    const expectedLength = cardType === 'amex' ? 4 : 3;
    if (value.length !== expectedLength) {
      return `Must be ${expectedLength} digits`;
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      cardName: validateCardName(cardName),
      cardNumber: validateCardNumber(cardNumber),
      expiry: validateExpiry(expiry),
      cvv: validateCvv(cvv),
      terms: !acceptedTerms ? 'You must accept the terms' : undefined,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 19) {
      setCardNumber(formatted);
      if (touched.cardNumber) {
        setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 4) {
      const formatted = formatExpiry(value);
      setExpiry(formatted);
      if (touched.expiry) {
        setErrors(prev => ({ ...prev, expiry: validateExpiry(formatted) }));
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLength = cardType === 'amex' ? 4 : 3;
    if (value.length <= maxLength) {
      setCvv(value);
      if (touched.cvv) {
        setErrors(prev => ({ ...prev, cvv: validateCvv(value) }));
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    switch (field) {
      case 'cardName':
        setErrors(prev => ({ ...prev, cardName: validateCardName(cardName) }));
        break;
      case 'cardNumber':
        setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(cardNumber) }));
        break;
      case 'expiry':
        setErrors(prev => ({ ...prev, expiry: validateExpiry(expiry) }));
        break;
      case 'cvv':
        setErrors(prev => ({ ...prev, cvv: validateCvv(cvv) }));
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ cardName: true, cardNumber: true, expiry: true, cvv: true, terms: true });

    if (!validateForm()) {
      toast.error('Please fix the errors before proceeding');
      return;
    }

    if (!window.PaystackPop) {
      toast.error('Payment system is loading... Please try again');
      return;
    }

    setIsProcessing(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(amount * 100),
      currency: 'ZAR',
      ref: reference,
      metadata: {
        ...metadata,
        cardholderName: cardName.trim(),
      },
      callback: function (response: { reference: string }) {
        onSuccess(response.reference);
      },
      onClose: function () {
        setIsProcessing(false);
        onClose();
      },
    });

    handler.openIframe();
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <span className="font-bold text-blue-600">VISA</span>;
      case 'mastercard':
        return <span className="font-bold text-orange-600">MC</span>;
      case 'amex':
        return <span className="font-bold text-blue-800">AMEX</span>;
      case 'verve':
        return <span className="font-bold text-red-600">VERVE</span>;
      default:
        return <CreditCard size={20} className="text-gray-400" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">Enter your payment details:</h2>

      {/* Name on Card */}
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          Name on card <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="cardName"
          value={cardName}
          onChange={(e) => {
            setCardName(e.target.value);
            if (touched.cardName) {
              setErrors(prev => ({ ...prev, cardName: validateCardName(e.target.value) }));
            }
          }}
          onBlur={() => handleBlur('cardName')}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            errors.cardName && touched.cardName ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.cardName && touched.cardName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.cardName}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            onBlur={() => handleBlur('cardNumber')}
            inputMode="numeric"
            autoComplete="cc-number"
            className={`w-full border rounded-lg px-4 py-3 pr-16 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.cardNumber && touched.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {getCardIcon()}
            <Lock size={16} className="text-gray-400" />
          </div>
        </div>
        {errors.cardNumber && touched.cardNumber && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.cardNumber}
          </p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry date <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="expiry"
            value={expiry}
            onChange={handleExpiryChange}
            onBlur={() => handleBlur('expiry')}
            placeholder="MM/YY"
            inputMode="numeric"
            autoComplete="cc-exp"
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.expiry && touched.expiry ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.expiry && touched.expiry && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.expiry}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={handleCvvChange}
              onBlur={() => handleBlur('cvv')}
              inputMode="numeric"
              autoComplete="cc-csc"
              className={`w-full border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                errors.cvv && touched.cvv ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCvvHelp(!showCvvHelp)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          {errors.cvv && touched.cvv && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.cvv}
            </p>
          )}
        </div>
      </div>

      {showCvvHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          The CVV is the {cardType === 'amex' ? '4-digit number on the front' : '3-digit number on the back'} of your card.
        </div>
      )}

      {/* Terms */}
      <div className="border-t pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (e.target.checked) setErrors(prev => ({ ...prev, terms: undefined }));
            }}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-primary-600 hover:underline">
              Terms and Conditions
            </a>
          </span>
        </label>
        {errors.terms && touched.terms && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1 ml-7">
            <AlertCircle size={14} /> {errors.terms}
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
        <Lock size={16} />
        <span>Secured with 256-bit SSL encryption via Paystack</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isProcessing || !paystackReady}
        className="w-full bg-primary-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Pay R {amount.toFixed(2)}
          </>
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        We accept Visa, Mastercard, Amex, and Verve
      </div>
    </form>
  );
}
