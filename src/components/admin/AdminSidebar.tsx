'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Rentals', href: '/admin/rentals', icon: Calendar },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brown-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-brown-800">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Marula Company"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="font-bold text-primary-400">Marula</div>
            <div className="text-xs text-brown-400">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-brown-300 hover:bg-brown-800 hover:text-white'
                  )}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-brown-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-brown-300 hover:bg-brown-800 hover:text-white transition w-full"
        >
          <ExternalLink size={20} />
          Back to Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-brown-300 hover:bg-brown-800 hover:text-white transition w-full"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
