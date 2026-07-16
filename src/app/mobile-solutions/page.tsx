import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Truck,
  Thermometer,
  Bath,
  Building,
  Snowflake,
  IceCreamCone,
  PanelTop,
  Warehouse,
  PenTool,
  Cog,
  Wrench,
  Headphones,
  ShieldCheck,
  Hammer,
  HeartPulse,
  Mountain,
  HardHat,
  PartyPopper,
  Wheat,
  Landmark,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  Monitor,
  Flame,
  Box,
  Settings,
  Clock,
  Users,
  BarChart3,
} from 'lucide-react';
import { categories, siteConfig } from '@/lib/config';
import { CategorySelect } from '@/components/ui/CategorySelect';

export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const subcategoryIcons: Record<string, React.ReactNode> = {
  FREEZERS: <Thermometer size={28} />,
  TOILETS: <Bath size={28} />,
  CLINICS: <Building size={28} />,
  TRAILERS: <Truck size={28} />,
  COLD_ROOMS: <Snowflake size={28} />,
  ICE: <IceCreamCone size={28} />,
  INSULATED_PANELS: <PanelTop size={28} />,
  STEEL_STRUCTURES: <Warehouse size={28} />,
};

export default async function MobileSolutionsPage() {
  const products = await prisma.product.findMany({
    where: {
      category: 'MOBILE_SOLUTIONS',
      isActive: true,
      listingType: {
        in: ['SALE_ONLY', 'SALE_AND_RENTAL'],
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
    take: 6,
  });

  const subcategories = categories.MOBILE_SOLUTIONS.subcategories;

  return (
    <div className="bg-white">
      {/* ── PAGE 01: HERO ── */}
      <section className="min-h-screen grid md:grid-cols-2 grid-rows-[1fr_auto] p-8 md:p-16 gap-0">
        {/* Left */}
        <div className="pr-0 md:pr-16 flex flex-col justify-center">
          {/* Brand header */}
          <div className="flex items-center gap-4 mb-8">
            <div>
              <p className={`${playfair.className} text-4xl md:text-5xl italic text-eng-navy leading-none`}>
                Marula
              </p>
              <p className="text-xs tracking-[0.4em] text-eng-navy font-medium">COMPANY</p>
            </div>
          </div>

          <div className="inline-block text-sm tracking-[0.5em] text-eng-navy font-semibold py-2 border-y border-eng-navy mb-8 self-start">
            ENGINEERING
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-eng-navy leading-none tracking-tight mb-8">
            COMPANY<br />PROFILE
          </h1>

          <p className={`${playfair.className} italic text-lg text-eng-steel mb-8 leading-relaxed`}>
            Engineering. Manufacturing.<br />Mobility. Excellence.
          </p>

          <ul className="space-y-3 mb-8">
            {['MOBILE FRIDGES', 'MOBILE VIP TOILETS', 'MOBILE CLINICS', 'MOBILE TRAILERS', 'STEEL BUILDING STRUCTURES', 'GENERAL STEEL FABRICATION'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm tracking-[0.1em] text-eng-navy font-semibold">
                <span className="text-eng-steel">&#9642;</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#products"
              className="inline-flex items-center gap-2 bg-eng-navy text-white px-6 py-3 rounded font-semibold hover:bg-eng-navy-deep transition"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/rentals"
              className="inline-flex items-center gap-2 border-2 border-eng-navy text-eng-navy px-6 py-3 rounded font-semibold hover:bg-eng-navy hover:text-white transition"
            >
              Rent a Unit
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-eng-steel text-eng-steel px-6 py-3 rounded font-semibold hover:bg-eng-steel hover:text-white transition"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Right — photo */}
        <div className="hidden md:block relative min-h-[500px] overflow-hidden">
          <Image
            src="/mobile.jpeg"
            alt="Marula Engineering team on site"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Hero footer — quality promises bar */}
        <div className="col-span-full bg-eng-navy text-white p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 -mx-8 md:-mx-16 mt-8">
          {['QUALITY CRAFTSMANSHIP', 'INNOVATIVE SOLUTIONS', 'CUSTOMER FOCUSED', 'BUILT TO LAST'].map((promise) => (
            <div key={promise} className="flex items-center gap-2 text-xs tracking-[0.15em] font-semibold">
              <CheckCircle2 size={14} className="text-eng-steel flex-shrink-0" />
              <span>{promise}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAGE 02: WHO WE ARE + WHAT WE DO + VALUES ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          {/* Who We Are */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-8">Who We Are</h2>
              <div className="space-y-4 text-eng-steel text-[15px] leading-relaxed">
                <p>The Marula Company Engineering is a proudly South African engineering and manufacturing company that specialises in mobile and modular facilities, steel structures, and general steel fabrication.</p>
                <p>We combine innovative design, precision engineering, and superior craftsmanship to deliver high-quality, durable, and cost-effective solutions tailored to our clients&apos; diverse needs.</p>
                <p>Our commitment to excellence, integrity, and customer satisfaction drives everything we do.</p>
              </div>
            </div>
            <div className="relative min-h-[250px] overflow-hidden rounded-sm">
              <Image src="/mobile.jpeg" alt="Workshop facility" fill className="object-cover" />
            </div>
          </div>

          {/* What We Do — capabilities row */}
          <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-8">What We Do</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-8 border-y border-eng-gray-warm mb-16">
            {[
              { icon: <PenTool size={28} />, title: 'DESIGN', desc: 'Innovative & functional design solutions' },
              { icon: <Cog size={28} />, title: 'MANUFACTURE', desc: 'Precision manufacturing with quality materials' },
              { icon: <Truck size={28} />, title: 'DELIVER', desc: 'Safe & efficient delivery nationwide' },
              { icon: <Wrench size={28} />, title: 'INSTALL', desc: 'Professional installation & commissioning' },
              { icon: <Headphones size={28} />, title: 'SUPPORT', desc: 'After-sales support and maintenance' },
            ].map((cap) => (
              <div key={cap.title} className="text-center p-4">
                <div className="text-eng-navy mb-2 flex justify-center">{cap.icon}</div>
                <p className="text-sm font-bold text-eng-navy tracking-[0.1em] mb-1">{cap.title}</p>
                <p className="text-xs text-eng-gray-mid leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>

          {/* Values + Quote */}
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-0">
            {/* Values block — navy bg */}
            <div className="bg-eng-navy text-white p-8">
              <p className="text-sm tracking-[0.2em] font-bold mb-4">OUR VALUES</p>
              <ul className="space-y-3">
                {['Integrity & Honesty', 'Quality & Safety', 'Innovation & Excellence', 'Customer Satisfaction', 'Teamwork & Respect'].map((val) => (
                  <li key={val} className="flex items-center gap-2 text-sm">
                    <span className="text-eng-steel font-bold">&#10003;</span>
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Quote block — cream bg */}
            <div className="bg-eng-cream p-8 flex items-center justify-center relative">
              <p className={`${playfair.className} italic text-xl md:text-2xl text-eng-navy text-center leading-relaxed max-w-sm`}>
                <span className="text-eng-steel text-4xl leading-none">&ldquo;</span>
                We don&apos;t just build structures, we build solutions that move with you.
                <span className="text-eng-steel text-4xl leading-none">&rdquo;</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAGE 03: PRODUCTS & SERVICES ── */}
      <section className="py-16 md:py-24 bg-eng-cream-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-8">Our Products &amp; Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Thermometer size={24} />, title: 'MOBILE FRIDGES', desc: 'Transport and store perishable goods with our robust, energy-efficient mobile fridges.' },
              { icon: <Bath size={24} />, title: 'MOBILE VIP TOILETS', desc: 'Luxury mobile toilet facilities designed for comfort, hygiene, and convenience.' },
              { icon: <Building size={24} />, title: 'MOBILE CLINICS', desc: 'Fully equipped mobile clinics bringing healthcare services where they are needed most.' },
              { icon: <Truck size={24} />, title: 'MOBILE TRAILERS', desc: 'Custom-built trailers for equipment, machinery, and multipurpose use.' },
              { icon: <Warehouse size={24} />, title: 'STEEL BUILDING STRUCTURES', desc: 'Durable, cost-effective steel structures for industrial, commercial, and agricultural applications.' },
              { icon: <Hammer size={24} />, title: 'GENERAL STEEL FABRICATION', desc: 'Custom steel fabrication including gates, frames, platforms, tanks, and other steel works.' },
            ].map((service) => (
              <article key={service.title} className="bg-white border border-eng-gray-warm overflow-hidden rounded-sm">
                <div className="relative h-[180px] bg-eng-gray-warm">
                  <Image src="/mobile.jpeg" alt={service.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-eng-navy-deep/40" />
                  <div className="absolute bottom-3 left-3 text-white">{service.icon}</div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-eng-navy tracking-[0.1em] mb-2">{service.title}</h3>
                  <p className="text-sm text-eng-gray-mid leading-relaxed">{service.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAGE 04: FEATURED PROJECTS ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-8">Featured Projects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image src="/mobile.jpeg" alt={`Project ${i + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-eng-navy-deep/30" />
              </div>
            ))}
          </div>

          {/* Project footer bar */}
          <div className="bg-eng-navy text-white p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Cog size={16} />, label: 'Modern Equipment' },
              { icon: <Users size={16} />, label: 'Skilled Workforce' },
              { icon: <CheckCircle2 size={16} />, label: 'Quality Materials' },
              { icon: <Clock size={16} />, label: 'Timely Delivery' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm font-medium tracking-wide">
                <span className="text-eng-steel">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAGE 05: WHY CHOOSE US + INDUSTRIES ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-12">
            {/* Why Choose Us */}
            <div>
              <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-8">Why Choose Us?</h2>
              <ul className="space-y-0">
                {[
                  'High-quality products built to last',
                  'Competitive pricing',
                  'Experienced and skilled team',
                  'Innovative and customized solutions',
                  'On-time delivery and installation',
                  'Excellent after-sales support',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 py-3 text-eng-steel border-b border-dotted border-eng-gray-warm">
                    <span className="text-eng-steel font-bold">&#10003;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Quality seal */}
            <div className="flex justify-center items-center bg-gradient-to-br from-eng-navy-deep to-eng-steel p-16 min-h-[300px]">
              <div className="w-[220px] h-[220px] rounded-full bg-white border-4 border-eng-steel flex items-center justify-center">
                <div className="text-center text-eng-navy">
                  <p className="text-sm font-semibold tracking-[0.2em]">QUALITY</p>
                  <p className="text-xs tracking-[0.15em] my-1">YOU CAN</p>
                  <p className={`${playfair.className} text-4xl font-bold`}>TRUST</p>
                  <p className="text-[10px] tracking-[0.15em] text-eng-gray-mid mt-1">SERVICE YOU CAN<br />RELY ON</p>
                </div>
              </div>
            </div>
          </div>

          {/* Industries bar */}
          <div className="bg-eng-navy text-white p-8 -mx-8 md:mx-0">
            <p className="text-sm tracking-[0.2em] font-bold mb-8">INDUSTRIES WE SERVE</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {[
                { icon: <HeartPulse size={28} />, label: 'HEALTHCARE' },
                { icon: <Mountain size={28} />, label: 'MINING' },
                { icon: <HardHat size={28} />, label: 'CONSTRUCTION' },
                { icon: <PartyPopper size={28} />, label: 'EVENTS &\nHOSPITALITY' },
                { icon: <Wheat size={28} />, label: 'AGRICULTURE' },
                { icon: <Landmark size={28} />, label: 'GOVERNMENT' },
              ].map((ind) => (
                <div key={ind.label} className="text-center">
                  <div className="text-eng-steel mb-2 flex justify-center">{ind.icon}</div>
                  <p className="text-xs tracking-[0.15em] font-semibold whitespace-pre-line">{ind.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PAGE 06: CAPABILITIES + STATS ── */}
      <section className="py-16 md:py-24 bg-eng-cream-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            {/* Capabilities list */}
            <div>
              <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-8">Our Capabilities</h2>
              <ul className="space-y-0">
                {[
                  { icon: <Monitor size={18} />, title: 'Computer-Aided Design (CAD)' },
                  { icon: <Cog size={18} />, title: 'Precision Manufacturing' },
                  { icon: <Flame size={18} />, title: 'Welding & Steel Fabrication' },
                  { icon: <Box size={18} />, title: 'Modular & Mobile Solutions' },
                  { icon: <Wrench size={18} />, title: 'Site Installation & Commissioning' },
                  { icon: <Settings size={18} />, title: 'Maintenance & Support' },
                ].map((cap) => (
                  <li key={cap.title} className="flex items-center gap-3 py-3 text-eng-steel border-b border-dotted border-eng-gray-warm">
                    <span className="text-eng-steel">{cap.icon}</span>
                    <span>{cap.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Workshop photo */}
            <div className="relative min-h-[300px] overflow-hidden rounded-sm">
              <Image src="/mobile.jpeg" alt="Workshop and team" fill className="object-cover" />
            </div>
          </div>

          {/* Stats row */}
          <div className="bg-eng-navy text-white p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 -mx-8 md:mx-0">
            {[
              { icon: <BarChart3 size={20} />, value: '100+', label: 'Projects Completed' },
              { icon: <Users size={20} />, value: '50+', label: 'Satisfied Clients' },
              { icon: <Clock size={20} />, value: '10+', label: 'Years Experience' },
              { icon: <MapPin size={20} />, value: 'Nationwide', label: 'Service' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-eng-steel mb-2 flex justify-center">{stat.icon}</div>
                <p className={`${playfair.className} text-3xl font-bold text-white mb-1`}>{stat.value}</p>
                <p className="text-xs tracking-[0.1em] text-eng-gray-warm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY (App functionality) ── */}
      <section id="products" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-4">Browse by Category</h2>
          <p className="text-eng-steel mb-10 max-w-2xl">
            Explore our full range of mobile and modular solutions.
            Looking to rent?{' '}
            <Link href="/rentals" className="text-eng-steel hover:underline">
              View rental options &rarr;
            </Link>
          </p>

          {/* Mobile: dropdown */}
          <div className="md:hidden mb-6">
            <CategorySelect categories={subcategories} basePath="/mobile-solutions" />
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/mobile-solutions/${sub.slug}`}
                className="group bg-white border border-eng-gray-warm p-6 rounded-sm hover:border-eng-steel transition-colors"
              >
                <div className="w-14 h-14 border-2 border-eng-navy rounded-full flex items-center justify-center text-eng-navy mb-4 group-hover:border-eng-steel group-hover:text-eng-steel transition-colors">
                  {subcategoryIcons[sub.value] || <Truck size={28} />}
                </div>
                <h3 className="text-xs tracking-[0.15em] text-eng-navy font-bold mb-1">
                  {sub.name.toUpperCase()}
                </h3>
                <p className="text-xs text-eng-gray-mid">View all {sub.name.toLowerCase()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (App functionality) ── */}
      <section className="py-16 md:py-24 bg-eng-cream-light">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-4">Featured Products</h2>
          <p className="text-eng-gray-mid mb-10">Our latest mobile engineering products available for purchase.</p>
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} mode="sale" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-eng-gray-mid">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── PAGE 07: MEET THE TEAM + SAFETY & QUALITY ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-eng-navy tracking-wide uppercase mb-8">Meet the Team</h2>
              <p className="text-eng-steel text-[15px] leading-relaxed mb-6">
                Our team of engineers, designers, artisans, and project managers work together to ensure every project is delivered with precision and pride.
              </p>

              <h3 className="text-lg font-bold text-eng-navy tracking-wide uppercase mt-8 mb-4">Safety &amp; Quality</h3>
              <p className="text-eng-steel text-[15px] leading-relaxed">
                We adhere to strict quality control standards and health &amp; safety regulations to ensure the safety of our team, our clients, and the environment.
              </p>
            </div>
            <div className="relative min-h-[350px] overflow-hidden rounded-sm">
              <Image src="/mobile.jpeg" alt="The Marula Engineering team" fill className="object-cover" />
            </div>
          </div>

          {/* Quality icons */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-eng-gray-warm">
            {[
              { icon: <ShieldCheck size={28} />, label: 'ISO Standards\nDriven' },
              { icon: <HeartPulse size={28} />, label: 'Health & Safety\nCompliant' },
              { icon: <CheckCircle2 size={28} />, label: 'Quality Assurance\nGuaranteed' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-16 h-16 rounded-full bg-eng-cream border-2 border-eng-navy flex items-center justify-center text-eng-navy mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-sm text-eng-navy font-semibold tracking-wide whitespace-pre-line leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAGE 08: LET'S BUILD TOGETHER ── */}
      <section className="border-t border-eng-gray-warm">
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          {/* Left — contact */}
          <div className="py-16 md:py-24 px-8 flex flex-col justify-center bg-white">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-eng-navy leading-tight mb-8">
                LET&apos;S BUILD<br />TOGETHER
              </h2>
              <p className="text-eng-steel text-[15px] leading-relaxed mb-8">
                Partner with The Marula Company Engineering for reliable, durable, and innovative
                engineering solutions that deliver value and exceed expectations.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 text-eng-steel">
                  <Phone size={18} className="text-eng-steel flex-shrink-0 mt-0.5" />
                  <span>{siteConfig.contact.phone}</span>
                </div>
                <div className="flex items-start gap-4 text-eng-steel">
                  <Mail size={18} className="text-eng-steel flex-shrink-0 mt-0.5" />
                  <span>{siteConfig.contact.email}</span>
                </div>
                <div className="flex items-start gap-4 text-eng-steel">
                  <Globe size={18} className="text-eng-steel flex-shrink-0 mt-0.5" />
                  <span>{siteConfig.website}</span>
                </div>
                <div className="flex items-start gap-4 text-eng-steel">
                  <MapPin size={18} className="text-eng-steel flex-shrink-0 mt-0.5" />
                  <span>{siteConfig.locations.gauteng.address}, {siteConfig.locations.gauteng.city}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-eng-navy text-white px-6 py-3 text-sm font-bold tracking-wide hover:bg-eng-navy-deep transition rounded-sm"
                >
                  Contact Us
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/rentals"
                  className="inline-flex items-center gap-2 border border-eng-navy text-eng-navy px-6 py-3 text-sm font-bold tracking-wide hover:bg-eng-navy/5 transition rounded-sm"
                >
                  View Rentals
                </Link>
              </div>
            </div>
          </div>

          {/* Right — brand block */}
          <div className="bg-eng-cream flex items-center justify-center py-16 md:py-24 px-8">
            <div className="text-center">
              <p className={`${playfair.className} text-5xl italic text-eng-navy leading-none mb-1`}>
                Marula
              </p>
              <p className="text-sm tracking-[0.5em] text-eng-navy font-medium mb-2">COMPANY</p>
              <div className="inline-block text-xs tracking-[0.4em] text-eng-navy font-semibold py-2 px-8 border-y border-eng-navy mb-8">
                ENGINEERING
              </div>

              <div className={`${playfair.className} italic text-lg text-eng-navy leading-relaxed mb-8`}>
                <p>Engineering Mobility.</p>
                <p>Building Possibilities.</p>
              </div>

              <div className="relative h-[150px] w-full rounded-sm overflow-hidden">
                <Image src="/mobile.jpeg" alt="Facility" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="bg-eng-navy-deep text-white p-4 flex flex-wrap justify-between items-center text-xs tracking-wide">
          <span>The Marula Company Engineering (Pty) Ltd</span>
          <span className={`${playfair.className} italic text-eng-steel`}>
            Engineering. Manufacturing. Mobility. Excellence.
          </span>
        </div>
      </section>
    </div>
  );
}
