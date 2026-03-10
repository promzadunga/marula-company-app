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
    <div>
      {/* Hero */}
      <section className="bg-brown-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Calendar size={48} className="text-primary-400" />
            <h1 className="text-4xl md:text-5xl font-bold">Rentals</h1>
          </div>
          <p className="text-xl text-brown-200 max-w-2xl">
            Rent mobile units for your events, construction sites, or temporary needs.
            Flexible rental periods with delivery and setup included.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-primary-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-medium text-brown-900">Free Delivery</p>
                <p className="text-sm text-brown-500">Within 50km radius</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-medium text-brown-900">Flexible Periods</p>
                <p className="text-sm text-brown-500">Daily, weekly, monthly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-medium text-brown-900">Fully Insured</p>
                <p className="text-sm text-brown-500">All units covered</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="font-medium text-brown-900">Easy Booking</p>
                <p className="text-sm text-brown-500">Quick online process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-brown-900">Available for Rent</h2>

          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const primaryImage = product.images[0];
                const dailyRate = product.rentalPriceDaily;

                return (
                  <Link
                    key={product.id}
                    href={`/rentals/${product.slug}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-brown-100"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-brown-100">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-brown-300">
                          <Truck size={48} />
                        </div>
                      )}

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          For Rent
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-brown-900 group-hover:text-primary-500 transition-colors mb-2">
                        {product.name}
                      </h3>
                      <p className="text-brown-500 text-sm line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      {/* Pricing */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-brown-500">Daily Rate</span>
                        <span className="text-xl font-bold text-primary-500">
                          {dailyRate ? formatCurrency(dailyRate) : 'Contact us'}
                        </span>
                      </div>

                      {/* Availability */}
                      <div className="mt-4 pt-4 border-t border-brown-100">
                        <div className="flex items-center justify-between">
                          {product.rentalQuantity && product.rentalQuantity > 0 ? (
                            <span className="text-xs text-green-600 font-medium">
                              {product.rentalQuantity} unit{product.rentalQuantity > 1 ? 's' : ''} available
                            </span>
                          ) : (
                            <span className="text-xs text-brown-400">
                              Check availability
                            </span>
                          )}
                          <span className="text-primary-500 font-medium text-sm group-hover:underline">
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
            <div className="text-center py-12 text-brown-500">
              <Calendar size={48} className="mx-auto mb-4 text-brown-300" />
              <p>No rental products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 bg-brown-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-brown-900 text-center">How Rental Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">Choose Your Unit</h3>
              <p className="text-sm text-brown-500">Browse our selection and pick the unit that fits your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">Select Dates</h3>
              <p className="text-sm text-brown-500">Choose your rental period - daily, weekly, or monthly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">We Deliver</h3>
              <p className="text-sm text-brown-500">We deliver and set up the unit at your location</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">We Collect</h3>
              <p className="text-sm text-brown-500">When done, we pick up the unit - hassle free!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-primary-100 mb-6">Contact us for advice on the best rental solution for your needs</p>
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
