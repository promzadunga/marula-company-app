'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  thumbnailUrl?: string | null;
}

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-brown-100 rounded-xl flex items-center justify-center text-brown-400">
        No images available
      </div>
    );
  }

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative aspect-square rounded-xl overflow-hidden bg-brown-50 cursor-zoom-in group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex].url}
            alt={images[activeIndex].altText || productName}
            fill
            className="object-cover"
            priority
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={24} className="text-brown-900" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={24} className="text-brown-900" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                  index === activeIndex
                    ? "border-primary-500 ring-2 ring-primary-200"
                    : "border-transparent hover:border-brown-300"
                )}
              >
                <Image
                  src={img.thumbnailUrl || img.url}
                  alt={img.altText || `${productName} ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-primary-400 transition"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] mx-4">
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].altText || productName}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition"
          >
            <ChevronRight size={48} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
                className={cn(
                  "w-16 h-16 rounded overflow-hidden border-2 transition-all",
                  index === activeIndex
                    ? "border-primary-500"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img.thumbnailUrl || img.url}
                  alt=""
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
