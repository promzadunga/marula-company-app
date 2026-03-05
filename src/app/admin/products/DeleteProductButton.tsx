'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteProduct } from './actions';
import toast from 'react-hot-toast';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          toast.success('Product deleted successfully');
        } else {
          toast.error(result.error || 'Failed to delete product');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  );
}
