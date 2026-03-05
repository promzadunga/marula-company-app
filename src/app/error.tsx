'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brown-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-brown-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-brown-600 mb-6">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="block w-full border border-brown-200 text-brown-700 py-3 rounded-lg font-semibold hover:bg-brown-100 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
