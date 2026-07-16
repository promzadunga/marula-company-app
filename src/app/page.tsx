import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { ArrowRight, Truck, Droplets, Shield, Leaf } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductSlider } from '@/components/product/ProductSlider';

export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

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
    <div className="bg-marula-cream">
      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://tg6jb9lfyw.ufs.sh/f/O8IwYKxyJ072aFfEH0vcYsESHaNm1qWxZIPB4woLXijz5QOn" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-marula-green-deep/85" />
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className={`${playfair.className} text-4xl md:text-6xl font-semibold mb-6`}>
              <span className="text-marula-gold italic">Quality</span> Solutions for Your Business
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-marula-cream/80">
              Mobile solutions for your business and premium marula oil products.
              Sales and rentals available across South Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/mobile-solutions"
                className="inline-flex items-center gap-2 bg-marula-gold text-white px-6 py-3 rounded font-semibold hover:bg-marula-gold-dark transition"
              >
                Engineering
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/marula-oil"
                className="inline-flex items-center gap-2 border-2 border-marula-gold text-marula-gold px-6 py-3 rounded font-semibold hover:bg-marula-gold/10 transition"
              >
                Shop Marula Oil
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/rentals"
                className="inline-flex items-center gap-2 border-2 border-marula-cream/40 text-marula-cream px-6 py-3 rounded font-semibold hover:bg-white/10 transition"
              >
                Rentals
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-marula-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className={`${playfair.className} italic text-marula-gold text-sm tracking-widest uppercase mb-2`}>What We Offer</p>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-marula-green-deep mb-4`}>Our Products</h2>
            <div className="w-16 h-px bg-marula-gold mx-auto mb-4" />
            <p className="text-marula-text-muted max-w-2xl mx-auto">
              From industrial mobile units to luxurious skincare, we offer quality products for every need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Engineering Card */}
            <Link
              href="/mobile-solutions"
              className="group relative overflow-hidden rounded bg-marula-cream-light border border-marula-gold/20 hover:border-marula-gold/40 transition-all duration-300"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="/mobile.jpeg"
                  alt="Engineering - Mobile fridges, toilets and clinics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marula-green-deep/90 via-marula-green-deep/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Truck size={40} className="text-marula-gold mb-4" />
                  <h3 className={`${playfair.className} text-2xl font-semibold text-white mb-2`}>Engineering</h3>
                  <p className="text-marula-cream/80">
                    Mobile fridges, toilets, and clinics for rent or purchase
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-marula-gold font-semibold group-hover:gap-2 transition-all">
                  Explore Products <ArrowRight size={20} className="ml-2" />
                </div>
              </div>
            </Link>

            {/* Marula Oil Card */}
            <Link
              href="/marula-oil"
              className="group relative overflow-hidden rounded bg-marula-cream-light border border-marula-gold/20 hover:border-marula-gold/40 transition-all duration-300"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="/marula.jpg"
                  alt="Marula Oil - Premium marula oil products"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marula-green-deep/90 via-marula-green-deep/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Droplets size={40} className="text-marula-gold mb-4" />
                  <h3 className={`${playfair.className} text-2xl font-semibold text-white mb-2`}>Marula Oil</h3>
                  <p className="text-marula-cream/80">
                    Premium marula oils, gift sets, and bundles
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-marula-gold font-semibold group-hover:gap-2 transition-all">
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
      <section className="py-16 bg-marula-cream-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className={`${playfair.className} italic text-marula-gold text-sm tracking-widest uppercase mb-2`}>Our Promise</p>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-marula-green-deep`}>Why Choose Us</h2>
            <div className="w-16 h-px bg-marula-gold mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-marula-cream-light border border-marula-gold/20 rounded">
              <div className="w-16 h-16 bg-marula-green-deep/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-marula-gold" size={32} />
              </div>
              <h3 className={`${playfair.className} text-xl font-semibold mb-2 text-marula-green-deep`}>Quality Guaranteed</h3>
              <p className="text-marula-text-muted">
                All our products are thoroughly tested and certified for quality.
              </p>
            </div>
            <div className="text-center p-8 bg-marula-cream-light border border-marula-gold/20 rounded">
              <div className="w-16 h-16 bg-marula-green-deep/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-marula-gold" size={32} />
              </div>
              <h3 className={`${playfair.className} text-xl font-semibold mb-2 text-marula-green-deep`}>Delivery & Rental</h3>
              <p className="text-marula-text-muted">
                Flexible rental options and delivery across South Africa.
              </p>
            </div>
            <div className="text-center p-8 bg-marula-cream-light border border-marula-gold/20 rounded">
              <div className="w-16 h-16 bg-marula-green-deep/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-marula-gold" size={32} />
              </div>
              <h3 className={`${playfair.className} text-xl font-semibold mb-2 text-marula-green-deep`}>Natural & Sustainable</h3>
              <p className="text-marula-text-muted">
                Ethically sourced marula oil supporting local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-marula-green-deep text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-semibold mb-4`}>Ready to Get Started?</h2>
          <p className="text-marula-cream/70 mb-8 max-w-2xl mx-auto">
            Browse our products, add to cart, and checkout - no registration required.
            Create an account to track your orders and rentals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/marula-oil"
              className="bg-marula-gold text-white px-8 py-3 rounded font-semibold hover:bg-marula-gold-dark transition"
            >
              Browse Products
            </Link>
            <Link
              href="/mobile-solutions#contact"
              className="border-2 border-marula-gold text-marula-gold px-8 py-3 rounded font-semibold hover:bg-marula-gold/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
