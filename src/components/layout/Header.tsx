'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Marula Oil', href: '/marula-oil' },
  { name: 'Engineering', href: '/mobile-solutions' },
  { name: 'Rentals', href: '/rentals' },
];

export function Header() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="bg-white border-b border-marula-gold/20 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Marula Company"
              width={80}
              height={80}
              className=""
            />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-4 lg:gap-6 xl:gap-8 text-sm lg:text-base">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1 transition-colors duration-200 whitespace-nowrap",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-marula-gold after:transition-all after:duration-300",
                    isActive(item.href)
                      ? "text-marula-gold font-medium after:w-full"
                      : "text-marula-green-deep hover:text-marula-gold after:w-0 hover:after:w-full"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-marula-cream-light rounded-full transition text-marula-green-deep hover:text-marula-gold"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-marula-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {session ? (
                <>
                  <Link
                    href={session.user.role === 'ADMIN' ? '/admin' : '/customer'}
                    className="flex items-center gap-2 text-marula-green-deep hover:text-marula-gold transition-colors duration-200"
                  >
                    <User size={18} />
                    {session.user.role === 'ADMIN' ? 'Admin' : session.user.name?.split(' ')[0] || 'Account'}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-marula-green-deep hover:text-marula-gold transition-colors duration-200"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bg-marula-gold text-white px-4 lg:px-6 py-2 rounded hover:bg-marula-gold-dark hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                >
                  Sign In
                </Link>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="relative p-2 hover:bg-marula-cream-light rounded-full transition text-marula-green-deep"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-marula-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-marula-green-deep"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isMobile && (
          <div className="mt-4 pb-4 flex flex-col gap-2 border-t border-marula-gold/20 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "p-3 rounded-md transition-all duration-200",
                  isActive(item.href)
                    ? "bg-marula-gold text-white font-medium"
                    : "text-marula-green-deep hover:bg-marula-cream-light"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-marula-gold/20 mt-2 pt-2">
              {session ? (
                <>
                  <Link
                    href={session.user.role === 'ADMIN' ? '/admin' : '/customer'}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-md transition-all duration-200",
                      pathname?.startsWith('/admin') || pathname?.startsWith('/customer')
                        ? "bg-marula-gold text-white font-medium"
                        : "text-marula-green-deep hover:bg-marula-cream-light"
                    )}
                  >
                    <User size={18} />
                    {session.user.role === 'ADMIN' ? 'Admin' : session.user.name?.split(' ')[0] || 'Account'}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 w-full p-3 rounded-md text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block bg-marula-gold text-white p-3 rounded hover:bg-marula-gold-dark transition-all duration-200 text-center font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
