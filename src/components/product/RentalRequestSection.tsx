'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, CalendarDays, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

interface RentalRequestSectionProps {
  product: {
    id: string;
    name: string;
    rentalPriceDaily?: number | null;
    rentalDeposit?: number | null;
    rentalQuantity?: number | null;
  };
}

interface RentalSuccessData {
  orderNumber: string;
  rentalNumber: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  grandTotal: number;
}

export function RentalRequestSection({ product }: RentalRequestSectionProps) {
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [successData, setSuccessData] = useState<RentalSuccessData | null>(null);

  // Customer form fields (for guest checkout)
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Use product-level rental pricing (same rate regardless of size)
  const dailyRate = product.rentalPriceDaily || 0;
  const deposit = product.rentalDeposit || 0;
  const quantity = product.rentalQuantity || 0;

  // Calculate rental days and total
  const { numberOfDays, totalRental, grandTotal } = useMemo(() => {
    if (!startDate || !endDate) {
      return { numberOfDays: 0, totalRental: 0, grandTotal: 0 };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return { numberOfDays: 0, totalRental: 0, grandTotal: 0 };
    }

    const rental = days * dailyRate;
    return {
      numberOfDays: days,
      totalRental: rental,
      grandTotal: rental + deposit,
    };
  }, [startDate, endDate, dailyRate, deposit]);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const handleContinue = () => {
    if (!startDate || !endDate) {
      toast.error('Please select rental dates');
      return;
    }
    if (numberOfDays <= 0) {
      toast.error('End date must be after start date');
      return;
    }
    setShowCustomerForm(true);
  };

  const handleRequestRental = async () => {
    // Validate customer info
    if (!session?.user) {
      // Guest checkout - require all fields
      if (!customerName.trim()) {
        toast.error('Please enter your name');
        return;
      }
      if (!customerEmail.trim()) {
        toast.error('Please enter your email');
        return;
      }
    }

    // Phone is required for everyone
    if (!customerPhone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsRequesting(true);

    try {
      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          startDate,
          endDate,
          customerName: session?.user?.name || customerName,
          customerEmail: session?.user?.email || customerEmail,
          customerPhone,
          deliveryAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit rental request');
      }

      // Show success state
      setSuccessData({
        orderNumber: data.data.orderNumber,
        rentalNumber: data.data.rentalNumber,
        startDate: data.data.startDate,
        endDate: data.data.endDate,
        rentalDays: data.data.rentalDays,
        grandTotal: data.data.grandTotal,
      });

      toast.success('Rental request submitted successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit rental request';
      toast.error(message);
    } finally {
      setIsRequesting(false);
    }
  };

  const isAvailable = quantity > 0;
  const canContinue = numberOfDays > 0;

  // Success state
  if (successData) {
    return (
      <div className="bg-white rounded-xl p-6 border border-green-200 space-y-5">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-brown-900 mb-2">
            Rental Request Submitted!
          </h3>
          <p className="text-brown-600">
            We&apos;ll contact you shortly to confirm availability and arrange delivery.
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-brown-600">Reference Number</span>
            <span className="font-medium text-brown-900">{successData.rentalNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brown-600">Product</span>
            <span className="font-medium text-brown-900">{product.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brown-600">Rental Period</span>
            <span className="font-medium text-brown-900">{successData.rentalDays} days</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-green-200">
            <span className="text-brown-600">Total (incl. deposit)</span>
            <span className="font-bold text-green-600">{formatCurrency(successData.grandTotal)}</span>
          </div>
        </div>

        <p className="text-center text-sm text-brown-500">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    );
  }

  // Customer info form (step 2)
  if (showCustomerForm) {
    return (
      <div className="bg-white rounded-xl p-6 border border-brown-100 space-y-5">
        <h3 className="font-semibold text-brown-900 flex items-center gap-2">
          <User size={20} className="text-primary-500" />
          Your Details
        </h3>

        {/* Summary */}
        <div className="bg-primary-50 rounded-lg p-4 space-y-1">
          <p className="text-sm text-brown-600">
            <strong>{product.name}</strong>
          </p>
          <p className="text-sm text-brown-600">
            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()} ({numberOfDays} days)
          </p>
          <p className="text-lg font-bold text-primary-500">
            Total: {formatCurrency(grandTotal)}
          </p>
        </div>

        {/* Customer Fields */}
        {!session?.user ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                <User size={14} className="inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-brown-200 rounded-lg py-2.5 px-3 text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="w-full border border-brown-200 rounded-lg py-2.5 px-3 text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                <Phone size={14} className="inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="071 234 5678"
                className="w-full border border-brown-200 rounded-lg py-2.5 px-3 text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        ) : (
          <div className="bg-brown-50 rounded-lg p-4">
            <p className="text-sm text-brown-600">Booking as:</p>
            <p className="font-medium text-brown-900">{session.user.name}</p>
            <p className="text-sm text-brown-600">{session.user.email}</p>
            <div className="mt-3">
              <label className="block text-sm font-medium text-brown-700 mb-1">
                <Phone size={14} className="inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="071 234 5678"
                className="w-full border border-brown-200 rounded-lg py-2.5 px-3 text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div>
          <label className="block text-sm font-medium text-brown-700 mb-1">
            <MapPin size={14} className="inline mr-1" />
            Delivery Address (Optional)
          </label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Where should we deliver the unit?"
            rows={2}
            className="w-full border border-brown-200 rounded-lg py-2.5 px-3 text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCustomerForm(false)}
            className="flex-1 py-3 px-4 border border-brown-200 rounded-lg font-medium text-brown-700 hover:bg-brown-50 transition"
          >
            Back
          </button>
          <button
            onClick={handleRequestRental}
            disabled={isRequesting}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-brown-300 disabled:cursor-not-allowed transition"
          >
            <Calendar size={20} />
            {isRequesting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    );
  }

  // Date selection form (step 1)
  return (
    <div className="bg-white rounded-xl p-6 border border-brown-100 space-y-5">
      <h3 className="font-semibold text-brown-900 flex items-center gap-2">
        <Calendar size={20} className="text-primary-500" />
        Rent This Item
      </h3>

      {/* Daily Rate Display */}
      <div className="flex justify-between items-center py-3 px-4 bg-primary-50 rounded-lg">
        <span className="text-brown-700 font-medium">Daily Rate</span>
        <span className="text-2xl font-bold text-primary-500">
          {formatCurrency(dailyRate)}
        </span>
      </div>

      {/* Date Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-brown-700">
          <CalendarDays size={16} className="inline mr-1" />
          Select Rental Period
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="start-date" className="block text-xs text-brown-500 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-brown-200 rounded-lg py-2.5 px-3 text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-xs text-brown-500 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-brown-200 rounded-lg py-2.5 px-3 text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      {numberOfDays > 0 && (
        <div className="space-y-2 pt-3 border-t border-brown-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-brown-600">
              {formatCurrency(dailyRate)} x {numberOfDays} day{numberOfDays > 1 ? 's' : ''}
            </span>
            <span className="font-medium text-brown-900">
              {formatCurrency(totalRental)}
            </span>
          </div>
          {deposit > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-brown-600">Refundable Deposit</span>
              <span className="font-medium text-brown-900">
                {formatCurrency(deposit)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-brown-100">
            <span className="font-semibold text-brown-900">Total</span>
            <span className="text-xl font-bold text-primary-500">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="flex items-center gap-2 text-sm">
        {isAvailable ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-green-600 font-medium">Available for Rent</span>
            <span className="text-brown-500">({quantity} units)</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-red-600 font-medium">Currently Unavailable</span>
          </>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!isAvailable || !canContinue}
        className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-brown-300 disabled:cursor-not-allowed transition"
      >
        <Calendar size={20} />
        {!isAvailable
          ? 'Currently Unavailable'
          : numberOfDays <= 0
            ? 'Select Dates'
            : 'Continue'
        }
      </button>

      <p className="text-center text-sm text-brown-500">
        We&apos;ll contact you to confirm availability and delivery
      </p>
    </div>
  );
}
