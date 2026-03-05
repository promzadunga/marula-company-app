'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductCategory, ProductSubcategory, ListingType } from "@prisma/client";

export interface VariantFormData {
  id?: string; // For editing existing variants
  name: string; // e.g., "50ml", "1 Litre", "Small", "2m x 1.5m"
  sku?: string;
  price: number;
  salePrice?: number;
  rentalPriceDaily?: number;
  rentalPriceWeekly?: number;
  rentalPriceMonthly?: number;
  stockQuantity: number;
  rentalQuantity?: number;
  weightKg?: number;
  isActive: boolean;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  listingType: ListingType;
  price: number; // Base price (or price if no variants)
  salePrice?: number;
  rentalPriceDaily?: number;
  rentalPriceWeekly?: number;
  rentalPriceMonthly?: number;
  rentalDeposit?: number;
  sku?: string;
  stockQuantity: number;
  rentalQuantity?: number;
  weightKg?: number;
  requiresDeliveryQuote: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  specs?: { label: string; value: string }[];
  variants?: VariantFormData[]; // Product sizes/variants
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createProduct(data: ProductFormData) {
  try {
    const slug = data.slug || generateSlug(data.name);

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return { success: false, error: "A product with this slug already exists" };
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category,
        subcategory: data.subcategory,
        listingType: data.listingType,
        price: data.price,
        salePrice: data.salePrice,
        rentalPriceDaily: data.rentalPriceDaily,
        rentalPriceWeekly: data.rentalPriceWeekly,
        rentalPriceMonthly: data.rentalPriceMonthly,
        rentalDeposit: data.rentalDeposit,
        sku: data.sku,
        stockQuantity: data.stockQuantity,
        rentalQuantity: data.rentalQuantity,
        weightKg: data.weightKg,
        requiresDeliveryQuote: data.requiresDeliveryQuote,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        images: {
          create: data.images.map((url, index) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index,
          }))
        },
        specs: data.specs && data.specs.length > 0 ? {
          create: data.specs.map((spec, index) => ({
            label: spec.label,
            value: spec.value,
            sortOrder: index,
          }))
        } : undefined,
        variants: data.variants && data.variants.length > 0 ? {
          create: data.variants.map((variant, index) => ({
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            rentalPriceDaily: variant.rentalPriceDaily,
            rentalPriceWeekly: variant.rentalPriceWeekly,
            rentalPriceMonthly: variant.rentalPriceMonthly,
            stockQuantity: variant.stockQuantity,
            rentalQuantity: variant.rentalQuantity,
            weightKg: variant.weightKg,
            isActive: variant.isActive,
            sortOrder: index,
          }))
        } : undefined
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/mobile-solutions');
    revalidatePath('/marula-oil');
    revalidatePath('/rentals');

    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    // Delete existing images, specs, and variants, then recreate
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productSpec.deleteMany({ where: { productId: id } });
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        description: data.description,
        longDescription: data.longDescription,
        category: data.category,
        subcategory: data.subcategory,
        listingType: data.listingType,
        price: data.price,
        salePrice: data.salePrice,
        rentalPriceDaily: data.rentalPriceDaily,
        rentalPriceWeekly: data.rentalPriceWeekly,
        rentalPriceMonthly: data.rentalPriceMonthly,
        rentalDeposit: data.rentalDeposit,
        sku: data.sku,
        stockQuantity: data.stockQuantity,
        rentalQuantity: data.rentalQuantity,
        weightKg: data.weightKg,
        requiresDeliveryQuote: data.requiresDeliveryQuote,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        images: {
          create: data.images.map((url, index) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index,
          }))
        },
        specs: data.specs && data.specs.length > 0 ? {
          create: data.specs.map((spec, index) => ({
            label: spec.label,
            value: spec.value,
            sortOrder: index,
          }))
        } : undefined,
        variants: data.variants && data.variants.length > 0 ? {
          create: data.variants.map((variant, index) => ({
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            rentalPriceDaily: variant.rentalPriceDaily,
            rentalPriceWeekly: variant.rentalPriceWeekly,
            rentalPriceMonthly: variant.rentalPriceMonthly,
            stockQuantity: variant.stockQuantity,
            rentalQuantity: variant.rentalQuantity,
            weightKg: variant.weightKg,
            isActive: variant.isActive,
            sortOrder: index,
          }))
        } : undefined
      }
    });

    revalidatePath('/admin/products');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/');
    revalidatePath('/mobile-solutions');
    revalidatePath('/marula-oil');

    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/mobile-solutions');
    revalidatePath('/marula-oil');

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isActive }
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/mobile-solutions');
    revalidatePath('/marula-oil');

    return { success: true };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { success: false, error: "Failed to update product status" };
  }
}

export async function getProducts(options?: {
  category?: ProductCategory;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  const where = {
    ...(options?.category && { category: options.category }),
    ...(options?.isActive !== undefined && { isActive: options.isActive }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          take: 1, // Just to check if variants exist
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      specs: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });
}
