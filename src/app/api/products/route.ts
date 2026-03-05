import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductCategory, ProductSubcategory } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as ProductCategory | null;
    const subcategory = searchParams.get('subcategory') as ProductSubcategory | null;
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (subcategory) {
      where.subcategory = subcategory;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        specs: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
