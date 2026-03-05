import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { Truck, Thermometer, Bath, Building } from 'lucide-react';
import { categories } from '@/lib/config';

const subcategoryIcons: Record<string, React.ReactNode> = {
  FRIDGES: <Thermometer size={32} />,
  TOILETS: <Bath size={32} />,
  CLINICS: <Building size={32} />,
};

export default async function MobileSolutionsPage() {
  // Fetch products for sale (SALE_ONLY or SALE_AND_RENTAL)
  const products = await prisma.product.findMany({
    where: {
      category: 'MOBILE_SOLUTIONS',
      isActive: true,
      listingType: {
        in: ['SALE_ONLY', 'SALE_AND_RENTAL'],
      },
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

  const subcategories = categories.MOBILE_SOLUTIONS.subcategories;

  return (
    <div>
      {/* Hero */}
      <section className="bg-brown-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Truck size={48} className="text-primary-400" />
            <h1 className="text-4xl md:text-5xl font-bold">Mobile Solutions</h1>
          </div>
          <p className="text-xl text-brown-200 max-w-2xl">
            High-quality mobile units available for purchase.
            Fridges, toilets, and mobile clinics delivered to your location.
          </p>
          <p className="mt-4 text-brown-300">
            Looking to rent? <Link href="/rentals" className="text-primary-400 hover:underline">View our rental options →</Link>
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
                href={`/mobile-solutions/${sub.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4 border border-brown-100"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {subcategoryIcons[sub.value] || <Truck size={32} />}
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
                <ProductCard key={product.id} product={product} mode="sale" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-brown-500">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-primary-100 mb-6">Contact us for bulk orders or custom configurations</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-brown-50 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
