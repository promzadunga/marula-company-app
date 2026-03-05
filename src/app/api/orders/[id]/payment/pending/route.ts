import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Record a pending payment (bank transfer or in-store)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reference, paymentMethod, amount } = body;

    if (!reference || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Reference, payment method, and amount are required' },
        { status: 400 }
      );
    }

    if (!['bank_transfer', 'in_store'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if already paid
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json(
        { error: 'Order has already been paid' },
        { status: 400 }
      );
    }

    // Update order with pending payment reference
    // Status remains PENDING until payment is verified by admin
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paystackReference: reference, // Store reference for tracking
        // Payment status remains PENDING until admin confirms
      },
    });

    const paymentMethodLabel = paymentMethod === 'bank_transfer'
      ? 'Bank Transfer (EFT)'
      : 'Cash/Card In Store';

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `${paymentMethodLabel} payment recorded. Awaiting confirmation.`,
    });
  } catch (error) {
    console.error('Pending payment error:', error);
    return NextResponse.json(
      { error: 'Failed to record pending payment' },
      { status: 500 }
    );
  }
}
