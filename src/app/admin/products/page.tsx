import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye } from "lucide-react";
import { getProducts } from "./actions";
import { ProductCategory } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { DeleteProductButton } from "./DeleteProductButton";
import { ProductStatusToggle } from "./ProductStatusToggle";

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category as ProductCategory | undefined;
  const page = params.page ? parseInt(params.page) : 1;

  const { products, total, totalPages } = await getProducts({
    category,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Link
          href="/admin/products"
          className={`px-4 py-2 rounded-lg transition ${
            !category ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          All ({total})
        </Link>
        <Link
          href="/admin/products?category=MOBILE_SOLUTIONS"
          className={`px-4 py-2 rounded-lg transition ${
            category === 'MOBILE_SOLUTIONS' ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Mobile Solutions
        </Link>
        <Link
          href="/admin/products?category=MARULA_OIL"
          className={`px-4 py-2 rounded-lg transition ${
            category === 'MARULA_OIL' ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Marula Oil
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const primaryImage = product.images[0];
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-brown-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category === 'MOBILE_SOLUTIONS' ? 'Mobile' : 'Marula Oil'}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {product.subcategory?.replace(/_/g, ' ') || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">{formatCurrency(product.price)}</p>
                      {product.salePrice && (
                        <p className="text-sm text-green-600">Sale: {formatCurrency(product.salePrice)}</p>
                      )}
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                        product.listingType === 'RENTAL_ONLY'
                          ? 'bg-blue-100 text-blue-700'
                          : product.listingType === 'SALE_AND_RENTAL'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.listingType === 'RENTAL_ONLY' ? 'Rental' : product.listingType === 'SALE_AND_RENTAL' ? 'Sale & Rental' : 'Sale'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(product.listingType === 'SALE_ONLY' || product.listingType === 'SALE_AND_RENTAL') && (
                        <p className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stockQuantity} in stock
                        </p>
                      )}
                      {(product.listingType === 'RENTAL_ONLY' || product.listingType === 'SALE_AND_RENTAL') && product.rentalQuantity !== null && (
                        <p className={`text-sm ${product.rentalQuantity > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {product.rentalQuantity} for rent
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ProductStatusToggle
                        productId={product.id}
                        isActive={product.isActive}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="View"
                          target="_blank"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} products
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}${category ? `&category=${category}` : ''}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50 transition"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/products?page=${page + 1}${category ? `&category=${category}` : ''}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50 transition"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

