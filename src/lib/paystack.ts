// Paystack server-side utilities
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface InitializePaymentParams {
  email: string;
  amount: number; // in kobo (ZAR cents)
  reference: string;
  metadata?: Record<string, unknown>;
  callback_url?: string;
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    fees: number;
    customer: {
      id: number;
      email: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
    };
  };
}

/**
 * Initialize a payment transaction
 * Returns authorization URL for customer to complete payment
 */
export async function initializePayment(params: InitializePaymentParams) {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to initialize payment');
    }

    return {
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize payment',
    };
  }
}

/**
 * Verify a payment transaction
 * Call this after customer completes payment to confirm status
 */
export async function verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment');
    }

    return data;
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw error;
  }
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(prefix: string = 'PAY'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Convert amount to kobo/cents (Paystack uses smallest currency unit)
 */
export function toKobo(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert kobo/cents to amount
 */
export function fromKobo(kobo: number): number {
  return kobo / 100;
}
