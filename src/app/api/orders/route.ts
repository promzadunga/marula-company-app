import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation, sendOrderAdminNotification, OrderEmailData } from '@/lib/email';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  variantName?: string;
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingProvince,
      shippingPostal,
      deliveryNotes,
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Customer name, email, and phone are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingCity) {
      return NextResponse.json(
        { error: 'Shipping address and city are required' },
        { status: 400 }
      );
    }

    // Verify user if logged in
    let validUserId: string | null = null;
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

    // Validate products and calculate totals
    const orderItems: OrderItem[] = items;
    let subtotal = 0;

    // Verify each product exists and has stock
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: item.variantId
            ? { where: { id: item.variantId } }
            : undefined,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }

      // Check stock
      if (item.variantId && product.variants && product.variants.length > 0) {
        const variant = product.variants[0];
        if (variant.stockQuantity < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for ${item.name} (${item.variantName})` },
            { status: 400 }
          );
        }
      } else {
        if (product.stockQuantity < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for ${item.name}` },
            { status: 400 }
          );
        }
      }

      subtotal += item.price * item.quantity;
    }

    // Create order with items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          orderType: 'sale',
          status: 'PENDING',
          userId: validUserId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          shippingCity,
          shippingProvince: shippingProvince || '',
          shippingPostal: shippingPostal || '',
          deliveryNotes: deliveryNotes || null,
          subtotal,
          depositTotal: 0,
          total: subtotal,
        },
      });

      // Create order items and update stock
      for (const item of orderItems) {
        // Get product with image
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            variants: item.variantId
              ? { where: { id: item.variantId } }
              : undefined,
          },
        });

        if (!product) continue;

        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            variantId: item.variantId || null,
            productName: item.name,
            variantName: item.variantName || null,
            productImage: product.images[0]?.url || null,
            itemType: 'sale',
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          },
        });

        // Decrement stock
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });

    // Fire-and-forget: send confirmation emails
    const emailData: OrderEmailData = {
      orderNumber: result.orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingProvince: shippingProvince || '',
      shippingPostal: shippingPostal || '',
      items: orderItems.map((item) => ({
        name: item.name,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subtotal,
      total: subtotal,
    };
    await Promise.allSettled([
      sendOrderConfirmation(emailData),
      sendOrderAdminNotification(emailData),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        id: result.id,
        orderNumber: result.orderNumber,
        total: result.total,
        status: result.status,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// GET - List orders (admin or user's own orders)
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
    const type = searchParams.get('type'); // 'sale' or 'rental'

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    // Non-admin users can only see their own orders
    if (session.user.role !== 'ADMIN') {
      whereClause.userId = session.user.id;
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    // Filter by type if provided
    if (type) {
      whereClause.orderType = type;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
