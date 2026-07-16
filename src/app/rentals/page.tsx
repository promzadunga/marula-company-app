import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Calendar, Truck, Clock, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function RentalsPage() {
  // Fetch rental products (RENTAL_ONLY or SALE_AND_RENTAL)
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      listingType: {
        in: ['RENTAL_ONLY', 'SALE_AND_RENTAL'],
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
  });

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative text-white py-20 md:py-28 overflow-hidden">
        <Image
          src="/mobile.jpeg"
          alt="Rentals background"
          fill
          className="absolute inset-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-eng-navy-deep/85" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Calendar size={48} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">RENTALS</h1>
          </div>
          <p className="text-xl text-eng-cream/80 max-w-2xl">
            Rent mobile units for your events, construction sites, or temporary needs.
            Flexible rental periods with delivery and setup included.
          </p>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 bg-eng-navy border-b border-eng-steel">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-eng-steel/50 flex items-center justify-center text-white">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Free Delivery</p>
                <p className="text-xs text-eng-gray-mid">Within 50km radius</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-eng-steel/50 flex items-center justify-center text-white">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Flexible Periods</p>
                <p className="text-xs text-eng-gray-mid">Daily, weekly, monthly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-eng-steel/50 flex items-center justify-center text-white">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Fully Insured</p>
                <p className="text-xs text-eng-gray-mid">All units covered</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-eng-steel/50 flex items-center justify-center text-white">
                <Calendar size={20} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Easy Booking</p>
                <p className="text-xs text-eng-gray-mid">Quick online process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-eng-navy uppercase tracking-wide">Available for Rent</h2>

          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const primaryImage = product.images[0];
                const dailyRate = product.rentalPriceDaily;

                return (
                  <Link
                    key={product.id}
                    href={`/rentals/${product.slug}`}
                    className="group bg-white rounded border border-eng-gray-warm hover:border-eng-steel transition-all duration-300 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-eng-cream">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-eng-gray-mid">
                          <Truck size={48} />
                        </div>
                      )}

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-eng-steel text-white px-3 py-1 rounded text-sm font-semibold">
                          For Rent
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-eng-navy group-hover:text-eng-steel transition-colors mb-2">
                        {product.name}
                      </h3>
                      <p className="text-eng-gray-mid text-sm line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      {/* Pricing */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-eng-gray-mid">Daily Rate</span>
                        <span className="text-xl font-bold text-eng-navy">
                          {dailyRate ? formatCurrency(dailyRate) : 'Contact us'}
                        </span>
                      </div>

                      {/* Availability */}
                      <div className="mt-4 pt-4 border-t border-eng-gray-warm">
                        <div className="flex items-center justify-between">
                          {product.rentalQuantity && product.rentalQuantity > 0 ? (
                            <span className="text-xs text-green-600 font-medium">
                              {product.rentalQuantity} unit{product.rentalQuantity > 1 ? 's' : ''} available
                            </span>
                          ) : (
                            <span className="text-xs text-eng-gray-mid">
                              Check availability
                            </span>
                          )}
                          <span className="text-eng-steel font-semibold text-sm group-hover:underline">
                            View Details &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-eng-gray-mid">
              <Calendar size={48} className="mx-auto mb-4 text-eng-gray-warm" />
              <p>No rental products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 bg-eng-cream-light">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-eng-navy text-center uppercase tracking-wide">How Rental Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-eng-navy text-white rounded flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold text-eng-navy mb-2">Choose Your Unit</h3>
              <p className="text-sm text-eng-gray-mid">Browse our selection and pick the unit that fits your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-eng-navy text-white rounded flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold text-eng-navy mb-2">Select Dates</h3>
              <p className="text-sm text-eng-gray-mid">Choose your rental period - daily, weekly, or monthly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-eng-navy text-white rounded flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold text-eng-navy mb-2">We Deliver</h3>
              <p className="text-sm text-eng-gray-mid">We deliver and set up the unit at your location</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-eng-navy text-white rounded flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-bold text-eng-navy mb-2">We Collect</h3>
              <p className="text-sm text-eng-gray-mid">When done, we pick up the unit - hassle free!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-eng-navy-deep text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide">Need Help Choosing?</h2>
          <p className="text-eng-gray-mid mb-6">Contact us for advice on the best rental solution for your needs</p>
          <Link
            href="/mobile-solutions#contact"
            className="inline-block bg-eng-steel text-white px-8 py-3 rounded font-semibold hover:bg-eng-steel/80 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
