import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Package, Clock, CheckCircle, XCircle, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { OrderStatus } from '@prisma/client';
import { OrderStatusActions } from './OrderStatusActions';

interface PageProps {
  searchParams: Promise<{ status?: string; type?: string }>;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CreditCard },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: XCircle },
  REFUNDED: { label: 'Refunded', color: 'bg-orange-100 text-orange-700', icon: XCircle },
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status as OrderStatus | undefined;
  const typeFilter = params.type || 'sale'; // Default to sale orders

  // Fetch orders (sale type only by default)
  const orders = await prisma.order.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      orderType: typeFilter,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get counts for each status
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    where: { orderType: typeFilter },
    _count: { status: true },
  });

  const counts: Record<string, number> = {
    all: orders.length,
  };
  statusCounts.forEach((s) => {
    counts[s.status] = s._count.status;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        {/* Type Toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <Link
            href="/admin/orders?type=sale"
            className={`px-4 py-2 text-sm font-medium ${
              typeFilter === 'sale'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sale Orders
          </Link>
          <Link
            href="/admin/rentals"
            className="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border-l"
          >
            Rental Orders
          </Link>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/orders?type=${typeFilter}`}
          className={`px-4 py-2 rounded-lg transition ${
            !statusFilter ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          All ({counts.all || 0})
        </Link>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <Link
            key={status}
            href={`/admin/orders?type=${typeFilter}&status=${status}`}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              statusFilter === status ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <config.icon size={16} />
            {config.label} ({counts[status] || 0})
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Items</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No orders found</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const config = STATUS_CONFIG[order.status];
                const StatusIcon = config.icon;
                const firstItem = order.items[0];

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    {/* Order Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {firstItem?.productImage ? (
                            <Image
                              src={firstItem.productImage}
                              alt={firstItem.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-brown-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      <p className="text-sm text-gray-500">{order.customerPhone}</p>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-brown-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {order.items.map((item) => item.productName).join(', ')}
                      </p>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">
                        {formatCurrency(order.total)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                        <StatusIcon size={14} />
                        {config.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <OrderStatusActions
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
