'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ListingType } from '@prisma/client';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  listingType?: ListingType;
  images: { url: string }[];
}

interface ProductSliderProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

export function ProductSlider({ products, title, subtitle }: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons();
    container.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);

    return () => {
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 300; // Approximate card width
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900">{title}</h2>
            {subtitle && (
              <p className="text-gray-600 mt-2">{subtitle}</p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition ${
                canScrollLeft
                  ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition ${
                canScrollRight
                  ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Products Slider */}
        <div className="relative">
          {/* Left Gradient */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.map((product) => {
              const primaryImage = product.images[0];
              const hasDiscount = product.salePrice && product.salePrice < product.price;
              const isRentable = product.listingType === 'RENTAL_ONLY' || product.listingType === 'SALE_AND_RENTAL';

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex-shrink-0 w-[280px] md:w-[300px] group"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-full">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {hasDiscount && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                            Sale
                          </span>
                        )}
                        {isRentable && (
                          <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
                            Rentable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-brown-900 group-hover:text-primary-500 transition line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        {hasDiscount ? (
                          <>
                            <span className="text-lg font-bold text-primary-500">
                              {formatCurrency(product.salePrice!)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-brown-900">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Gradient */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
          )}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border transition ${
              canScrollLeft
                ? 'border-gray-300 bg-white text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border transition ${
              canScrollRight
                ? 'border-gray-300 bg-white text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
