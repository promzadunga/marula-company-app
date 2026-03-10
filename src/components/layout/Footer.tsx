import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="bg-brown-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.jpg"
                alt="Marula Company"
                width={50}
                height={50}
                className="rounded-full"
              />
              <h3 className="font-bold text-lg text-primary-400">The Marula Company</h3>
            </div>
            <p className="text-brown-300 text-sm">
              Quality mobile solutions for your business needs and premium marula oil products.
              From mobile freezers to natural oils, we deliver excellence.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-400">Products</h3>
            <ul className="space-y-2 text-sm text-brown-300">
              <li>Mobile Freezers</li>
              <li>Mobile Toilets</li>
              <li>Mobile Clinics</li>
              <li>Trailers</li>
              <li>Cold Rooms</li>
              <li>Ice</li>
              <li>Insulated Panels</li>
              <li>Steel Structures</li>
              <li>Pure Marula Oil</li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-400">Our Locations</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 text-primary-300 font-medium mb-1">
                  <MapPin size={14} />
                  {siteConfig.locations.limpopo.name}
                </div>
                <p className="text-brown-300 ml-5">
                  {siteConfig.locations.limpopo.address}<br />
                  {siteConfig.locations.limpopo.city}, {siteConfig.locations.limpopo.province} {siteConfig.locations.limpopo.postalCode}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary-300 font-medium mb-1">
                  <MapPin size={14} />
                  {siteConfig.locations.gauteng.name}
                </div>
                <p className="text-brown-300 ml-5">
                  {siteConfig.locations.gauteng.address}<br />
                  {siteConfig.locations.gauteng.city}, {siteConfig.locations.gauteng.province} {siteConfig.locations.gauteng.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-400">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[\s()-]/g, '')}`}
                className="flex items-center gap-2 text-brown-300 hover:text-primary-400 transition"
              >
                <Phone size={16} />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-brown-300 hover:text-primary-400 transition"
              >
                <Mail size={16} />
                {siteConfig.contact.email}
              </a>
              <p className="text-brown-300">{siteConfig.website}</p>
              <div className="flex gap-4 mt-4">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brown-300 hover:text-primary-400 transition"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brown-300 hover:text-primary-400 transition"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brown-800 mt-8 pt-8 text-center text-sm text-brown-400">
          <p>&copy; {new Date().getFullYear()} The Marula Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
