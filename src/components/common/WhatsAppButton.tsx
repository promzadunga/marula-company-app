'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string; // Format: country code + number, e.g., "27123456789"
  message?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi! I'm interested in your products. Can you help me?"
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Always visible popup */}
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-[280px]">
        <p className="text-sm font-medium text-brown-900 mb-1">Need help?</p>
        <p className="text-sm text-brown-600 mb-3">
          Chat with us on WhatsApp for quick assistance.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-600 transition"
        >
          <MessageCircle size={18} />
          Start Chat
        </a>
      </div>
    </div>
  );
}
