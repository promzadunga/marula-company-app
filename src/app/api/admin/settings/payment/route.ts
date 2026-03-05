import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch payment settings (public for payment page)
export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { key: 'payment' },
    });

    if (!settings) {
      // Return default empty settings
      return NextResponse.json({
        bankDetails: {
          bankName: '',
          accountName: '',
          accountNumber: '',
          branchCode: '',
          accountType: '',
        },
        storeDetails: {
          name: '',
          address: '',
          phone: '',
          hours: '',
        },
      });
    }

    return NextResponse.json(settings.value);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    );
  }
}

// POST - Update payment settings (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

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
    const { bankDetails, storeDetails } = body;

    const settings = await prisma.settings.upsert({
      where: { key: 'payment' },
      update: {
        value: { bankDetails, storeDetails },
      },
      create: {
        key: 'payment',
        value: { bankDetails, storeDetails },
      },
    });

    return NextResponse.json({
      success: true,
      settings: settings.value,
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    return NextResponse.json(
      { error: 'Failed to update payment settings' },
      { status: 500 }
    );
  }
}
