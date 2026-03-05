'use client';

import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
}

interface BankTransferDetailsProps {
  orderNumber: string;
  amount: number;
  reference: string;
  bankDetails: BankDetails;
  onConfirmTransfer: () => void;
  isSubmitting: boolean;
}

export function BankTransferDetails({
  orderNumber,
  amount,
  reference,
  bankDetails,
  onConfirmTransfer,
  isSubmitting,
}: BankTransferDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const DetailRow = ({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {copyable && (
          <button
            type="button"
            onClick={() => copyToClipboard(value, label)}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            {copied === label ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <Copy size={16} className="text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  // Check if bank details are configured
  const isBankConfigured = bankDetails.accountNumber && bankDetails.bankName;

  if (!isBankConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-yellow-900 mb-2">Bank Transfer Not Available</h3>
        <p className="text-sm text-yellow-800">
          Bank transfer payment is currently not configured. Please choose another payment method or contact us directly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Bank Transfer Instructions</h3>
        <p className="text-sm text-blue-800">
          Please use the details below to make a bank transfer. Use your order reference as the payment reference.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Bank Account Details</h4>
        <DetailRow label="Bank Name" value={bankDetails.bankName} />
        <DetailRow label="Account Name" value={bankDetails.accountName} />
        <DetailRow label="Account Number" value={bankDetails.accountNumber} copyable />
        <DetailRow label="Branch Code" value={bankDetails.branchCode} copyable />
        <DetailRow label="Account Type" value={bankDetails.accountType} />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Payment Reference (Important!)</h4>
        <div className="flex items-center justify-between bg-white border border-yellow-300 rounded px-4 py-3">
          <code className="font-mono text-lg font-bold">{reference}</code>
          <button
            type="button"
            onClick={() => copyToClipboard(reference, 'Reference')}
            className="p-2 hover:bg-yellow-100 rounded transition"
          >
            {copied === 'Reference' ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <Copy size={20} className="text-yellow-700" />
            )}
          </button>
        </div>
        <p className="text-sm text-yellow-800 mt-2">
          Always include this reference so we can match your payment to your order.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount to Transfer:</span>
          <span className="text-2xl font-bold">R {amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p>After making the transfer:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Click the button below to notify us</li>
          <li>We will verify your payment within 24-48 hours</li>
          <li>You will receive an email confirmation once verified</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onConfirmTransfer}
        disabled={isSubmitting}
        className="w-full bg-primary-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Submitting...' : "I've Made the Transfer"}
      </button>
    </div>
  );
}
