'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RentalStatus } from '@prisma/client';
import { CheckCircle, Truck, RotateCcw, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface RentalStatusActionsProps {
  rentalId: string;
  currentStatus: RentalStatus;
  availableUnits: number;
}

const STATUS_TRANSITIONS: Record<RentalStatus, { status: RentalStatus; label: string; icon: React.ElementType; color: string }[]> = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Confirm', icon: CheckCircle, color: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { status: 'CANCELLED', label: 'Cancel', icon: XCircle, color: 'bg-red-100 hover:bg-red-200 text-red-700' },
  ],
  CONFIRMED: [
    { status: 'ACTIVE', label: 'Mark Delivered', icon: Truck, color: 'bg-green-500 hover:bg-green-600 text-white' },
    { status: 'CANCELLED', label: 'Cancel', icon: XCircle, color: 'bg-red-100 hover:bg-red-200 text-red-700' },
  ],
  ACTIVE: [
    { status: 'RETURNED', label: 'Mark Returned', icon: RotateCcw, color: 'bg-gray-500 hover:bg-gray-600 text-white' },
    { status: 'OVERDUE', label: 'Mark Overdue', icon: XCircle, color: 'bg-red-100 hover:bg-red-200 text-red-700' },
  ],
  OVERDUE: [
    { status: 'RETURNED', label: 'Mark Returned', icon: RotateCcw, color: 'bg-gray-500 hover:bg-gray-600 text-white' },
  ],
  RETURNED: [],
  CANCELLED: [],
};

export function RentalStatusActions({ rentalId, currentStatus, availableUnits }: RentalStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<RentalStatus | null>(null);

  const availableTransitions = STATUS_TRANSITIONS[currentStatus] || [];

  const handleStatusChange = async (newStatus: RentalStatus) => {
    // Check inventory for confirmation
    if (newStatus === 'CONFIRMED' && availableUnits <= 0) {
      toast.error('No units available for rental');
      return;
    }

    setLoading(newStatus);

    try {
      const response = await fetch(`/api/rentals/${rentalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      toast.success(data.message || 'Status updated successfully');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  if (availableTransitions.length === 0) {
    return (
      <span className="text-sm text-gray-400">No actions</span>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {availableTransitions.map((transition) => {
        const Icon = transition.icon;
        const isLoading = loading === transition.status;

        return (
          <button
            key={transition.status}
            onClick={() => handleStatusChange(transition.status)}
            disabled={loading !== null}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 ${transition.color}`}
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Icon size={14} />
            )}
            {transition.label}
          </button>
        );
      })}
    </div>
  );
}
