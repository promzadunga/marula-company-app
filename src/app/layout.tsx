import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/contexts/CartContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { Toaster } from 'react-hot-toast';
import "@uploadthing/react/styles.css";
import { siteConfig } from '@/lib/config';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: `The Marula Company - Mobile Solutions & Marula Oil`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <CartProvider>
            <PublicLayout>
              {children}
            </PublicLayout>
            <WhatsAppButton
              phoneNumber={siteConfig.contact.whatsapp}
              message="Hi! I'm interested in your products/services. Can you help me?"
            />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
