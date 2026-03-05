import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RentalStatus } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single rental
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

    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            rentalQuantity: true,
            images: {
              where: { isPrimary: true },
              take: 1,
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
        orderItem: {
          include: {
            order: true,
          },
        },
      },
    });

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      );
    }

    // Non-admin users can only view their own rentals
    if (session.user.role !== 'ADMIN' && rental.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to view this rental' },
        { status: 403 }
      );
    }

    return NextResponse.json({ rental });
  } catch (error) {
    console.error('Error fetching rental:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental' },
      { status: 500 }
    );
  }
}

// PATCH - Update rental status (admin only)
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
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: RentalStatus[] = ['PENDING', 'CONFIRMED', 'ACTIVE', 'RETURNED', 'OVERDUE', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the current rental
    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        product: true,
        orderItem: {
          include: {
            order: true,
          },
        },
      },
    });

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      );
    }

    const previousStatus = rental.status;
    const newStatus = status as RentalStatus;

    // Handle inventory changes based on status transitions
    await prisma.$transaction(async (tx) => {
      // PENDING → CONFIRMED: Decrement rental quantity
      if (previousStatus === 'PENDING' && newStatus === 'CONFIRMED') {
        // Check if there's available inventory
        if (rental.product.rentalQuantity <= 0) {
          throw new Error('No units available for rental');
        }

        // Decrement rental quantity
        await tx.product.update({
          where: { id: rental.productId },
          data: {
            rentalQuantity: {
              decrement: 1,
            },
          },
        });

        // Update order status
        await tx.order.update({
          where: { id: rental.orderItem.orderId },
          data: { status: 'PROCESSING' },
        });
      }

      // CONFIRMED → ACTIVE: Mark as delivered
      if (previousStatus === 'CONFIRMED' && newStatus === 'ACTIVE') {
        await tx.rental.update({
          where: { id },
          data: {
            deliveredAt: new Date(),
          },
        });

        await tx.order.update({
          where: { id: rental.orderItem.orderId },
          data: { status: 'DELIVERED' },
        });
      }

      // → RETURNED: Restore rental quantity
      if (newStatus === 'RETURNED' && previousStatus !== 'RETURNED' && previousStatus !== 'CANCELLED') {
        // Only restore if it was confirmed/active (inventory was decremented)
        if (previousStatus === 'CONFIRMED' || previousStatus === 'ACTIVE' || previousStatus === 'OVERDUE') {
          await tx.product.update({
            where: { id: rental.productId },
            data: {
              rentalQuantity: {
                increment: 1,
              },
            },
          });
        }

        await tx.rental.update({
          where: { id },
          data: {
            returnedAt: new Date(),
          },
        });

        await tx.order.update({
          where: { id: rental.orderItem.orderId },
          data: { status: 'COMPLETED' },
        });
      }

      // → CANCELLED: Restore inventory if it was decremented
      if (newStatus === 'CANCELLED' && previousStatus !== 'CANCELLED') {
        // Restore inventory if it was confirmed/active
        if (previousStatus === 'CONFIRMED' || previousStatus === 'ACTIVE' || previousStatus === 'OVERDUE') {
          await tx.product.update({
            where: { id: rental.productId },
            data: {
              rentalQuantity: {
                increment: 1,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: rental.orderItem.orderId },
          data: { status: 'CANCELLED' },
        });
      }

      // Update the rental status
      await tx.rental.update({
        where: { id },
        data: {
          status: newStatus,
          notes: notes !== undefined ? notes : rental.notes,
        },
      });
    });

    // Fetch updated rental
    const updatedRental = await prisma.rental.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            rentalQuantity: true,
          },
        },
        orderItem: {
          include: {
            order: {
              select: {
                orderNumber: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Rental status updated to ${newStatus}`,
      rental: updatedRental,
    });
  } catch (error) {
    console.error('Error updating rental:', error);
    const message = error instanceof Error ? error.message : 'Failed to update rental';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
