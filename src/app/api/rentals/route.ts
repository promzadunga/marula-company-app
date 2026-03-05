import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Generate unique rental/order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RNT-${timestamp}-${random}`;
}

function generateRentalNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `R-${timestamp}-${random}`;
}

// POST - Create a rental request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      productId,
      startDate,
      endDate,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryProvince,
      deliveryPostal,
      notes,
    } = body;

    // Validate required fields
    if (!productId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Product ID, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Validate customer details
    if (!session?.user) {
      // Guest checkout - require all fields
      if (!customerName || !customerEmail || !customerPhone) {
        return NextResponse.json(
          { error: 'Customer name, email, and phone are required for guest bookings' },
          { status: 400 }
        );
      }
    } else {
      // Logged in - still require phone
      if (!customerPhone) {
        return NextResponse.json(
          { error: 'Phone number is required' },
          { status: 400 }
        );
      }
    }

    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        listingType: true,
        rentalPriceDaily: true,
        rentalDeposit: true,
        rentalQuantity: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is available for rental
    if (product.listingType !== 'RENTAL_ONLY' && product.listingType !== 'SALE_AND_RENTAL') {
      return NextResponse.json(
        { error: 'This product is not available for rental' },
        { status: 400 }
      );
    }

    // Check rental availability
    if (!product.rentalQuantity || product.rentalQuantity <= 0) {
      return NextResponse.json(
        { error: 'No units available for rental' },
        { status: 400 }
      );
    }

    // Calculate rental days and total
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (rentalDays <= 0) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const dailyRate = product.rentalPriceDaily || 0;
    const depositAmount = product.rentalDeposit || 0;
    const rentalTotal = dailyRate * rentalDays;
    const grandTotal = rentalTotal + depositAmount;

    // Get customer info from session or request body
    let validUserId: string | null = null;

    // If user is logged in, verify they exist in the database
    if (session?.user) {
      const sessionUserId = (session.user as { id?: string }).id;
      if (sessionUserId) {
        const existingUser = await prisma.user.findUnique({
          where: { id: sessionUserId },
          select: { id: true },
        });
        if (existingUser) {
          validUserId = existingUser.id;
        }
      }
    }

    const customer = {
      userId: validUserId,
      name: session?.user?.name || customerName || 'Customer',
      email: session?.user?.email || customerEmail,
      phone: customerPhone,
    };

    // Create Order, OrderItem, and Rental in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the Order
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          orderType: 'rental',
          status: 'PENDING',
          userId: customer.userId,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          shippingAddress: deliveryAddress || '',
          shippingCity: deliveryCity || '',
          shippingProvince: deliveryProvince || '',
          shippingPostal: deliveryPostal || '',
          deliveryNotes: notes || null,
          subtotal: rentalTotal,
          depositTotal: depositAmount,
          total: grandTotal,
        },
      });

      // Create the OrderItem
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productImage: product.images[0]?.url || null,
          itemType: 'rental',
          quantity: 1,
          unitPrice: dailyRate,
          totalPrice: rentalTotal,
          rentalStart: start,
          rentalEnd: end,
          rentalDays: rentalDays,
          depositAmount: depositAmount,
        },
      });

      // Create the Rental
      const rental = await tx.rental.create({
        data: {
          rentalNumber: generateRentalNumber(),
          orderItemId: orderItem.id,
          productId: product.id,
          userId: customer.userId,
          startDate: start,
          endDate: end,
          status: 'PENDING',
          depositAmount: depositAmount,
          notes: notes || null,
        },
      });

      return { order, orderItem, rental };
    });

    return NextResponse.json({
      success: true,
      message: 'Rental request submitted successfully',
      data: {
        orderNumber: result.order.orderNumber,
        rentalNumber: result.rental.rentalNumber,
        productName: product.name,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        rentalDays,
        dailyRate,
        rentalTotal,
        depositAmount,
        grandTotal,
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error('Error creating rental request:', error);
    const message = error instanceof Error ? error.message : 'Failed to create rental request';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// GET - List rentals (for admin or user's own rentals)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build where clause based on role
    const whereClause: Record<string, unknown> = {};

    // Non-admin users can only see their own rentals
    if (session.user.role !== 'ADMIN') {
      whereClause.userId = session.user.id;
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    const rentals = await prisma.rental.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
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
          select: {
            id: true,
            unitPrice: true,
            totalPrice: true,
            rentalDays: true,
            order: {
              select: {
                orderNumber: true,
                customerName: true,
                customerEmail: true,
                customerPhone: true,
                shippingAddress: true,
                shippingCity: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ rentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}
