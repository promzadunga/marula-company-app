import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingBag, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // Fetch stats
  const [productCount, orderCount, rentalCount, recentOrders] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.rental.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const stats = [
    {
      name: 'Active Products',
      value: productCount,
      icon: Package,
      href: '/admin/products',
      color: 'bg-primary-500',
    },
    {
      name: 'Total Orders',
      value: orderCount,
      icon: ShoppingBag,
      href: '/admin/orders',
      color: 'bg-accent-500',
    },
    {
      name: 'Active Rentals',
      value: rentalCount,
      icon: Calendar,
      href: '/admin/rentals',
      color: 'bg-blue-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-brown-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-brown-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brown-600 text-sm">{stat.name}</p>
                  <p className="text-3xl font-bold text-brown-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-brown-100">
        <div className="p-6 border-b border-brown-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brown-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-brown-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-brown-50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-brown-900">{order.orderNumber}</p>
                    <p className="text-sm text-brown-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brown-900">{formatCurrency(order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
