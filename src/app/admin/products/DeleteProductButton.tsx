'use client';

import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteProduct } from './actions';
import toast from 'react-hot-toast';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          toast.success('Product deleted successfully');
          setShowModal(false);
        } else {
          toast.error(result.error || 'Failed to delete product');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <button
              onClick={() => setShowModal(false)}
              disabled={isPending}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-medium">&quot;{productName}&quot;</span>? This action cannot be undone.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  {isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
