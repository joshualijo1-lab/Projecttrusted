'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';

type UploadedImage = {
  url: string;
  alt: string;
};

export function ImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsUploading(true);

    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (!validFiles.length) {
      setIsUploading(false);
      return;
    }

    const signatureResponse = await fetch('/api/upload-signature', { method: 'POST' });
    const signaturePayload = await signatureResponse.json();

    const uploads = validFiles.slice(0, 6).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signaturePayload.apiKey);
      formData.append('timestamp', String(signaturePayload.timestamp));
      formData.append('signature', signaturePayload.signature);
      formData.append('folder', signaturePayload.folder);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await cloudinaryResponse.json();
      return { url: data.secure_url as string, alt: file.name };
    });

    const uploaded = await Promise.all(uploads);
    setImages((prev) => [...prev, ...uploaded]);
    setIsUploading(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-700">Photos (max 6)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => handleUpload(event.target.files)}
        className="block w-full text-sm"
      />
      <p className="text-xs text-slate-500">JPEG/PNG only, max 5MB each.</p>
      {isUploading ? <p className="text-sm text-slate-500">Uploading...</p> : null}
      <div className="grid grid-cols-3 gap-2">
        {images.map((image) => (
          <div key={image.url} className="relative h-24 overflow-hidden rounded-md bg-slate-100">
            <Image src={image.url} alt={image.alt} fill className="object-cover" />
            <input type="hidden" name="photos" value={image.url} />
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => setImages([])}>
        Clear photos
      </Button>
    </div>
  );
}
