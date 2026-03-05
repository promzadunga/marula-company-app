import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { ListingType } from '@prisma/client';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    listingType?: ListingType;
    rentalPriceDaily?: number | null;
    rentalPriceWeekly?: number | null;
    rentalPriceMonthly?: number | null;
    images: {
      url: string;
      altText?: string | null;
    }[];
  };
  mode?: 'sale' | 'rental'; // Display context
}

export function ProductCard({ product, mode = 'sale' }: ProductCardProps) {
  const primaryImage = product.images[0];
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  // Determine link based on mode
  const href = mode === 'rental'
    ? `/rentals/${product.slug}`
    : `/product/${product.slug}`;

  return (
    <Link
      href={href}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-brown-100"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-brown-50">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brown-300">
            No Image
          </div>
        )}

        {/* Badges - context aware */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {mode === 'sale' && hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Sale
            </span>
          )}
          {mode === 'rental' && (
            <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded">
              For Rent
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-brown-900 group-hover:text-primary-500 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-brown-600 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Pricing - context aware */}
        <div className="mt-3">
          {mode === 'sale' ? (
            // Sale mode: show purchase price only
            <div>
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary-500">
                    {formatCurrency(product.salePrice!)}
                  </span>
                  <span className="text-sm text-brown-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-brown-900">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          ) : (
            // Rental mode: show rental pricing only
            <div className="space-y-1">
              {product.rentalPriceDaily && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-500">Daily</span>
                  <span className="font-bold text-primary-500">
                    {formatCurrency(product.rentalPriceDaily)}
                  </span>
                </div>
              )}
              {product.rentalPriceWeekly && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-500">Weekly</span>
                  <span className="font-medium text-brown-700">
                    {formatCurrency(product.rentalPriceWeekly)}
                  </span>
                </div>
              )}
              {product.rentalPriceMonthly && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-500">Monthly</span>
                  <span className="font-medium text-brown-700">
                    {formatCurrency(product.rentalPriceMonthly)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
