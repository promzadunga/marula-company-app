import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Droplets,
  Sparkles,
  Scissors,
  Heart,
  Hand,
  Baby,
  TreePine,
  Package,
  Sun,
  Gauge,
  Filter,
  FlaskConical,
  Leaf,
  ShieldCheck,
  ScanLine,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  Users,
  Home,
  HandHeart,
  Sprout,
} from 'lucide-react';
import { categories, siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const subcategoryIcons: Record<string, React.ReactNode> = {
  MARULA_OIL_RETAIL: <Droplets size={28} />,
  MARULA_OIL_WHOLESALE: <Package size={28} />,
  MARULA_OIL_BULK: <FlaskConical size={28} />,
};

export default async function MarulaOilPage() {
  const products = await prisma.product.findMany({
    where: {
      category: 'MARULA_OIL',
      isActive: true,
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

  const subcategories = categories.MARULA_OIL.subcategories;

  return (
    <div className="bg-marula-cream">
      {/* ── HERO / PAGE 01 ── */}
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/marula.jpg"
          alt="Marula oil background"
          fill
          className="absolute inset-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-marula-green-deep/95 via-marula-green-deep/90 to-marula-nut-brown/80" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-8 grid md:grid-cols-2 gap-16 items-center min-h-screen py-16">
          {/* Left */}
          <div className="text-marula-cream">
            <h1 className={`${playfair.className} text-6xl md:text-7xl italic font-normal leading-none mb-1`}>
              Marula
            </h1>
            <p className="text-sm tracking-[0.5em] font-medium mb-8">COMPANY</p>

            <div className="w-16 h-0.5 bg-marula-gold mb-8" />

            <p className="text-marula-gold text-lg tracking-[0.3em] font-medium mb-3">
              BUSINESS PROFILE
            </p>
            <p className="text-sm tracking-[0.2em] font-medium mb-1">PREMIUM MARULA OIL</p>
            <p className="text-xs tracking-[0.15em] text-marula-gold-light">
              COLD PRESSED | 100% PURE | UNREFINED
            </p>

            <ul className="mt-8 space-y-2">
              {[
                'COLD PRESSED FROM 100% SOLAR ENERGY',
                'ORGANICALLY CERTIFIED BY CERES',
                'HARVESTED BY MORE THAN 270 HARVESTERS',
                '10% OF SALES GO TO THE HARVESTERS NPC',
                'SABS APPROVED',
                'FREE FATTY ACID BELOW 2',
                'FULLY TRACEABLE',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs tracking-[0.1em] font-medium">
                  <span className="w-2 h-2 bg-marula-gold rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="#shop"
                className="inline-flex items-center gap-2 bg-marula-gold text-marula-green-deep px-6 py-3 text-sm font-bold tracking-wide hover:bg-marula-gold-light transition rounded-sm"
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#our-story"
                className="inline-flex items-center gap-2 border border-marula-gold text-marula-cream px-6 py-3 text-sm font-bold tracking-wide hover:bg-marula-gold/10 transition rounded-sm"
              >
                Our Story
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 border border-marula-gold text-marula-cream px-6 py-3 text-sm font-bold tracking-wide hover:bg-marula-gold/10 transition rounded-sm"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Right — product mockup */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-[280px] h-[460px]">
              <Image
                src="/marula.jpg"
                alt="Premium Marula Oil"
                fill
                className="object-cover rounded-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marula-green-deep/60 to-transparent" />
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className={`${playfair.className} text-marula-gold text-2xl italic`}>Marula</p>
                <p className="text-[10px] tracking-[0.2em] text-marula-gold-light mt-1">PREMIUM MARULA OIL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-marula-gold-light">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { value: '100%', label: 'Pure & Unrefined' },
            { value: '27+', label: 'Antioxidants' },
            { value: '270+', label: 'Harvesters (95% Women)' },
            { value: '<2', label: 'Free Fatty Acid' },
          ].map((stat, i) => (
            <div key={stat.label} className={`py-8 px-6 text-center ${i > 0 ? 'border-l border-marula-gold-light' : ''}`}>
              <p className={`${playfair.className} text-4xl font-semibold text-marula-gold`}>{stat.value}</p>
              <p className="text-marula-text-muted text-xs tracking-[0.1em] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP / BROWSE OUR RANGE ── */}
      <section id="shop" className="py-16 md:py-24 bg-marula-cream">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">SHOP</p>
          <h2 className={`${playfair.className} text-4xl font-semibold text-marula-gold mb-4`}>
            Browse Our Range
          </h2>
          <p className="text-marula-text-dark text-lg leading-relaxed mb-12 max-w-2xl">
            From retail bottles to bulk industrial quantities — we have the right size for your needs.
          </p>

          {/* Subcategory cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/marula-oil/${sub.slug}`}
                className="group bg-marula-cream-light border border-marula-gold-light p-8 rounded-sm hover:border-marula-gold transition-colors"
              >
                <div className="w-12 h-12 border-2 border-marula-gold rounded-full flex items-center justify-center text-marula-gold mb-4">
                  {subcategoryIcons[sub.value] || <Droplets size={24} />}
                </div>
                <h3 className="text-sm tracking-[0.15em] text-marula-green-deep font-bold mb-1">
                  {sub.name.toUpperCase()}
                </h3>
                <p className="text-marula-text-muted text-xs">View all {sub.name.toLowerCase()}</p>
              </Link>
            ))}
          </div>

          {/* Featured Products */}
          <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">FEATURED</p>
          <h3 className={`${playfair.className} text-3xl font-semibold text-marula-gold mb-8`}>
            Our Products
          </h3>
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-marula-text-muted">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT / PAGE 02 ── */}
      <section className="py-16 md:py-24 bg-marula-cream border-t border-marula-gold-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">ABOUT</p>
          <h2 className={`${playfair.className} text-4xl font-semibold text-marula-gold mb-12`}>
            Marula Company
          </h2>

          <div className="mb-12">
            <p className="text-lg leading-[1.8] text-marula-text-dark mb-4">
              Marula Company is a proudly South African producer of premium marula oil, extracted from the finest marula nuts by rural communities.
            </p>
            <p className="text-lg leading-[1.8] text-marula-text-dark">
              We are committed to creating value that goes beyond skincare — we empower people, strengthen communities and protect our natural heritage.
            </p>
          </div>

          {/* Value cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <TreePine size={28} />, title: 'NATURAL', desc: '100% Pure & Unrefined' },
              { icon: <Users size={28} />, title: 'COMMUNITY', desc: '270+ Harvesters (95% Women)' },
              { icon: <Sprout size={28} />, title: 'SUSTAINABLE', desc: 'Solar Powered & Responsible' },
              { icon: <ShieldCheck size={28} />, title: 'TRUSTED', desc: 'Certified Quality' },
            ].map((val) => (
              <div key={val.title} className="bg-marula-cream-light border border-marula-gold-light p-6 text-center rounded-sm">
                <div className="text-marula-gold mb-3 flex justify-center">{val.icon}</div>
                <p className="text-xs tracking-[0.15em] text-marula-green-deep font-bold mb-1">{val.title}</p>
                <p className="text-xs text-marula-text-muted leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          {/* Botanical card */}
          <div className="bg-marula-green-deep text-marula-cream p-8 rounded-sm">
            <p className="text-xs tracking-[0.2em] text-marula-gold-light mb-2">BOTANICAL NAME</p>
            <p className={`${playfair.className} text-2xl text-marula-gold-light italic mb-2`}>
              Sclerocarya birrea
            </p>
            <p className="text-sm text-marula-cream leading-relaxed">
              Commonly known as the Marula Tree, indigenous to the African savannah.
            </p>
          </div>
        </div>
      </section>

      {/* ── OUR PRODUCT / PAGE 03 ── */}
      <section className="py-16 md:py-24 bg-marula-cream border-t border-marula-gold-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">OUR PRODUCT</p>
          <h2 className={`${playfair.className} text-4xl font-semibold text-marula-gold mb-2`}>
            Premium Marula Oil
          </h2>
          <p className="text-sm tracking-[0.2em] text-marula-text-muted mb-8">
            COLD PRESSED | 100% PURE | UNREFINED
          </p>

          <p className="text-lg text-marula-text-dark mb-8">
            Our marula oil is rich in antioxidants, omega fatty acids and essential nutrients, making it ideal for:
          </p>

          {/* Use cases */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-12">
            {[
              { icon: <Sparkles size={28} />, label: 'SKINCARE' },
              { icon: <Scissors size={28} />, label: 'HAIRCARE' },
              { icon: <Heart size={28} />, label: 'WELLNESS' },
              { icon: <Hand size={28} />, label: 'MASSAGE' },
              { icon: <Baby size={28} />, label: 'BABY CARE' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4">
                <div className="w-14 h-14 border-2 border-marula-gold rounded-full flex items-center justify-center text-marula-gold mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-xs tracking-[0.15em] text-marula-green-deep font-semibold">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Benefits list */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mb-12">
            {[
              'Cold pressed from 100% solar energy',
              'Organically certified by CERES',
              'SABS Approved',
              'Free fatty acid below 2',
              'Pure, unrefined and undiluted',
              'Rich in antioxidants & essential fatty acids',
              'Longer shelf life',
              'Sourced ethically',
              'Sustainable & traceable',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 py-2 text-marula-text-dark">
                <span className="text-marula-gold font-bold flex-shrink-0">&#10003;</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Solar banner */}
          <div className="bg-marula-green-deep text-marula-cream p-8 rounded-sm flex flex-col sm:flex-row items-start gap-6">
            <Sun size={40} className="text-marula-gold-light flex-shrink-0" />
            <div>
              <p className={`${playfair.className} text-xl text-marula-gold-light tracking-wide mb-2`}>
                COLD PRESSED FROM 100% SOLAR ENERGY
              </p>
              <p className="text-sm leading-relaxed">
                We use clean, renewable solar energy to cold press our marula oil, preserving its natural goodness while reducing our carbon footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY / PAGE 04 ── */}
      <section id="our-story" className="py-16 md:py-24 bg-marula-cream border-t border-marula-gold-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">OUR STORY</p>
          <h2 className={`${playfair.className} text-4xl font-semibold text-marula-gold mb-12`}>
            Rooted in Africa.<br />Growing a Legacy.
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="text-lg leading-[1.8] text-marula-text-dark space-y-4">
              <p>The Marula tree is Africa&apos;s miracle tree — resilient, generous and life-giving.</p>
              <p>For generations, rural communities have harvested marula nuts by hand, using traditional knowledge passed down through families.</p>
              <p>Marula Company was founded to honour this heritage while creating sustainable economic opportunities for local harvesters, especially women.</p>
            </div>
            <div className="relative min-h-[300px] rounded-sm overflow-hidden">
              <Image
                src="/marula.jpg"
                alt="Marula harvesting community"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Impact stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-marula-gold-light">
            {[
              { icon: <Users size={24} />, value: '270+', label: 'HARVESTERS\n95% WOMEN' },
              { icon: <Home size={24} />, value: 'RURAL', label: 'COMMUNITIES\nEMPOWERED' },
              { icon: <HandHeart size={24} />, value: 'FAIR', label: 'WAGES\n& DIGNIFIED WORK' },
              { icon: <Sprout size={24} />, value: '10%', label: 'OF SALES TO\nHARVESTERS NPC' },
            ].map((stat) => (
              <div key={stat.value + stat.label} className="text-center p-4">
                <div className="text-marula-gold mb-2 flex justify-center">{stat.icon}</div>
                <p className={`${playfair.className} text-2xl font-semibold text-marula-gold mb-1`}>{stat.value}</p>
                <p className="text-xs tracking-[0.1em] text-marula-green-deep font-semibold leading-relaxed whitespace-pre-line">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS / PAGE 05 ── */}
      <section className="py-16 md:py-24 bg-marula-cream border-t border-marula-gold-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">OUR PROCESS</p>
          <h2 className={`${playfair.className} text-4xl font-semibold text-marula-gold mb-12`}>
            From Nut to Nature&apos;s Finest Oil
          </h2>

          {/* Process steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              { step: 1, icon: <TreePine size={24} />, title: 'HARVESTING', desc: 'Nuts are hand picked from wild marula trees.' },
              { step: 2, icon: <Package size={24} />, title: 'COLLECTION', desc: 'Collected by local harvesters in rural communities.' },
              { step: 3, icon: <Sun size={24} />, title: 'DRYING', desc: 'Naturally dried to preserve quality.' },
              { step: 4, icon: <Gauge size={24} />, title: 'COLD PRESSING', desc: 'Cold pressed using solar powered machinery.' },
              { step: 5, icon: <Filter size={24} />, title: 'FILTERING', desc: 'Gently filtered to maintain purity and nutrients.' },
              { step: 6, icon: <FlaskConical size={24} />, title: 'BOTTLING', desc: 'Bottled with care in our certified facility.' },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-marula-cream-light border border-marula-gold-light p-4 rounded-sm text-center"
              >
                <div className="text-marula-gold mb-2 flex justify-center">{item.icon}</div>
                <p className="text-xs tracking-[0.1em] text-marula-green-deep font-bold mb-2">
                  {item.step}. {item.title}
                </p>
                <p className="text-xs text-marula-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Why Cold Pressed */}
          <div className="bg-marula-cream-light border-l-4 border-marula-gold p-8 rounded-sm max-w-lg">
            <h3 className={`${playfair.className} text-2xl text-marula-gold-dark font-semibold mb-4`}>
              Why Cold Pressed?
            </h3>
            <ul className="space-y-2">
              {[
                'Preserves natural nutrients',
                'Retains antioxidants & vitamins',
                'No chemicals or heat',
                'Highest quality oil',
                'Better for your skin, hair and health',
              ].map((point) => (
                <li key={point} className="text-marula-text-dark pl-5 relative">
                  <span className="absolute left-0 text-marula-gold text-lg leading-none">&bull;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS & STANDARDS / PAGE 07 ── */}
      <section className="py-16 md:py-24 bg-marula-cream border-t border-marula-gold-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">
            CERTIFICATIONS &amp; STANDARDS
          </p>
          <h2 className={`${playfair.className} text-4xl font-semibold text-marula-gold mb-12`}>
            Quality You Can Rely On
          </h2>

          {/* Cert badges */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { name: 'CERES', label: 'ORGANICALLY\nCERTIFIED', icon: <Leaf size={28} /> },
              { name: 'SABS', label: 'APPROVED', icon: <ShieldCheck size={28} /> },
              { name: '<2', label: 'FREE FATTY ACID\nBELOW 2', icon: <FlaskConical size={28} /> },
            ].map((cert) => (
              <div key={cert.name} className="bg-marula-cream-light border-2 border-marula-gold p-8 rounded-sm text-center">
                <div className="text-marula-green-deep mb-3 flex justify-center">{cert.icon}</div>
                <p className={`${playfair.className} text-2xl text-marula-green-deep font-bold mb-2`}>{cert.name}</p>
                <p className="text-xs tracking-[0.15em] text-marula-green-medium font-semibold whitespace-pre-line leading-relaxed">
                  {cert.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quality icons row */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 py-8 border-y border-marula-gold-light mb-12">
            {[
              { icon: <Leaf size={24} />, label: 'ORGANICALLY\nCERTIFIED' },
              { icon: <Sun size={24} />, label: 'SOLAR\nPOWERED' },
              { icon: <ScanLine size={24} />, label: 'FULLY\nTRACEABLE' },
              { icon: <Heart size={24} />, label: 'ETHICALLY\nSOURCED' },
              { icon: <ShieldCheck size={24} />, label: 'QUALITY\nASSURED' },
              { icon: <FlaskConical size={24} />, label: 'PREMIUM\nGRADE' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-14 h-14 bg-marula-cream-light border-2 border-marula-gold rounded-full flex items-center justify-center text-marula-gold mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-[10px] tracking-[0.1em] text-marula-green-deep font-semibold whitespace-pre-line leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="bg-marula-cream-light p-8 rounded-sm max-w-2xl mx-auto text-center">
            <span className={`${playfair.className} text-5xl text-marula-gold leading-none`}>&ldquo;</span>
            <p className={`${playfair.className} italic text-lg leading-relaxed text-marula-text-dark my-4`}>
              We adhere to the highest standards of quality, safety and ethical production, ensuring a product that is pure, effective and trustworthy.
            </p>
            <span className={`${playfair.className} text-5xl text-marula-gold leading-none`}>&rdquo;</span>
          </div>
        </div>
      </section>

      {/* ── GET IN TOUCH / PAGE 08 ── */}
      <section id="contact" className="border-t border-marula-gold-light">
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          {/* Left — contact info */}
          <div className="py-16 md:py-24 px-8 flex flex-col justify-center bg-marula-cream">
            <div className="max-w-lg">
              <p className="text-sm font-semibold tracking-[0.15em] text-marula-green-medium mb-4">
                GET IN TOUCH
              </p>
              <h2 className={`${playfair.className} text-4xl font-semibold text-marula-gold mb-6`}>
                Let&apos;s Grow Together
              </h2>
              <p className="text-marula-text-dark leading-relaxed mb-8">
                We welcome partnerships that share our vision for quality, sustainability and community impact.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-marula-text-dark">
                  <Mail size={20} className="text-marula-gold flex-shrink-0" />
                  <span>{siteConfig.contact.email}</span>
                </div>
                <div className="flex items-center gap-4 text-marula-text-dark">
                  <Phone size={20} className="text-marula-gold flex-shrink-0" />
                  <span>{siteConfig.contact.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-marula-text-dark">
                  <Globe size={20} className="text-marula-gold flex-shrink-0" />
                  <span>{siteConfig.website}</span>
                </div>
                <div className="flex items-center gap-4 text-marula-text-dark">
                  <MapPin size={20} className="text-marula-gold flex-shrink-0" />
                  <span>{siteConfig.locations.limpopo.city}, {siteConfig.locations.limpopo.province}</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-marula-gold text-marula-green-deep px-6 py-3 text-sm font-bold tracking-wide hover:bg-marula-gold-light transition rounded-sm"
              >
                Contact Us
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right — brand block */}
          <div className="relative bg-marula-green-deep text-marula-cream flex items-center justify-center py-16 md:py-24 px-8 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(200,155,63,0.1) 0%, transparent 70%)' }}
            />
            <div className="relative z-10 text-center">
              <h3 className={`${playfair.className} text-5xl italic font-normal mb-1`}>Marula</h3>
              <p className="text-sm tracking-[0.5em] font-medium mb-8">COMPANY</p>

              <div className="space-y-1 mb-8">
                <p className="text-sm tracking-[0.3em] text-marula-gold-light font-semibold">PURE. POWERFUL.</p>
                <p className="text-sm tracking-[0.3em] text-marula-gold-light font-semibold">PURPOSEFUL.</p>
              </div>

              <p className="text-marula-gold text-lg tracking-[0.5em] mb-8">~~~</p>

              <div className={`${playfair.className} italic text-marula-cream leading-loose`}>
                <p>Empowering communities.</p>
                <p>Nourishing people.</p>
                <p>Protecting nature.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
