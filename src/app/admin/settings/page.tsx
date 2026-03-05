'use client';

import { useState, useEffect } from 'react';
import { Building2, Store, Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentSettings {
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    accountType: string;
  };
  storeDetails: {
    name: string;
    address: string;
    phone: string;
    hours: string;
  };
}

const defaultSettings: PaymentSettings = {
  bankDetails: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchCode: '',
    accountType: 'Cheque',
  },
  storeDetails: {
    name: '',
    address: '',
    phone: '',
    hours: '',
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/payment');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          bankDetails: { ...defaultSettings.bankDetails, ...data.bankDetails },
          storeDetails: { ...defaultSettings.storeDetails, ...data.storeDetails },
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBankChange = (field: keyof PaymentSettings['bankDetails'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleStoreChange = (field: keyof PaymentSettings['storeDetails'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      storeDetails: {
        ...prev.storeDetails,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast.success('Settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brown-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-brown-300 disabled:cursor-not-allowed transition"
        >
          {saving ? (
            <>
              <Loader className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="text-yellow-600" size={20} />
          <p className="text-yellow-800">You have unsaved changes</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bank Details */}
        <div className="bg-white rounded-xl border border-brown-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brown-900">Bank Details</h2>
              <p className="text-sm text-brown-500">For bank transfer payments</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={settings.bankDetails.bankName}
                onChange={(e) => handleBankChange('bankName', e.target.value)}
                placeholder="e.g., FNB, Standard Bank"
                className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={settings.bankDetails.accountName}
                onChange={(e) => handleBankChange('accountName', e.target.value)}
                placeholder="e.g., The Marula Company (Pty) Ltd"
                className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={settings.bankDetails.accountNumber}
                onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                placeholder="e.g., 62123456789"
                className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">
                  Branch Code
                </label>
                <input
                  type="text"
                  value={settings.bankDetails.branchCode}
                  onChange={(e) => handleBankChange('branchCode', e.target.value)}
                  placeholder="e.g., 250655"
                  className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">
                  Account Type
                </label>
                <select
                  value={settings.bankDetails.accountType}
                  onChange={(e) => handleBankChange('accountType', e.target.value)}
                  className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Cheque">Cheque</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Transmission">Transmission</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bank Details Preview */}
          {settings.bankDetails.accountNumber && (
            <div className="mt-6 p-4 bg-brown-50 rounded-lg">
              <p className="text-sm font-medium text-brown-600 mb-2">Preview (as shown to customers)</p>
              <div className="text-sm space-y-1">
                <p><span className="text-brown-500">Bank:</span> {settings.bankDetails.bankName}</p>
                <p><span className="text-brown-500">Account:</span> {settings.bankDetails.accountName}</p>
                <p><span className="text-brown-500">Number:</span> {settings.bankDetails.accountNumber}</p>
                <p><span className="text-brown-500">Branch:</span> {settings.bankDetails.branchCode}</p>
                <p><span className="text-brown-500">Type:</span> {settings.bankDetails.accountType}</p>
              </div>
            </div>
          )}
        </div>

        {/* Store Details */}
        <div className="bg-white rounded-xl border border-brown-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Store className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brown-900">Store Details</h2>
              <p className="text-sm text-brown-500">For in-store payments</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeDetails.name}
                onChange={(e) => handleStoreChange('name', e.target.value)}
                placeholder="e.g., The Marula Company Store"
                className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Address
              </label>
              <textarea
                value={settings.storeDetails.address}
                onChange={(e) => handleStoreChange('address', e.target.value)}
                placeholder="e.g., 123 Main Road, Sandton, Johannesburg, 2196"
                rows={2}
                className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.storeDetails.phone}
                onChange={(e) => handleStoreChange('phone', e.target.value)}
                placeholder="e.g., 012 345 6789"
                className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Business Hours
              </label>
              <input
                type="text"
                value={settings.storeDetails.hours}
                onChange={(e) => handleStoreChange('hours', e.target.value)}
                placeholder="e.g., Mon-Fri: 8am-5pm, Sat: 9am-1pm"
                className="w-full border border-brown-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Store Details Preview */}
          {settings.storeDetails.name && (
            <div className="mt-6 p-4 bg-brown-50 rounded-lg">
              <p className="text-sm font-medium text-brown-600 mb-2">Preview (as shown to customers)</p>
              <div className="text-sm space-y-1">
                <p className="font-medium text-brown-900">{settings.storeDetails.name}</p>
                <p className="text-brown-600">{settings.storeDetails.address}</p>
                <p className="text-brown-600">{settings.storeDetails.phone}</p>
                <p className="text-brown-500 text-xs">{settings.storeDetails.hours}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Settings Info */}
      <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-primary-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-primary-900">Payment Methods</h3>
            <p className="text-sm text-primary-800 mt-1">
              These settings are used when customers choose to pay via Bank Transfer (EFT) or Cash/Card In Store.
              Card payments are processed through Paystack and require the environment variables to be configured.
            </p>
            <ul className="text-sm text-primary-700 mt-3 space-y-1">
              <li>• <strong>Bank Transfer:</strong> Customers will see your bank details and use a unique reference</li>
              <li>• <strong>In Store:</strong> Customers will see your store location and hours</li>
              <li>• <strong>Card Payment:</strong> Requires PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
