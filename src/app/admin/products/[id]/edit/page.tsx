'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { updateProduct, getProductById, ProductFormData, VariantFormData } from "../../actions";
import { ProductCategory, ProductSubcategory } from "@prisma/client";

const CATEGORY_OPTIONS = [
  { value: 'MOBILE_SOLUTIONS', label: 'Mobile Solutions' },
  { value: 'MARULA_OIL', label: 'Marula Oil' },
];


const SUBCATEGORY_OPTIONS: Record<ProductCategory, { value: ProductSubcategory; label: string }[]> = {
  MOBILE_SOLUTIONS: [
    { value: 'FREEZERS', label: 'Freezers' },
    { value: 'TOILETS', label: 'Mobile Toilets' },
    { value: 'CLINICS', label: 'Mobile Clinics' },
    { value: 'TRAILERS', label: 'Trailers' },
    { value: 'COLD_ROOMS', label: 'Cold Rooms' },
    { value: 'ICE', label: 'Ice' },
    { value: 'INSULATED_PANELS', label: 'Insulated Panels' },
    { value: 'STEEL_STRUCTURES', label: 'Steel Structures' },
  ],
  MARULA_OIL: [
    { value: 'MARULA_OIL_RETAIL', label: 'Retail (50ml - 500ml)' },
    { value: 'MARULA_OIL_WHOLESALE', label: 'Wholesale (1L - 20L)' },
    { value: 'MARULA_OIL_BULK', label: 'Bulk/Industrial (drums, tons)' },
  ],
};

const SIZE_SUGGESTIONS: Record<ProductCategory, string[]> = {
  MARULA_OIL: ['50ml', '100ml', '250ml', '500ml', '1 Litre', '5 Litres', '10 Litres', '20 Litres', '25 Litres', '200L Drum', '1 Ton'],
  MOBILE_SOLUTIONS: ['Small', 'Medium', 'Large', 'Extra Large', '2m x 1.5m', '3m x 2m', '4m x 2.5m', '6m x 2.5m'],
};

interface VariantState extends VariantFormData {
  tempId: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    category: 'MOBILE_SOLUTIONS' as ProductCategory,
    subcategory: 'FREEZERS' as ProductSubcategory,
    availableForRental: false,
    price: '',
    salePrice: '',
    rentalPriceDaily: '',
    rentalDeposit: '',
    sku: '',
    stockQuantity: '1',
    rentalQuantity: '',
    weightKg: '',
    requiresDeliveryQuote: false,
    isActive: true,
    isFeatured: false,
  });

  // Check if product can be rented (based on checkbox)
  const isRentable = formData.availableForRental;

  const [images, setImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);
  const [variants, setVariants] = useState<VariantState[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const product = await getProductById(productId);
        if (!product) {
          setError('Product not found');
          return;
        }

        // Derive availableForRental from listingType
        const isRentalEnabled = product.listingType === 'RENTAL_ONLY' || product.listingType === 'SALE_AND_RENTAL';

        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          longDescription: product.longDescription || '',
          category: product.category,
          subcategory: product.subcategory || 'FREEZERS',
          availableForRental: isRentalEnabled,
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() || '',
          rentalPriceDaily: product.rentalPriceDaily?.toString() || '',
          rentalDeposit: product.rentalDeposit?.toString() || '',
          sku: product.sku || '',
          stockQuantity: product.stockQuantity.toString(),
          rentalQuantity: product.rentalQuantity?.toString() || '',
          weightKg: product.weightKg?.toString() || '',
          requiresDeliveryQuote: product.requiresDeliveryQuote,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        });

        setImages(product.images.map(img => img.url));
        setSpecs(product.specs.map(spec => ({ label: spec.label, value: spec.value })));
        setVariants(product.variants.map(v => ({
          tempId: v.id,
          id: v.id,
          name: v.name,
          sku: v.sku || '',
          price: v.price,
          salePrice: v.salePrice || undefined,
          rentalPriceDaily: v.rentalPriceDaily || undefined,
          stockQuantity: v.stockQuantity,
          rentalQuantity: v.rentalQuantity || undefined,
          weightKg: v.weightKg || undefined,
          isActive: v.isActive,
        })));
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setFetching(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleCategoryChange = (category: ProductCategory) => {
    const defaultSubcategory = SUBCATEGORY_OPTIONS[category][0].value;
    // Default rental enabled for Mobile Solutions, disabled for Marula Oil
    const defaultAvailableForRental = category === 'MOBILE_SOLUTIONS';
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: defaultSubcategory,
      availableForRental: defaultAvailableForRental,
    }));
  };

  // Spec handlers
  const addSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Variant handlers
  const addVariant = (suggestedName?: string) => {
    const newVariant: VariantState = {
      tempId: Math.random().toString(36).substr(2, 9),
      name: suggestedName || '',
      sku: '',
      price: 0,
      stockQuantity: 0,
      isActive: true,
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (tempId: string, field: keyof VariantFormData, value: string | number | boolean | undefined) => {
    setVariants(variants.map(v =>
      v.tempId === tempId ? { ...v, [field]: value } : v
    ));
  };

  const removeVariant = (tempId: string) => {
    setVariants(variants.filter(v => v.tempId !== tempId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine listing type based on rental checkbox
      const listingType = formData.availableForRental ? 'SALE_AND_RENTAL' : 'SALE_ONLY';

      const productData: ProductFormData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        longDescription: formData.longDescription || undefined,
        category: formData.category,
        subcategory: formData.subcategory,
        listingType: listingType,
        price: parseFloat(formData.price) || 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        rentalPriceDaily: formData.availableForRental && formData.rentalPriceDaily ? parseFloat(formData.rentalPriceDaily) : undefined,
        rentalDeposit: formData.availableForRental && formData.rentalDeposit ? parseFloat(formData.rentalDeposit) : undefined,
        sku: formData.sku || undefined,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        rentalQuantity: formData.availableForRental && formData.rentalQuantity ? parseInt(formData.rentalQuantity) : undefined,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined,
        requiresDeliveryQuote: formData.requiresDeliveryQuote,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        images,
        specs: specs.filter(s => s.label && s.value),
        variants: variants.filter(v => v.name).map(v => ({
          name: v.name,
          sku: v.sku || undefined,
          price: v.price,
          salePrice: v.salePrice,
          stockQuantity: v.stockQuantity,
          weightKg: v.weightKg,
          isActive: v.isActive,
        })),
      };

      const result = await updateProduct(productId, productData);

      if (result.success) {
        router.push('/admin/products');
      } else {
        setError(result.error || 'Failed to update product');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-brown-900">Edit Product</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brown-900">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={4}
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brown-900">Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory *
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value as ProductSubcategory }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {SUBCATEGORY_OPTIONS[formData.category].map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brown-900">Product Images</h2>
          <p className="text-sm text-gray-500">Upload up to 10 images. The first image will be the primary image.</p>

          <ImageUpload
            endpoint="productImage"
            value={images}
            onChange={setImages}
            maxFiles={10}
          />
        </div>

        {/* Sizes/Variants */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-brown-900">Sizes / Variants</h2>
              <p className="text-sm text-gray-500">
                {formData.category === 'MARULA_OIL'
                  ? 'Add different bottle/container sizes (e.g., 50ml, 1 Litre, 20 Litres)'
                  : 'Add different unit sizes (e.g., Small, Medium, Large)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => addVariant()}
              className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
            >
              <Plus size={16} />
              Add Size
            </button>
          </div>

          {/* Suggested Sizes */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Quick add:</span>
            {SIZE_SUGGESTIONS[formData.category].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => addVariant(size)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                {size}
              </button>
            ))}
          </div>

          {variants.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No sizes added yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Add sizes if your product comes in different options.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant.tempId} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-brown-900">{variant.name || 'New Size'}</h4>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.tempId)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Size Name *</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(variant.tempId, 'name', e.target.value)}
                        placeholder="e.g., 500ml"
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Price (ZAR) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.price || ''}
                        onChange={(e) => updateVariant(variant.tempId, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Sale Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.salePrice || ''}
                        onChange={(e) => updateVariant(variant.tempId, 'salePrice', parseFloat(e.target.value) || undefined)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stockQuantity || ''}
                        onChange={(e) => updateVariant(variant.tempId, 'stockQuantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
                      <input
                        type="text"
                        value={variant.sku || ''}
                        onChange={(e) => updateVariant(variant.tempId, 'sku', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={variant.weightKg || ''}
                        onChange={(e) => updateVariant(variant.tempId, 'weightKg', parseFloat(e.target.value) || undefined)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Base Pricing */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brown-900">
            {variants.length > 0 ? 'Base Pricing (fallback)' : 'Pricing'}
          </h2>
          {variants.length > 0 && (
            <p className="text-sm text-gray-500">This is used when no variant is selected or as a display price.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (ZAR) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (ZAR)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.salePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Rental Option */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="availableForRental"
                checked={formData.availableForRental}
                onChange={(e) => setFormData(prev => ({ ...prev, availableForRental: e.target.checked }))}
                className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="availableForRental" className="text-sm font-medium text-gray-700">
                Also available for rental
              </label>
            </div>

            {/* Rental Pricing (shown when checkbox is checked) */}
            {isRentable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 border-l-2 border-primary-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (ZAR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.rentalPriceDaily}
                    onChange={(e) => setFormData(prev => ({ ...prev, rentalPriceDaily: e.target.value }))}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refundable Deposit (ZAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.rentalDeposit}
                    onChange={(e) => setFormData(prev => ({ ...prev, rentalDeposit: e.target.value }))}
                    placeholder="e.g. 1000"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brown-900">
            {variants.length > 0 ? 'Base Inventory (fallback)' : 'Inventory'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity (for sale) *</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            {isRentable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units Available for Rental</label>
                <input
                  type="number"
                  min="0"
                  value={formData.rentalQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentalQuantity: e.target.value }))}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.weightKg}
                onChange={(e) => setFormData(prev => ({ ...prev, weightKg: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requiresDeliveryQuote"
              checked={formData.requiresDeliveryQuote}
              onChange={(e) => setFormData(prev => ({ ...prev, requiresDeliveryQuote: e.target.checked }))}
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="requiresDeliveryQuote" className="text-sm font-medium text-gray-700">
              Requires Delivery Quote (for large items)
            </label>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brown-900">Specifications</h2>
            <button
              type="button"
              onClick={addSpec}
              className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
            >
              <Plus size={16} />
              Add Spec
            </button>
          </div>

          {specs.length === 0 ? (
            <p className="text-sm text-gray-500">No specifications added yet.</p>
          ) : (
            <div className="space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => updateSpec(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brown-900">Status</h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible on website)
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                Featured (show on homepage)
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
