import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Droplets, Shield, Clock, Leaf } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { prisma } from '@/lib/prisma';
import { ProductSlider } from '@/components/product/ProductSlider';
import { YouTubeBackground } from '@/components/ui/YouTubeBackground';

async function getRecentProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice,
    listingType: p.listingType,
    images: p.images,
  }));
}

export default async function HomePage() {
  const recentProducts = await getRecentProducts();
  return (
    <div>
      {/* Hero Section with Video Background */}
      <YouTubeBackground
        videoId="jgNmxalaye0"
        className="text-white"
        overlayClassName="bg-gradient-to-r from-brown-900/90 via-brown-900/80 to-brown-900/70"
      >
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-primary-400">Quality</span> Solutions for Your Business
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-brown-200">
              Mobile solutions for your business and premium marula oil products.
              Sales and rentals available across South Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/mobile-solutions"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
              >
                Mobile Solutions
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/marula-oil"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-primary-400 text-primary-400 px-6 py-3 rounded-lg font-semibold hover:bg-primary-400/10 transition"
              >
                Shop Marula Oil
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </YouTubeBackground>

      {/* Categories */}
      <section className="py-16 bg-brown-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-brown-900">Our Products</h2>
          <p className="text-center text-brown-600 mb-12 max-w-2xl mx-auto">
            From industrial mobile units to luxurious skincare, we offer quality products for every need.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mobile Solutions Card */}
            <Link
              href="/mobile-solutions"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="/mobile.jpeg"
                  alt="Mobile Solutions - Mobile fridges, toilets and clinics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/90 via-brown-900/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Truck size={48} className="text-primary-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Mobile Solutions</h3>
                  <p className="text-brown-200">
                    Mobile fridges, toilets, and clinics for rent or purchase
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-primary-500 font-semibold group-hover:gap-2 transition-all">
                  Explore Products <ArrowRight size={20} className="ml-2" />
                </div>
              </div>
            </Link>

            {/* Marula Oil Card */}
            <Link
              href="/marula-oil"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="/marula.jpg"
                  alt="Marula Oil - Premium marula oil products"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Droplets size={48} className="text-primary-200 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Marula Oil</h3>
                  <p className="text-primary-100">
                    Premium marula oils, gift sets, and bundles
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-primary-500 font-semibold group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight size={20} className="ml-2" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Added Products */}
      <ProductSlider
        products={recentProducts}
        title="Recently Added"
        subtitle="Explore our latest products and offerings"
      />

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-brown-900">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-900">Quality Guaranteed</h3>
              <p className="text-brown-600">
                All our products are thoroughly tested and certified for quality.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-900">Delivery & Rental</h3>
              <p className="text-brown-600">
                Flexible rental options and delivery across South Africa.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-900">Natural & Sustainable</h3>
              <p className="text-brown-600">
                Ethically sourced marula oil supporting local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brown-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-brown-300 mb-8 max-w-2xl mx-auto">
            Browse our products, add to cart, and checkout - no registration required.
            Create an account to track your orders and rentals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/mobile-solutions"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-primary-400 text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-400/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
