import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPayment } from '@/lib/paystack';

// Verify payment and record it
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
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

    // Verify payment with Paystack
    const paymentData = await verifyPayment(reference);

    if (!paymentData.status || paymentData.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paidAmount = paymentData.data.amount / 100; // Convert from kobo to ZAR

    // Verify amount matches (allow small discrepancy for rounding)
    if (Math.abs(paidAmount - order.total) > 1) {
      console.error('Amount mismatch:', {
        expected: order.total,
        received: paidAmount,
      });
      // Continue anyway but log the discrepancy
    }

    // Update order with payment info
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'PAID',
        paymentStatus: 'PAID',
        paystackReference: reference,
        paidAt: new Date(paymentData.data.paid_at),
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Payment verified and recorded successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
