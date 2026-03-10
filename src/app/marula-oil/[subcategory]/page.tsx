import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { categories } from '@/lib/config';
import { ProductSubcategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ subcategory: string }>;
}

const subcategoryMap: Record<string, ProductSubcategory> = {
  'retail': 'MARULA_OIL_RETAIL',
  'wholesale': 'MARULA_OIL_WHOLESALE',
  'bulk': 'MARULA_OIL_BULK',
};

export async function generateStaticParams() {
  return categories.MARULA_OIL.subcategories.map((sub) => ({
    subcategory: sub.slug,
  }));
}

export default async function MarulaOilSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const subcategoryValue = subcategoryMap[subcategory];

  if (!subcategoryValue) {
    notFound();
  }

  const subcategoryInfo = categories.MARULA_OIL.subcategories.find(
    (s) => s.slug === subcategory
  );

  const products = await prisma.product.findMany({
    where: {
      category: 'MARULA_OIL',
      subcategory: subcategoryValue,
      isActive: true,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/marula-oil"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Marula Oil
          </Link>
          <h1 className="text-4xl font-bold">{subcategoryInfo?.name || 'Products'}</h1>
          <p className="text-primary-100 mt-2">
            Explore our {subcategoryInfo?.name.toLowerCase() || 'products'}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-brown-50">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <>
              <p className="text-brown-600 mb-6">{products.length} products found</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-brown-500 mb-4">No products available in this category yet.</p>
              <Link
                href="/marula-oil"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Browse all marula oil products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
