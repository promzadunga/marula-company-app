import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ArrowLeft, Truck, Shield, Calendar } from 'lucide-react';
import { ProductPurchaseSection } from '@/components/product/ProductPurchaseSection';

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
    title: `${product.name} - The Marula Company`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
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

  // If product is RENTAL_ONLY, redirect to rental page
  if (product.listingType === 'RENTAL_ONLY') {
    redirect(`/rentals/${product.slug}`);
  }

  const categoryPath = product.category === 'MOBILE_SOLUTIONS' ? '/mobile-solutions' : '/marula-oil';
  const categoryName = product.category === 'MOBILE_SOLUTIONS' ? 'Mobile Solutions' : 'Marula Oil';
  const isAlsoRentable = product.listingType === 'SALE_AND_RENTAL';
  const hasVariants = product.variants.length > 0;

  // Check if product or any variant has discount
  const hasAnyDiscount = (product.salePrice && product.salePrice < product.price) ||
    product.variants.some(v => v.salePrice && v.salePrice < v.price);

  return (
    <div className="bg-brown-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brown-100">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={categoryPath}
            className="inline-flex items-center gap-2 text-brown-600 hover:text-primary-500 transition"
          >
            <ArrowLeft size={20} />
            Back to {categoryName}
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
            {/* Title & Badges */}
            <div>
              {hasAnyDiscount && (
                <span className="inline-block bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
                  On Sale
                </span>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-brown-900">
                {product.name}
              </h1>
            </div>

            {/* Pricing & Variants & Add to Cart */}
            <ProductPurchaseSection
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                salePrice: product.salePrice,
                stockQuantity: product.stockQuantity,
                image: product.images[0]?.url,
              }}
              variants={product.variants.map(v => ({
                id: v.id,
                name: v.name,
                price: v.price,
                salePrice: v.salePrice,
                stockQuantity: v.stockQuantity,
              }))}
            />

            {/* Also available for rental */}
            {isAlsoRentable && (
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                <p className="text-brown-900 flex items-center gap-2">
                  <Calendar size={20} className="text-primary-500" />
                  <span className="font-medium">Also available for rent!</span>
                </p>
                <p className="text-brown-600 text-sm mt-1">
                  Need this for a shorter period? Check out our rental options.
                </p>
                <Link
                  href={`/rentals/${product.slug}`}
                  className="inline-block mt-2 text-primary-600 font-medium hover:underline"
                >
                  View rental options →
                </Link>
              </div>
            )}

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

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-brown-100">
                <Truck className="text-primary-500" size={24} />
                <div>
                  <p className="font-medium text-brown-900 text-sm">Delivery Available</p>
                  <p className="text-brown-500 text-xs">Across South Africa</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-brown-100">
                <Shield className="text-primary-500" size={24} />
                <div>
                  <p className="font-medium text-brown-900 text-sm">Quality Guaranteed</p>
                  <p className="text-brown-500 text-xs">100% Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
