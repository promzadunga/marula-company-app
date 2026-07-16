import { Resend } from 'resend';
import { formatCurrency, formatDate } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'Marula Company Sales <sales@marulacompany.co.za>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sales@marulacompany.co.za';

// ── Interfaces ──────────────────────────────────────────────────────

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostal: string;
  items: {
    name: string;
    variantName?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  total: number;
}

export interface RentalEmailData {
  orderNumber: string;
  rentalNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  productName: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  dailyRate: number;
  rentalTotal: number;
  depositAmount: number;
  grandTotal: number;
}

// ── Private helpers ─────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

function emailWrapper(title: string, body: string): string {
  const { contact, locations, website } = siteConfig;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#16a34a;padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;">Marula Company</h1>
          </td>
        </tr>
        <!-- Title -->
        <tr>
          <td style="padding:24px 32px 8px;">
            <h2 style="margin:0;color:#1a1a1a;font-size:20px;">${title}</h2>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:8px 32px 24px;color:#333333;font-size:14px;line-height:1.6;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-weight:600;">Contact Us</p>
            <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">
              ${contact.email} &nbsp;|&nbsp; ${contact.phone}
            </p>
            <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">
              ${website}
            </p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;">
            <p style="margin:0 0 4px;font-size:11px;color:#9ca3af;">
              <strong>${locations.limpopo.name}:</strong>
              ${locations.limpopo.address}, ${locations.limpopo.city}, ${locations.limpopo.province} ${locations.limpopo.postalCode}
            </p>
            <p style="margin:0;font-size:11px;color:#9ca3af;">
              <strong>${locations.gauteng.name}:</strong>
              ${locations.gauteng.address}, ${locations.gauteng.city}, ${locations.gauteng.province} ${locations.gauteng.postalCode}
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatItemsTable(items: OrderEmailData['items']): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">
        ${item.name}${item.variantName ? ` <span style="color:#6b7280;">(${item.variantName})</span>` : ''}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;">${formatCurrency(item.totalPrice)}</td>
    </tr>`
    )
    .join('');

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:4px;margin:12px 0;">
    <tr style="background:#f9fafb;">
      <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Item</th>
      <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Qty</th>
      <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Price</th>
      <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Total</th>
    </tr>
    ${rows}
  </table>`;
}

// ── Exported send functions ─────────────────────────────────────────

export async function sendOrderConfirmation(data: OrderEmailData) {
  const body = `
    <p>Hi ${data.customerName},</p>
    <p>Thank you for your order! We've received it and will begin processing it shortly.</p>

    <p style="margin:16px 0 4px;font-weight:600;">Order #${data.orderNumber}</p>

    ${formatItemsTable(data.items)}

    <table width="100%" style="margin:8px 0 16px;">
      <tr>
        <td style="font-size:13px;color:#6b7280;">Subtotal</td>
        <td style="font-size:13px;text-align:right;">${formatCurrency(data.subtotal)}</td>
      </tr>
      <tr>
        <td style="font-size:14px;font-weight:700;padding-top:4px;">Total</td>
        <td style="font-size:14px;font-weight:700;text-align:right;padding-top:4px;">${formatCurrency(data.total)}</td>
      </tr>
    </table>

    <p style="margin:16px 0 4px;font-weight:600;">Delivery Address</p>
    <p style="margin:0;font-size:13px;color:#333;">
      ${data.shippingAddress}<br>
      ${data.shippingCity}${data.shippingProvince ? `, ${data.shippingProvince}` : ''}${data.shippingPostal ? ` ${data.shippingPostal}` : ''}
    </p>

    <p style="margin:20px 0 0;">If you have any questions, feel free to reply to this email or contact us.</p>
  `;

  await sendEmail(
    data.customerEmail,
    `Order Confirmation - ${data.orderNumber}`,
    emailWrapper('Order Confirmation', body)
  );
}

export async function sendOrderAdminNotification(data: OrderEmailData) {
  const body = `
    <p>A new order has been placed.</p>

    <p style="margin:16px 0 4px;font-weight:600;">Order #${data.orderNumber}</p>

    <table width="100%" style="margin:8px 0 16px;font-size:13px;">
      <tr><td style="color:#6b7280;padding:2px 0;">Customer</td><td>${data.customerName}</td></tr>
      <tr><td style="color:#6b7280;padding:2px 0;">Email</td><td>${data.customerEmail}</td></tr>
      <tr><td style="color:#6b7280;padding:2px 0;">Phone</td><td>${data.customerPhone}</td></tr>
    </table>

    ${formatItemsTable(data.items)}

    <p style="font-size:14px;font-weight:700;margin:12px 0;">Total: ${formatCurrency(data.total)}</p>

    <p style="margin:16px 0 4px;font-weight:600;">Delivery Address</p>
    <p style="margin:0;font-size:13px;color:#333;">
      ${data.shippingAddress}<br>
      ${data.shippingCity}${data.shippingProvince ? `, ${data.shippingProvince}` : ''}${data.shippingPostal ? ` ${data.shippingPostal}` : ''}
    </p>
  `;

  await sendEmail(
    ADMIN_EMAIL,
    `New Order - ${data.orderNumber} - ${formatCurrency(data.total)}`,
    emailWrapper('New Order Received', body)
  );
}

export async function sendRentalConfirmation(data: RentalEmailData) {
  const body = `
    <p>Hi ${data.customerName},</p>
    <p>Thank you for your rental request! We've received it and will confirm availability shortly.</p>

    <p style="margin:16px 0 4px;font-weight:600;">Rental #${data.rentalNumber}</p>
    <p style="margin:0;font-size:12px;color:#6b7280;">Order #${data.orderNumber}</p>

    <table width="100%" style="margin:12px 0;font-size:13px;border:1px solid #e5e7eb;border-radius:4px;">
      <tr style="background:#f9fafb;">
        <td colspan="2" style="padding:10px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">${data.productName}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Rental Period</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatDate(data.startDate)} – ${formatDate(data.endDate)}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Duration</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${data.rentalDays} day${data.rentalDays !== 1 ? 's' : ''}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Daily Rate</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatCurrency(data.dailyRate)}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Rental Total</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatCurrency(data.rentalTotal)}</td>
      </tr>
      ${data.depositAmount > 0 ? `
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Deposit</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatCurrency(data.depositAmount)}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:8px 12px;font-weight:700;">Grand Total</td>
        <td style="padding:8px 12px;font-weight:700;">${formatCurrency(data.grandTotal)}</td>
      </tr>
    </table>

    ${data.deliveryAddress ? `
    <p style="margin:16px 0 4px;font-weight:600;">Delivery Address</p>
    <p style="margin:0;font-size:13px;color:#333;">
      ${data.deliveryAddress}<br>
      ${data.deliveryCity}
    </p>` : ''}

    <p style="margin:20px 0 0;">We'll be in touch to confirm your rental. If you have any questions, feel free to reply to this email or contact us.</p>
  `;

  await sendEmail(
    data.customerEmail,
    `Rental Confirmation - ${data.rentalNumber}`,
    emailWrapper('Rental Confirmation', body)
  );
}

export async function sendRentalAdminNotification(data: RentalEmailData) {
  const body = `
    <p>A new rental request has been submitted.</p>

    <p style="margin:16px 0 4px;font-weight:600;">Rental #${data.rentalNumber}</p>
    <p style="margin:0;font-size:12px;color:#6b7280;">Order #${data.orderNumber}</p>

    <table width="100%" style="margin:8px 0 16px;font-size:13px;">
      <tr><td style="color:#6b7280;padding:2px 0;">Customer</td><td>${data.customerName}</td></tr>
      <tr><td style="color:#6b7280;padding:2px 0;">Email</td><td>${data.customerEmail}</td></tr>
      <tr><td style="color:#6b7280;padding:2px 0;">Phone</td><td>${data.customerPhone}</td></tr>
    </table>

    <table width="100%" style="margin:12px 0;font-size:13px;border:1px solid #e5e7eb;border-radius:4px;">
      <tr style="background:#f9fafb;">
        <td colspan="2" style="padding:10px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">${data.productName}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Period</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatDate(data.startDate)} – ${formatDate(data.endDate)} (${data.rentalDays} days)</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Daily Rate</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatCurrency(data.dailyRate)}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Rental Total</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatCurrency(data.rentalTotal)}</td>
      </tr>
      ${data.depositAmount > 0 ? `
      <tr>
        <td style="padding:6px 12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Deposit</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${formatCurrency(data.depositAmount)}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:8px 12px;font-weight:700;">Grand Total</td>
        <td style="padding:8px 12px;font-weight:700;">${formatCurrency(data.grandTotal)}</td>
      </tr>
    </table>

    ${data.deliveryAddress ? `
    <p style="margin:16px 0 4px;font-weight:600;">Delivery Address</p>
    <p style="margin:0;font-size:13px;color:#333;">
      ${data.deliveryAddress}<br>
      ${data.deliveryCity}
    </p>` : ''}
  `;

  await sendEmail(
    ADMIN_EMAIL,
    `New Rental - ${data.rentalNumber} - ${data.productName}`,
    emailWrapper('New Rental Request', body)
  );
}
