import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admin User
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marula.co.za' },
    update: {},
    create: {
      email: 'admin@marula.co.za',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Clear existing product data
  await prisma.productImage.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  // Mobile Solutions Products - RENTAL ONLY
  const mobileFridge = await prisma.product.create({
    data: {
      slug: 'mobile-fridge-unit',
      name: 'Mobile Fridge Unit',
      description: 'High-quality mobile refrigeration unit perfect for events, catering, and temporary cold storage needs.',
      longDescription: 'Our mobile fridge units are designed for commercial use, featuring industrial-grade refrigeration technology that maintains consistent temperatures. Ideal for outdoor events, construction sites, and temporary installations.',
      category: 'MOBILE_SOLUTIONS',
      subcategory: 'FREEZERS',
      listingType: 'RENTAL_ONLY',
      price: 45000,
      rentalPriceDaily: 1500,
      rentalPriceWeekly: 8000,
      rentalPriceMonthly: 25000,
      rentalDeposit: 10000,
      stockQuantity: 0,
      rentalQuantity: 8,
      requiresDeliveryQuote: true,
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800',
            altText: 'Mobile Fridge Unit',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      specs: {
        create: [
          { label: 'Power', value: '220V / Solar Compatible', sortOrder: 0 },
          { label: 'Temperature Range', value: '-5°C to 10°C', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: 'Small (2m)', price: 35000, rentalPriceDaily: 1200, rentalPriceWeekly: 6500, rentalPriceMonthly: 20000, stockQuantity: 3, rentalQuantity: 2, sortOrder: 0, isActive: true },
          { name: 'Medium (2.5m)', price: 45000, rentalPriceDaily: 1500, rentalPriceWeekly: 8000, rentalPriceMonthly: 25000, stockQuantity: 4, rentalQuantity: 3, sortOrder: 1, isActive: true },
          { name: 'Large (3m)', price: 55000, rentalPriceDaily: 1800, rentalPriceWeekly: 10000, rentalPriceMonthly: 32000, stockQuantity: 2, rentalQuantity: 2, sortOrder: 2, isActive: true },
        ],
      },
    },
  });

  const mobileToilet = await prisma.product.create({
    data: {
      slug: 'mobile-toilet-unit',
      name: 'Mobile Toilet Unit',
      description: 'Durable and hygienic mobile toilet unit suitable for construction sites, events, and outdoor gatherings.',
      longDescription: 'Our mobile toilet provides a clean and comfortable solution for temporary sanitation needs. Features include hand sanitizer dispenser, ventilation system, and easy-clean surfaces.',
      category: 'MOBILE_SOLUTIONS',
      subcategory: 'TOILETS',
      listingType: 'RENTAL_ONLY',
      price: 15000,
      rentalPriceDaily: 500,
      rentalPriceWeekly: 2500,
      rentalPriceMonthly: 8000,
      rentalDeposit: 3000,
      stockQuantity: 0,
      rentalQuantity: 20,
      requiresDeliveryQuote: true,
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
            altText: 'Mobile Toilet Unit',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      specs: {
        create: [
          { label: 'Material', value: 'High-density polyethylene', sortOrder: 0 },
          { label: 'Features', value: 'Hand sanitizer, ventilation', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: 'Standard', price: 12000, rentalPriceDaily: 400, rentalPriceWeekly: 2000, rentalPriceMonthly: 6500, stockQuantity: 15, rentalQuantity: 12, sortOrder: 0, isActive: true },
          { name: 'VIP', price: 18000, rentalPriceDaily: 600, rentalPriceWeekly: 3000, rentalPriceMonthly: 10000, stockQuantity: 8, rentalQuantity: 6, sortOrder: 1, isActive: true },
          { name: 'Disabled Access', price: 22000, rentalPriceDaily: 700, rentalPriceWeekly: 3500, rentalPriceMonthly: 12000, stockQuantity: 5, rentalQuantity: 4, sortOrder: 2, isActive: true },
        ],
      },
    },
  });

  const mobileClinic = await prisma.product.create({
    data: {
      slug: 'mobile-clinic-unit',
      name: 'Mobile Clinic Unit',
      description: 'Fully equipped mobile clinic for healthcare outreach programs and emergency medical services.',
      longDescription: 'Our mobile clinic units are designed to bring healthcare to remote areas. Each unit comes equipped with examination facilities, basic medical equipment, and climate control.',
      category: 'MOBILE_SOLUTIONS',
      subcategory: 'CLINICS',
      listingType: 'SALE_AND_RENTAL',
      price: 250000,
      rentalPriceDaily: 5000,
      rentalPriceWeekly: 30000,
      rentalPriceMonthly: 100000,
      rentalDeposit: 50000,
      stockQuantity: 2,
      rentalQuantity: 2,
      requiresDeliveryQuote: true,
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
            altText: 'Mobile Clinic Unit',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      specs: {
        create: [
          { label: 'Rooms', value: 'Waiting area, consultation room', sortOrder: 0 },
          { label: 'Power', value: '220V with generator backup', sortOrder: 1 },
          { label: 'Climate Control', value: 'Air conditioning included', sortOrder: 2 },
        ],
      },
      variants: {
        create: [
          { name: '3m Container', price: 180000, rentalPriceDaily: 4000, rentalPriceWeekly: 22000, rentalPriceMonthly: 75000, stockQuantity: 1, rentalQuantity: 1, sortOrder: 0, isActive: true },
          { name: '6m Container', price: 250000, rentalPriceDaily: 5000, rentalPriceWeekly: 30000, rentalPriceMonthly: 100000, stockQuantity: 2, rentalQuantity: 2, sortOrder: 1, isActive: true },
          { name: '12m Container', price: 450000, rentalPriceDaily: 8000, rentalPriceWeekly: 50000, rentalPriceMonthly: 180000, stockQuantity: 1, rentalQuantity: 1, sortOrder: 2, isActive: true },
        ],
      },
    },
  });

  // Marula Oil Products - SALE ONLY
  const pureMarulaOil = await prisma.product.create({
    data: {
      slug: 'pure-marula-oil',
      name: 'Pure Marula Oil',
      description: 'Cold-pressed 100% pure marula oil. Premium quality for face, hair, and body.',
      longDescription: 'Our signature pure marula oil is cold-pressed from hand-selected marula kernels. Rich in antioxidants, omega fatty acids, and vitamins C and E, this lightweight oil absorbs quickly and leaves skin feeling nourished without greasiness.',
      category: 'MARULA_OIL',
      subcategory: 'MARULA_OIL_RETAIL',
      listingType: 'SALE_ONLY',
      price: 149,
      stockQuantity: 200,
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
            altText: 'Pure Marula Oil',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      specs: {
        create: [
          { label: 'Ingredients', value: '100% Sclerocarya Birrea Seed Oil', sortOrder: 0 },
          { label: 'Benefits', value: 'Hydrating, anti-aging, nourishing', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: '50ml', price: 149, salePrice: 129, stockQuantity: 100, sortOrder: 0, isActive: true },
          { name: '100ml', price: 249, salePrice: 219, stockQuantity: 80, sortOrder: 1, isActive: true },
          { name: '250ml', price: 449, stockQuantity: 50, sortOrder: 2, isActive: true },
          { name: '500ml', price: 799, stockQuantity: 30, sortOrder: 3, isActive: true },
        ],
      },
    },
  });

  const wholesaleMarulaOil = await prisma.product.create({
    data: {
      slug: 'wholesale-marula-oil',
      name: 'Wholesale Marula Oil',
      description: 'Bulk marula oil for businesses, spas, and resellers. Premium quality at wholesale prices.',
      longDescription: 'Our wholesale marula oil is perfect for businesses, spas, skincare product manufacturers, and resellers. Same premium quality as our retail products, available in larger quantities.',
      category: 'MARULA_OIL',
      subcategory: 'MARULA_OIL_WHOLESALE',
      listingType: 'SALE_ONLY',
      price: 1299,
      stockQuantity: 50,
      isActive: true,
      isFeatured: false,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=800',
            altText: 'Wholesale Marula Oil',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      specs: {
        create: [
          { label: 'Grade', value: 'Cosmetic Grade / Cold-Pressed', sortOrder: 0 },
          { label: 'Shelf Life', value: '24 months', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: '1 Litre', price: 1299, stockQuantity: 30, sortOrder: 0, isActive: true },
          { name: '5 Litres', price: 5499, stockQuantity: 20, sortOrder: 1, isActive: true },
          { name: '10 Litres', price: 9999, stockQuantity: 15, sortOrder: 2, isActive: true },
          { name: '20 Litres', price: 17999, stockQuantity: 10, sortOrder: 3, isActive: true },
        ],
      },
    },
  });

  const bulkMarulaOil = await prisma.product.create({
    data: {
      slug: 'bulk-marula-oil',
      name: 'Bulk Marula Oil',
      description: 'Industrial quantities of pure marula oil for manufacturers and large-scale operations.',
      longDescription: 'For manufacturers, cosmetic companies, and industrial applications. Our bulk marula oil maintains the same premium quality in industrial quantities. Contact us for custom orders.',
      category: 'MARULA_OIL',
      subcategory: 'MARULA_OIL_BULK',
      listingType: 'SALE_ONLY',
      price: 35000,
      stockQuantity: 10,
      requiresDeliveryQuote: true,
      isActive: true,
      isFeatured: false,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1563770660941-10a63607621e?w=800',
            altText: 'Bulk Marula Oil Drum',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      specs: {
        create: [
          { label: 'Grade', value: 'Cosmetic/Industrial Grade', sortOrder: 0 },
          { label: 'Certification', value: 'Available on request', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: '25 Litres', price: 35000, stockQuantity: 5, sortOrder: 0, isActive: true },
          { name: '200L Drum', price: 250000, stockQuantity: 3, sortOrder: 1, isActive: true },
          { name: '1 Ton (IBC)', price: 1100000, stockQuantity: 2, sortOrder: 2, isActive: true },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log('Products created:', mobileFridge.name, mobileToilet.name, mobileClinic.name, pureMarulaOil.name, wholesaleMarulaOil.name, bulkMarulaOil.name);
  console.log('\n========================================');
  console.log('ADMIN LOGIN CREDENTIALS:');
  console.log('Email: admin@marula.co.za');
  console.log('Password: admin123');
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
