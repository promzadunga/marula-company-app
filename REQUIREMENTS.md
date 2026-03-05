# E-Commerce Platform - Technical Requirements

## Project Overview

A unified e-commerce platform supporting **product sales**, **equipment rentals**, and **multi-image product galleries** with PayFast payment integration.

### Product Lines

| Product Line | Products | Transaction Types |
|-------------|----------|-------------------|
| Mobile Solutions | Fridges, Toilets, Clinics | Sales + Rentals |
| Marula Oil | Pure oils, Gift sets, Bundles | Sales only |

---

## Key Features

- [ ] Unified shopping cart supporting both sales and rentals
- [ ] Multi-image product galleries with slider/carousel view
- [ ] Admin panel for product, order, and rental management
- [ ] PayFast payment integration
- [ ] Rental calendar with availability checking
- [ ] Order and rental confirmation emails
- [ ] Mobile-responsive design

---

## User Roles

| Role | Capabilities |
|------|-------------|
| Customer | Browse, add to cart, checkout, view order history, request rentals |
| Admin | Manage products, images, orders, rentals, inventory, settings |

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 | React framework with App Router |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | PostgreSQL | Via Neon Serverless |
| ORM | Prisma | Type-safe database access |
| Images | Cloudinary | Image hosting & transformations |
| Payments | PayFast | South African payment gateway |
| Email | Resend | Transactional emails |
| Auth | NextAuth.js | Admin authentication |
| Hosting | Vercel | Serverless deployment |
| Forms | React Hook Form | Form handling + Zod validation |
| Calendar | react-day-picker | Rental date selection |
| Drag & Drop | dnd-kit | Image reordering in admin |

---

## Site Architecture

### Public Pages

```
/                           → Homepage (hero, featured products, categories)
/mobile-solutions           → Mobile Solutions category
  /mobile-solutions/fridges
  /mobile-solutions/toilets
  /mobile-solutions/clinics
/marula-oil                 → Marula Oil category
  /marula-oil/pure-oils
  /marula-oil/gift-sets
  /marula-oil/bundles
/product/[slug]             → Product detail (images, specs, buy/rent)
/cart                       → Shopping cart
/checkout                   → Customer details + PayFast
/order-success              → Confirmation page
/rental-request             → Rental inquiry form
/contact                    → Contact form
```

### Admin Pages

```
/admin                      → Dashboard
/admin/products             → Product list + add/edit
/admin/products/[id]        → Edit product + images
/admin/orders               → Order management
/admin/rentals              → Rental management + calendar
/admin/settings             → Business settings
```

---

## Database Schema

### Products Table
- `id`, `slug`, `name`, `description`, `long_description`
- Categories: `category` (mobile-solutions | marula-oil), `subcategory`
- Pricing: `price`, `sale_price`
- Rental pricing: `is_rentable`, `rental_price_daily/weekly/monthly`, `rental_deposit`
- Inventory: `sku`, `stock_quantity`, `rental_quantity`
- Shipping: `weight_kg`, `requires_delivery_quote`
- Status: `is_active`, `is_featured`

### Product Images Table
- `product_id`, `url`, `public_id` (Cloudinary)
- `thumbnail_url`, `alt_text`, `caption`
- `is_primary`, `sort_order`

### Product Specs Table
- `product_id`, `spec_name`, `spec_value`, `sort_order`

### Orders Table
- `order_number`, `order_type` (sale | rental | mixed), `status`
- Customer: `customer_name/email/phone`
- Shipping: `shipping_address/city/province/postal`, `delivery_notes`
- Amounts: `subtotal`, `shipping_cost`, `deposit_total`, `total`
- Payment: `payfast_id`, `payment_status`, `paid_at`

### Order Items Table
- `order_id`, `product_id`
- Snapshot: `product_name`, `product_image`
- Purchase: `item_type` (sale | rental), `quantity`, `unit_price`, `total_price`
- Rental: `rental_start`, `rental_end`, `rental_days`, `deposit_amount`

### Rentals Table
- `order_item_id`, `product_id`
- Period: `start_date`, `end_date`
- Status: `status` (confirmed, active, returned, overdue, cancelled)
- Deposit: `deposit_amount`, `deposit_returned`, `deposit_returned_at`
- Tracking: `delivered_at`, `returned_at`, `notes`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (with filters) |
| GET | /api/products/[slug] | Get product with images & specs |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/[id] | Update product (admin) |
| DELETE | /api/products/[id] | Delete product (admin) |
| POST | /api/images/upload | Upload image to Cloudinary |
| DELETE | /api/images/[id] | Delete image |
| PUT | /api/images/reorder | Update image sort order |
| GET | /api/rentals/availability | Check rental availability |
| POST | /api/rentals | Create rental booking |
| PUT | /api/rentals/[id]/status | Update rental status |
| POST | /api/orders | Create order |
| GET | /api/orders/[id] | Get order details |
| PUT | /api/orders/[id]/status | Update order status |
| POST | /api/payfast/notify | PayFast ITN webhook |

---

## User Flows

### Purchase Flow
```
Browse → View Product → Add to Cart → Checkout → PayFast → Success
```

### Rental Flow
```
Browse → View Product → Select 'Rent' → Choose Dates → Add to Cart → Checkout → PayFast → Success
```

### Payment Flow (PayFast)
```
Customer Checkout
       ↓
Create Order (status: pending)
       ↓
Generate PayFast Form Data + Signature
       ↓
Redirect to PayFast
       ↓
   ┌───────┴───────┐
   ↓               ↓
Success         Failed
   ↓               ↓
ITN Webhook    Return to cart
   ↓
Verify signature + amount
   ↓
Update order (status: paid)
   ↓
Send confirmation email
   ↓
Redirect to success page
```

---

## Implementation Steps

### Phase 1: Foundation
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Prisma with Neon PostgreSQL
- [ ] Create database schema and run migrations
- [ ] Set up environment variables

### Phase 2: Frontend - Public Pages
- [ ] Create layout components (Header, Footer)
- [ ] Build Homepage with hero, featured products, category cards
- [ ] Create category listing pages (mobile-solutions, marula-oil)
- [ ] Create subcategory pages
- [ ] Build ProductCard component

### Phase 3: Product Detail Page
- [ ] Create product detail page layout
- [ ] Build ImageGallery component (multi-image slider)
- [ ] Create ProductSpecs component
- [ ] Implement buy/rent selection UI

### Phase 4: Admin - Product Management
- [ ] Set up NextAuth.js for admin authentication
- [ ] Create admin layout with sidebar
- [ ] Build admin dashboard with stats
- [ ] Create product list page with CRUD operations
- [ ] Build product form (basic info, pricing, rental pricing)

### Phase 5: Admin - Image Management
- [ ] Set up Cloudinary integration
- [ ] Build ImageUploader component (drag & drop)
- [ ] Create ImageGalleryManager (reorder, set primary, delete)
- [ ] Implement image upload API route

### Phase 6: Shopping Cart
- [ ] Create CartProvider (React Context)
- [ ] Build CartDrawer component
- [ ] Create CartItem component
- [ ] Implement cart persistence (localStorage)
- [ ] Handle both sale and rental items in cart

### Phase 7: Checkout & Payments
- [ ] Create checkout page with customer details form
- [ ] Integrate PayFast payment gateway
- [ ] Build PayFast ITN webhook handler
- [ ] Create order success page
- [ ] Implement order confirmation emails (Resend)

### Phase 8: Rental System
- [ ] Build RentalDatePicker component
- [ ] Create rental availability API
- [ ] Implement rental pricing calculator (daily/weekly/monthly)
- [ ] Create rental booking flow

### Phase 9: Admin - Rentals & Orders
- [ ] Build RentalCalendar component
- [ ] Create rental status management
- [ ] Build orders management page
- [ ] Implement order status updates

### Phase 10: Polish & Testing
- [ ] Mobile responsive testing
- [ ] Email templates design
- [ ] Error handling & validation
- [ ] Performance optimization
- [ ] Security review

---

## Project Structure

```
marula-company-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Homepage
│   ├── mobile-solutions/
│   │   ├── page.tsx
│   │   └── [subcategory]/page.tsx
│   ├── marula-oil/
│   │   ├── page.tsx
│   │   └── [subcategory]/page.tsx
│   ├── product/
│   │   └── [slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── order-success/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── rentals/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── products/route.ts
│       ├── images/
│       │   ├── upload/route.ts
│       │   └── [id]/route.ts
│       ├── orders/route.ts
│       ├── rentals/
│       │   ├── route.ts
│       │   └── availability/route.ts
│       └── payfast/
│           ├── notify/route.ts
│           └── cancel/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ProductSpecs.tsx
│   │   └── RentalDatePicker.tsx
│   ├── cart/
│   │   ├── CartProvider.tsx
│   │   ├── CartDrawer.tsx
│   │   └── CartItem.tsx
│   ├── admin/
│   │   ├── ImageUploader.tsx
│   │   ├── ImageGalleryManager.tsx
│   │   ├── RentalCalendar.tsx
│   │   └── SpecsEditor.tsx
│   └── ui/
├── lib/
│   ├── db.ts
│   ├── cloudinary.ts
│   ├── payfast.ts
│   ├── email.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── images/
├── package.json
├── tailwind.config.js
└── .env.local
```

---

## Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "@prisma/client": "^5.x",
    "cloudinary": "^1.x",
    "next-auth": "^4.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "react-day-picker": "^8.x",
    "date-fns": "^3.x",
    "resend": "^3.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "tailwindcss": "^3.x",
    "typescript": "^5.x"
  }
}
```

---

## Environment Variables

```env
# Database
DATABASE_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# PayFast
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Resend
RESEND_API_KEY=
```

---

## Cost Estimate

| Service | Monthly | Notes |
|---------|---------|-------|
| Vercel (hosting) | R0 | Free tier |
| Neon PostgreSQL | R0 | Free tier |
| Cloudinary (images) | R0 | 25GB free |
| PayFast | R0 | 3.5% per transaction |
| Resend (email) | R0 | 3K/month free |
| Domain (.co.za) | ~R12 | R150/year |

---

## Next Steps

1. Review this requirements document
2. Confirm the technology choices
3. Set up accounts (Neon, Cloudinary, PayFast, Resend)
4. Begin Phase 1: Foundation
