'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import { CheckCircle, Truck, Package, XCircle, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const STATUS_TRANSITIONS: Record<OrderStatus, { status: OrderStatus; label: string; icon: React.ElementType; color: string }[]> = {
  PENDING: [
    { status: 'PAID', label: 'Mark Paid', icon: CreditCard, color: 'bg-green-500 hover:bg-green-600 text-white' },
    { status: 'CANCELLED', label: 'Cancel', icon: XCircle, color: 'bg-red-100 hover:bg-red-200 text-red-700' },
  ],
  PAID: [
    { status: 'PROCESSING', label: 'Process', icon: Package, color: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { status: 'CANCELLED', label: 'Cancel', icon: XCircle, color: 'bg-red-100 hover:bg-red-200 text-red-700' },
  ],
  PROCESSING: [
    { status: 'SHIPPED', label: 'Ship', icon: Truck, color: 'bg-purple-500 hover:bg-purple-600 text-white' },
  ],
  SHIPPED: [
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle, color: 'bg-green-500 hover:bg-green-600 text-white' },
  ],
  DELIVERED: [
    { status: 'COMPLETED', label: 'Complete', icon: CheckCircle, color: 'bg-gray-500 hover:bg-gray-600 text-white' },
  ],
  COMPLETED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<OrderStatus | null>(null);

  const availableTransitions = STATUS_TRANSITIONS[currentStatus] || [];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setLoading(newStatus);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
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
