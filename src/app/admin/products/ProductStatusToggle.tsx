'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTransition } from 'react';
import { toggleProductStatus } from './actions';
import toast from 'react-hot-toast';

interface ProductStatusToggleProps {
  productId: string;
  isActive: boolean;
}

export function ProductStatusToggle({ productId, isActive }: ProductStatusToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const result = await toggleProductStatus(productId, !isActive);
        if (result.success) {
          toast.success(`Product ${isActive ? 'deactivated' : 'activated'}`);
        } else {
          toast.error(result.error || 'Failed to update status');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition disabled:opacity-50 ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
      {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}
