'use client';

import { UploadDropzone } from "@/lib/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  endpoint: keyof OurFileRouter;
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({ endpoint, value, onChange, maxFiles = 10 }: ImageUploadProps) {
  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  return (
    <div className="space-y-4">
      {/* Uploaded Images Preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={url}
                alt="Upload"
                fill
                className="object-cover"
              />
              <button
                onClick={() => onRemove(url)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      {value.length < maxFiles && (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            if (res) {
              const newUrls = res.map((file) => file.url);
              onChange([...value, ...newUrls]);
            }
          }}
          onUploadError={(error: Error) => {
            console.error(error);
            alert(`Upload error: ${error.message}`);
          }}
          className="ut-button:bg-primary-500 ut-button:ut-readying:bg-primary-500/50 ut-label:text-brown-900 ut-allowed-content:text-gray-600"
        />
      )}
    </div>
  );
}
