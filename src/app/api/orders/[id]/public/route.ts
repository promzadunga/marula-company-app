import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get order for payment page (public, limited fields)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        shippingCity: true,
        shippingProvince: true,
        shippingPostal: true,
        subtotal: true,
        shippingCost: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            productName: true,
            variantName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
