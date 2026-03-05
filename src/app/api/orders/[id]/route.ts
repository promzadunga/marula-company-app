import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single order
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
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

    // Non-admin users can only view their own orders
    if (session.user.role !== 'ADMIN' && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to view this order' },
        { status: 403 }
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

// PATCH - Update order status (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: OrderStatus[] = [
      'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the current order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const previousStatus = order.status;
    const newStatus = status as OrderStatus;

    // Handle stock restoration if order is cancelled
    if (newStatus === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      // Only restore stock if the order was in a state where stock was decremented
      if (['PENDING', 'PAID', 'PROCESSING'].includes(previousStatus)) {
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                  stockQuantity: {
                    increment: item.quantity,
                  },
                },
              });
            } else if (item.productId) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stockQuantity: {
                    increment: item.quantity,
                  },
                },
              });
            }
          }

          // Update order status
          await tx.order.update({
            where: { id },
            data: { status: newStatus },
          });
        });

        return NextResponse.json({
          success: true,
          message: `Order cancelled and stock restored`,
        });
      }
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${newStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    const message = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
