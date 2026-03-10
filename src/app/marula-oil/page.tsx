import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { Droplets, Sparkles, Gift, Package } from 'lucide-react';
import { categories } from '@/lib/config';

export const dynamic = 'force-dynamic';

const subcategoryIcons: Record<string, React.ReactNode> = {
  PURE_OILS: <Droplets size={32} />,
  GIFT_SETS: <Gift size={32} />,
  BUNDLES: <Package size={32} />,
};

export default async function MarulaOilPage() {
  // Fetch featured products
  const products = await prisma.product.findMany({
    where: {
      category: 'MARULA_OIL',
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
    take: 6,
  });

  const subcategories = categories.MARULA_OIL.subcategories;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles size={48} className="text-primary-200" />
            <h1 className="text-4xl md:text-5xl font-bold">Marula Oil</h1>
          </div>
          <p className="text-xl text-primary-100 max-w-2xl">
            Premium marula oil products for skin, hair, and wellness.
            100% natural, ethically sourced from Southern Africa.
          </p>
        </div>
      </section>

      {/* Subcategories */}
      <section className="py-12 bg-brown-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-brown-900">Browse by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/marula-oil/${sub.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4 border border-brown-100"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {subcategoryIcons[sub.value] || <Droplets size={32} />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brown-900 group-hover:text-primary-500 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-brown-500 text-sm">View all {sub.name.toLowerCase()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-brown-900">Featured Products</h2>
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-brown-500">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-brown-900">Why Marula Oil?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="text-primary-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-brown-900">100% Natural</h3>
              <p className="text-brown-600">Pure, cold-pressed marula oil with no additives</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-primary-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-brown-900">Rich in Antioxidants</h3>
              <p className="text-brown-600">High in vitamins C and E for healthy skin</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-primary-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-brown-900">Ethically Sourced</h3>
              <p className="text-brown-600">Supporting local communities in Southern Africa</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
