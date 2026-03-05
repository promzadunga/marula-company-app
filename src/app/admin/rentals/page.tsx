import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Package, Clock, CheckCircle, XCircle, Truck, RotateCcw } from 'lucide-react';
import { RentalStatus } from '@prisma/client';
import { RentalStatusActions } from './RentalStatusActions';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_CONFIG: Record<RentalStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700', icon: Truck },
  RETURNED: { label: 'Returned', color: 'bg-gray-100 text-gray-700', icon: RotateCcw },
  OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: Clock },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: XCircle },
};

export default async function AdminRentalsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status as RentalStatus | undefined;

  // Fetch rentals with related data
  const rentals = await prisma.rental.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          rentalQuantity: true,
          images: {
            where: { isPrimary: true },
            take: 1,
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
      orderItem: {
        select: {
          unitPrice: true,
          totalPrice: true,
          rentalDays: true,
          order: {
            select: {
              orderNumber: true,
              customerName: true,
              customerEmail: true,
              customerPhone: true,
              shippingAddress: true,
              shippingCity: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get counts for each status
  const statusCounts = await prisma.rental.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  const counts: Record<string, number> = {
    all: rentals.length,
  };
  statusCounts.forEach((s) => {
    counts[s.status] = s._count.status;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Rentals</h1>
          <p className="text-gray-600">Manage rental requests and active rentals</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/rentals"
          className={`px-4 py-2 rounded-lg transition ${
            !statusFilter ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          All ({counts.all || 0})
        </Link>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <Link
            key={status}
            href={`/admin/rentals?status=${status}`}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              statusFilter === status ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <config.icon size={16} />
            {config.label} ({counts[status] || 0})
          </Link>
        ))}
      </div>

      {/* Rentals Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rental</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Period</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rentals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No rentals found</p>
                </td>
              </tr>
            ) : (
              rentals.map((rental) => {
                const config = STATUS_CONFIG[rental.status];
                const StatusIcon = config.icon;
                const primaryImage = rental.product.images[0];

                return (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    {/* Rental Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={rental.product.name}
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
                          <p className="font-medium text-brown-900">{rental.product.name}</p>
                          <p className="text-sm text-gray-500">{rental.rentalNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">
                        {rental.orderItem.order.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {rental.orderItem.order.customerEmail}
                      </p>
                      <p className="text-sm text-gray-500">
                        {rental.orderItem.order.customerPhone}
                      </p>
                    </td>

                    {/* Period */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-brown-900">
                        {new Date(rental.startDate).toLocaleDateString()} -
                      </p>
                      <p className="text-sm text-brown-900">
                        {new Date(rental.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rental.orderItem.rentalDays} days
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">
                        {formatCurrency(rental.orderItem.totalPrice)}
                      </p>
                      {rental.depositAmount > 0 && (
                        <p className="text-xs text-gray-500">
                          + {formatCurrency(rental.depositAmount)} deposit
                        </p>
                      )}
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
                      <RentalStatusActions
                        rentalId={rental.id}
                        currentStatus={rental.status}
                        availableUnits={rental.product.rentalQuantity}
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
