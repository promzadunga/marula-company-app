import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ArrowLeft, Truck, Shield, Clock, Calendar } from 'lucide-react';
import { RentalRequestSection } from '@/components/product/RentalRequestSection';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `Rent ${product.name} - The Marula Company`,
    description: product.description,
  };
}

export default async function RentalDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
      },
      specs: {
        orderBy: { sortOrder: 'asc' },
      },
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Verify this product is available for rental
  const isRentable = product.listingType === 'RENTAL_ONLY' || product.listingType === 'SALE_AND_RENTAL';
  if (!isRentable) {
    notFound();
  }

  return (
    <div className="bg-brown-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brown-100">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/rentals"
            className="inline-flex items-center gap-2 text-brown-600 hover:text-primary-500 transition"
          >
            <ArrowLeft size={20} />
            Back to Rentals
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Badge */}
            <div>
              <span className="inline-block bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
                For Rent
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-brown-900">
                {product.name}
              </h1>
            </div>

            {/* Rental Pricing & Request */}
            <RentalRequestSection
              product={{
                id: product.id,
                name: product.name,
                rentalPriceDaily: product.rentalPriceDaily,
                rentalDeposit: product.rentalDeposit,
                rentalQuantity: product.rentalQuantity,
              }}
            />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-brown-900 mb-3">Description</h2>
              <p className="text-brown-600 leading-relaxed">{product.description}</p>
              {product.longDescription && (
                <p className="text-brown-600 leading-relaxed mt-4">{product.longDescription}</p>
              )}
            </div>

            {/* Specifications */}
            {product.specs.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-brown-100">
                <h2 className="text-xl font-semibold text-brown-900 mb-4">Specifications</h2>
                <dl className="space-y-3">
                  {product.specs.map((spec) => (
                    <div key={spec.id} className="flex justify-between py-2 border-b border-brown-50 last:border-0">
                      <dt className="text-brown-600">{spec.label}</dt>
                      <dd className="font-medium text-brown-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Rental Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-brown-100">
                <Truck className="text-primary-500" size={24} />
                <div>
                  <p className="font-medium text-brown-900 text-sm">Free Delivery</p>
                  <p className="text-brown-500 text-xs">Setup included</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-brown-100">
                <Shield className="text-primary-500" size={24} />
                <div>
                  <p className="font-medium text-brown-900 text-sm">Fully Insured</p>
                  <p className="text-brown-500 text-xs">All units covered</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-brown-100">
                <Clock className="text-primary-500" size={24} />
                <div>
                  <p className="font-medium text-brown-900 text-sm">Flexible Terms</p>
                  <p className="text-brown-500 text-xs">Daily to monthly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-brown-100">
                <Calendar className="text-primary-500" size={24} />
                <div>
                  <p className="font-medium text-brown-900 text-sm">Easy Booking</p>
                  <p className="text-brown-500 text-xs">Quick process</p>
                </div>
              </div>
            </div>

            {/* Also available for purchase */}
            {product.listingType === 'SALE_AND_RENTAL' && (
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                <p className="text-brown-900">
                  <span className="font-medium">Want to buy instead?</span>{' '}
                  This product is also available for purchase.
                </p>
                <Link
                  href={`/product/${product.slug}`}
                  className="inline-block mt-2 text-primary-600 font-medium hover:underline"
                >
                  View purchase options →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
